mod player;

use player::{
    Player,
    Gender
};

use dotenv::dotenv;
use axum::{
    routing::{get, post},
    extract::Query,
    http::StatusCode,
    response::IntoResponse,
    response::Html,
    Json, Router
};
use serde::{Deserialize, Serialize};
use std::{net::SocketAddr, str::FromStr, convert::Infallible, env};
use tracing::{debug, info};
use tokio;
use axum;
use tracing;
use tracing_subscriber;

use askama::Template;
use std::collections::HashMap;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let environment = env::var("RUST_LOG").unwrap();
    println!("RUST_LOG: {}", environment);

    // initialize tracing
    tracing_subscriber::fmt::init();

    // build application with router
    let app = Router::new()
        .route("/", get(root))
        .route("/random_player", get(random_player));

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    debug!("listening on {}", addr);
    axum::Server::bind(&addr)
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

async fn random_player(Query(params): Query<HashMap<String, String>>) -> Result<Json<Player>, Infallible> {
    info!("params: {:?}", &params);
    // Ok(Json(Player::random(Gender::from_str(&gender).unwrap())))
    Ok(Json(Player::random(Gender::male)))
}