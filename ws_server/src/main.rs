use actix_cors::Cors;
use actix_web::{
    App, Error, HttpRequest, HttpResponse, HttpServer, Responder, get, post, rt, web, web::Payload,
};
use actix_ws::AggregatedMessage;
use futures_util::StreamExt as _;
use tokio::{pin, select, sync::broadcast, time::interval};
// use tokio_stream::wrappers::BroadcastMessage;

// 定义消息类型（可以根据需求扩展为结构体）
type WsMessage = String;
// 定义应用状态：存放广播通道的发送端
#[derive(Clone)]
struct AppState {
    tx: broadcast::Sender<WsMessage>,
}

#[post("/user-msg")]
async fn user_msg(req_body: String, data: web::Data<AppState>) -> impl Responder {
    // 打印接收到的消息
    println!("Received /user-msg: {}", req_body);
    // 将消息发送到广播通道
    match data.tx.send(req_body.clone()) {
        Ok(_) => HttpResponse::Ok().body("Message sent to WebSocket clients!"),
        Err(e) => {
            eprintln!("Failed to send message: {}", e);
            HttpResponse::InternalServerError().body("Failed to send message")
        }
    }
}

async fn echo(
    req: HttpRequest,
    stream: Payload,
    data: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    let (res, mut session, stream) = actix_ws::handle(&req, stream)?;
    println!("New WebSocket connection");

    // 订阅广播通道（每个连接创建独立的接收端）
    let mut rx = data.tx.subscribe();
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
                            if let Err(e) = session.text(text).await {
                                eprintln!("Failed to send text: {}", e);
                                break;
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
                            if let Err(e) = session.pong(&msg).await {
                                eprintln!("Failed to send pong: {}", e);
                                break;
                            }
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
    // 创建广播通道（缓冲区大小 1024，可根据需求调整）
    let (tx, _) = broadcast::channel::<WsMessage>(1024);
    let app_state = AppState { tx };

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
            .service(user_msg)
            .route("/echo", web::get().to(echo))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
