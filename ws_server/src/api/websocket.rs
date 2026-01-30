use crate::structure::app::{ApiResponse, AppState, WsMessage};
use crate::structure::demo_data::api_key_array;
use actix_web::{Error, HttpRequest, HttpResponse, rt, web, web::Payload};
use actix_ws::AggregatedMessage;
use futures_util::StreamExt as _;
use tokio::{select, sync::broadcast};
pub async fn echo(
    req: HttpRequest,
    stream: Payload,
    data: web::Data<AppState>,
) -> Result<HttpResponse, Error> {
    println!("New WebSocket connection:{:?}", req.query_string());
    let query_str_arr = req.query_string().split("&");
    println!("query_str_arr: {:?}", query_str_arr);
    let user_signature = query_str_arr
        .clone()
        .find(|s| s.starts_with("user_signature"))
        .unwrap()
        .split("=")
        .nth(1)
        .unwrap();
    let api_key = query_str_arr
        .clone()
        .find(|s| s.starts_with("api_key"))
        .unwrap()
        .split("=")
        .nth(1)
        .unwrap();
    // let user_signature = req.query_string().split("=").nth(1).unwrap();
    println!(
        "user_signature and api_key: {} and {}",
        user_signature, api_key
    );
    // api_key_arr列表不包括则退出
    if !api_key_array.contains(&api_key) {
        println!("api_key错误{}", api_key);
        return Ok(HttpResponse::Unauthorized().json(ApiResponse::<()>::error(
            401,
            format!("认证失败: api_key错误"),
        )));
    }
    let (res, mut session, stream) = actix_ws::handle(&req, stream)?;

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
