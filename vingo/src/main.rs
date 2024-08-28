mod routes {
    pub mod auth;
}

use routes::auth;

use axum::{routing::get, Router};
use tower_http::trace::TraceLayer;
use tower_sessions::{cookie::SameSite, MemoryStore, SessionManagerLayer};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();

    let sess_store = MemoryStore::default();
    let sess_mw = SessionManagerLayer::new(sess_store).with_same_site(SameSite::Lax);

    // build our application with a route
    let app = Router::new()
        .route("/login", get(auth::login))
        .route("/state", get(auth::logout))
        .route("/api/auth/callback", get(auth::callback))
        .layer(sess_mw)
        .layer(TraceLayer::new_for_http());

    // run it
    let listener = tokio::net::TcpListener::bind("127.0.0.1:4000")
        .await
        .unwrap();
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}
