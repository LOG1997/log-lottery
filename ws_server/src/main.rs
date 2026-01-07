use actix_cors::Cors;
use actix_web::{
    App, Error, HttpRequest, HttpResponse, HttpServer, Responder, post, rt, web, web::Payload,
};
use actix_ws::AggregatedMessage;
use futures_util::StreamExt as _;
use std::collections::HashMap;
use tokio::{
    pin, select,
    sync::{RwLock, broadcast},
    time::interval,
};

// 统一响应结构体
#[derive(serde::Serialize)]
struct ApiResponse<T> {
    code: i32,
    success: bool,
    msg: String,
    data: Option<T>,
}

impl<T> ApiResponse<T> {
    fn success_with_data(data: T, msg: String) -> Self {
        Self {
            code: 200,
            success: true,
            msg,
            data: Some(data),
        }
    }

    fn success_with_msg(msg: String) -> Self
    where
        T: Default, // 添加约束，确保T有默认值
    {
        Self {
            code: 200,
            success: true,
            msg,
            data: None,
        }
    }

    // 添加一个专门用于无数据响应的静态方法
    fn success_without_data(msg: String) -> ApiResponse<()> {
        ApiResponse {
            code: 200,
            success: true,
            msg,
            data: None,
        }
    }

    fn error(code: i32, msg: String) -> ApiResponse<()> {
        ApiResponse {
            code,
            success: false,
            msg,
            data: None,
        }
    }
}
// 定义消息类型（可以根据需求扩展为结构体）
type WsMessage = String;
#[derive(Clone)]
struct AppState {
    // 使用 HashMap 存储不同 user_signature 的广播通道
    tx_map: web::Data<RwLock<HashMap<String, broadcast::Sender<WsMessage>>>>,
}

#[post("/user-msg")]
async fn user_msg(req: HttpRequest, req_body: String, data: web::Data<AppState>) -> impl Responder {
    println!("All headers:");
    // 获取usersignature参数
    let target_user_signature = req
        .headers()
        .get("userSignature")
        .unwrap()
        .to_str()
        .unwrap();
    // 打印接收到的消息
    println!("Received /user-msg: {}", req_body);
    // 获取对应 user_signature 的发送端
    let tx_map = data.tx_map.read().await;
    if let Some(tx) = tx_map.get(target_user_signature) {
        match tx.send(req_body.clone()) {
            Ok(_) => HttpResponse::Ok().json(ApiResponse::<()>::success_without_data(
                "发送成功".to_string(),
            )),
            Err(e) => {
                eprintln!("Failed to send message: {}", e);
                HttpResponse::InternalServerError()
                    .json(ApiResponse::<()>::error(500, "系统服务异常".to_string()))
            }
        }
    } else {
        HttpResponse::NotFound().json(ApiResponse::<()>::error(
            404,
            "后台服务未启动，请联系管理员".to_string(),
        ))
    }
}

async fn echo(
    req: HttpRequest,
    stream: Payload,
    data: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    let (res, mut session, stream) = actix_ws::handle(&req, stream)?;
    println!("New WebSocket connection:{:?}", req.query_string());
    let user_signature = req.query_string().split("=").nth(1).unwrap();
    println!("user_signature: {}", user_signature);

    // 订阅广播通道（每个连接创建独立的接收端）
    // 为当前 user_signature 创建或获取广播通道
    let tx = {
        let mut tx_map = data.tx_map.write().await;
        if !tx_map.contains_key(user_signature) {
            // 为这个 user_signature 创建新的广播通道
            let (new_tx, _) = broadcast::channel::<WsMessage>(1024);
            tx_map.insert(user_signature.to_string(), new_tx.clone());
            new_tx
        } else {
            tx_map.get(user_signature).unwrap().clone()
        }
    };

    let mut rx = tx.subscribe();
    let mut stream = stream
        .aggregate_continuations()
        .max_continuation_size(2_usize.pow(20));

    // 启动异步任务处理 WebSocket 消息和广播消息
    rt::spawn(async move {
        // 同时监听：1. WebSocket 客户端消息 2. 广播通道消息
        loop {
            select! {
                // 监听来自客户端的 WebSocket 消息（原 echo 逻辑）
                msg = stream.next() => {
                    match msg {
                        Some(Ok(AggregatedMessage::Text(text))) => {
                            println!("WebSocket client sent: {}", text);
                            // 回声（可选：保留原 echo 功能）
                            // 如果是ping消息则不回声
                            if text != "ping" {
                                // 回声
                                if let Err(e) = session.text(text.clone()).await {
                                    eprintln!("Failed to send text: {}", e);
                                    break;
                                }
                            }
                        }
                        Some(Ok(AggregatedMessage::Binary(bin))) => {
                            println!("WebSocket client sent binary: {:?}", bin);
                            if let Err(e) = session.binary(bin).await {
                                eprintln!("Failed to send binary: {}", e);
                                break;
                            }
                        }
                        Some(Ok(AggregatedMessage::Ping(msg))) => {
                            println!("WebSocket client sent ping: {:?}", msg);
                            // if let Err(e) = session.pong(&msg).await {
                            //     eprintln!("Failed to send pong: {}", e);
                            //     break;
                            // }
                        }
                        // 客户端断开连接或出错，退出循环
                        None | Some(Err(_)) => {
                            println!("WebSocket connection closed");
                            break;
                        }
                        _ => {}
                    }
                }
                // 监听广播通道的消息（来自 /user-msg）
                msg = rx.recv() => {
                    match msg {
                        Ok(text) => {
                            // 将广播消息发送给 WebSocket 客户端
                            if let Err(e) = session.text(text).await {
                                eprintln!("Failed to send broadcast msg: {}", e);
                                break;
                            }
                        }
                        Err(broadcast::error::RecvError::Closed) => {
                            eprintln!("Broadcast channel closed");
                            break;
                        }
                        Err(broadcast::error::RecvError::Lagged(_)) => {
                            eprintln!("Broadcast message lagged, missed some messages");
                        }
                    }
                }
            }
        }

        // 关闭 WebSocket 连接
        let _ = session.close(None).await;
    });

    Ok(res)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let tx_map = web::Data::new(RwLock::new(HashMap::new()));
    let app_state = AppState { tx_map };

    HttpServer::new(move || {
        App::new()
            // 注入应用状态（广播通道发送端）
            .app_data(web::Data::new(app_state.clone()))
            // 跨域配置（生产环境需限制 origin）
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
                    .supports_credentials(),
            )
            .service(web::scope("/api").service(user_msg))
            .route("/echo", web::get().to(echo))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
