
use axum;
use axum::{
    routing::{get},
    extract::Query,
    http::StatusCode,
    response::IntoResponse,
    response::Html,
    Json, Router
};
use std::{net::SocketAddr};
use askama::Template;
use tracing::{debug};

pub async fn begin(socket_addr: SocketAddr) {

    // build application with router
    let app = Router::new()
        .route("/", get(root));
        // .route("/random_player", get(random_player));

    debug!("listening on {}", &socket_addr);
    axum::Server::bind(&socket_addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

#[derive(Template)]
#[template(path = "yggdrasil.html")]
struct WelcomeTemplate {}

async fn root() -> Html<String> {
    let template = WelcomeTemplate {};
    Html(template.render().unwrap())
}

// use std::{convert::Infallible};
// async fn random_player(Query(params): Query<HashMap<String, String>>) -> Result<Json<Player>, Infallible> {
//     info!("params: {:?}", &params);
//     // Ok(Json(Player::random(Gender::from_str(&gender).unwrap())))
//     Ok(Json(Player::random(Gender::male)))
// }