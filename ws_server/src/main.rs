use actix_cors::Cors;
use actix_web::{App, HttpServer, guard, web};
use std::collections::HashMap;
use tokio::sync::RwLock;
mod api;
mod structure;
use crate::structure::app::AppState;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let tx_map = web::Data::new(RwLock::new(HashMap::new()));
    let app_state = AppState { tx_map };
    const SERVER_ADDRESS: &str = "127.0.0.1";
    const SERVER_PORT: u16 = 8080;

    HttpServer::new(move || {
        let api_scope = web::scope("/api")
            .guard(guard::Any(guard::Post()))
            .service(api::user::user_msg)
            .service(api::auth::auth);
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
            .service(api_scope)
            .route("/echo", web::get().to(api::websocket::echo))
    })
    .bind((SERVER_ADDRESS, SERVER_PORT))?
    .run()
    .await
}
