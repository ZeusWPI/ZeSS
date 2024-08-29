mod routes;

mod entities;
use routes::auth;

use axum::{routing::get, Router};
use sea_orm::{Database, DatabaseConnection};
use tower_http::trace::TraceLayer;
use tower_sessions::{cookie::SameSite, MemoryStore, SessionManagerLayer};

const DB_URL: &str = "postgres://postgres:zess@localhost/zess";

#[derive(Clone)]
struct AppState {
    db: DatabaseConnection,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();

    let sess_store = MemoryStore::default();
    let sess_mw = SessionManagerLayer::new(sess_store).with_same_site(SameSite::Lax);

    let db = Database::connect(DB_URL).await.unwrap();
    let state = AppState { db };

    // build our application with a route
    let app = Router::new()
        .nest("/api", routes())
        .layer(sess_mw)
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    // run it
    let listener = tokio::net::TcpListener::bind("127.0.0.1:4000")
        .await
        .unwrap();
    
    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

fn routes() -> Router<AppState> {
    Router::new()
        .route("/login", get(auth::login))
        .route("/logout", get(auth::logout))
        .route("/user", get(auth::current_user))
        .route("/auth/callback", get(auth::callback))
}
