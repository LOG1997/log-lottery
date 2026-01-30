use actix_web::web;
use serde::Deserialize;
use std::collections::HashMap;
use tokio::sync::{RwLock, broadcast};

// 统一响应结构体
#[derive(serde::Serialize)]
pub struct ApiResponse<T> {
    pub code: i32,
    pub success: bool,
    pub msg: String,
    pub data: Option<T>,
}
impl<T> ApiResponse<T> {
    // 添加一个专门用于无数据响应的静态方法
    pub fn success_without_data(msg: String) -> ApiResponse<()> {
        ApiResponse {
            code: 200,
            success: true,
            msg,
            data: None,
        }
    }

    pub fn error(code: i32, msg: String) -> ApiResponse<()> {
        ApiResponse {
            code,
            success: false,
            msg,
            data: None,
        }
    }
}
// 定义消息类型（可以根据需求扩展为结构体）
pub type WsMessage = String;
#[derive(Clone)]
pub struct AppState {
    // 使用 HashMap 存储不同 user_signature 的广播通道
    pub tx_map: web::Data<RwLock<HashMap<String, broadcast::Sender<WsMessage>>>>,
}

#[derive(Deserialize, Debug)]
pub struct AuthInfo {
    pub api_key: String,
}
