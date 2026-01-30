use crate::structure::app::{ApiResponse, AppState};
use crate::structure::demo_data::api_key_array;
use actix_web::{HttpRequest, HttpResponse, Responder, post, web};

impl<T> ApiResponse<T> {}
#[post("/user-msg")]
pub async fn user_msg(
    req: HttpRequest,
    req_body: String,
    data: web::Data<AppState>,
) -> impl Responder {
    println!("All headers:");
    // 获取usersignature参数
    let target_user_signature = req
        .headers()
        .get("user_signature")
        .unwrap()
        .to_str()
        .unwrap();
    let api_key = req.headers().get("api_key").unwrap().to_str().unwrap();
    if !api_key_array.contains(&api_key) {
        println!("api_key错误{}", api_key);
        return HttpResponse::Unauthorized().json(ApiResponse::<()>::error(
            401,
            format!("认证失败: api_key错误"),
        ));
    }
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
