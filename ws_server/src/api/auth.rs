use crate::structure::app::ApiResponse;
use crate::structure::app::AuthInfo;
use crate::structure::demo_data::api_key_array;
use actix_web::{HttpRequest, HttpResponse, Responder, post, web};
impl<T> ApiResponse<T> {}
#[post("/auth")]
pub async fn auth(req: HttpRequest, req_body: web::Json<AuthInfo>) -> impl Responder {
    // 打印接收到的消息
    println!("Received /auth:{:?} and {:?}", req, req_body);

    // api_key从body中取值
    let api_key = req_body.api_key.as_str();
    if !api_key_array.contains(&api_key) {
        return HttpResponse::Unauthorized().json(ApiResponse::<()>::error(
            401,
            format!("认证失败: api_key错误"),
        ));
    }
    return HttpResponse::Ok().json(ApiResponse::<()>::success_without_data(
        "认证成功".to_string(),
    ));
}
