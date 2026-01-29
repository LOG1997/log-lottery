use crate::structure::app::{ApiResponse, AppState};
use crate::structure::demo_data::api_key_array;
use actix_web::{HttpRequest, HttpResponse, Responder, post, web};

impl<T> ApiResponse<T> {}
#[post("/auth")]
pub async fn auth(req: HttpRequest, req_body: String) -> impl Responder {
    // 打印接收到的消息
    println!("Received /auth:{:?} and {}", req, req_body);
    // api_key从body中取值

    // if  {

    // } else {
    //     HttpResponse::NotFound().json(ApiResponse::<()>::error(
    //         404,
    //         "后台服务未启动，请联系管理员".to_string(),
    //     ))
    // }
    HttpResponse::Ok().json(ApiResponse::<()>::success_without_data(
        "认证成功".to_string(),
    ))
}
