mod game;
mod web;

use dotenv::dotenv;

use std::{net::SocketAddr, env};
use tracing::{info};
use tracing_subscriber::EnvFilter;
use tokio;
use std::thread;

use tracing;
use tracing_subscriber;

fn setup() {
    // load environment variables
    dotenv().ok();

    // initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::from_default_env()
            .add_directive("bevy=info".parse().unwrap())
        )
        .init();
    
    let environment = env::var("RUST_LOG").unwrap();
    info!("Log Level: {environment}");
}

#[tokio::main]
async fn main() {
    
    // setup
    setup();

    // run game engine
    let game_thread = thread::spawn(game::begin);
    
    // run web server
    web::begin(SocketAddr::from(([0, 0, 0, 0], 3000))).await;
    
    game_thread.join().unwrap();
}