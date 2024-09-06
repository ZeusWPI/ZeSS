mod routes;

mod entities;

use std::sync::Arc;

use chrono::Local;
use routes::{auth, cards, leaderboard, scans};

use axum::{
    routing::{get, patch, post},
    Router,
};
use sea_orm::{prelude::DateTimeWithTimeZone, Database, DatabaseConnection};
use tokio::sync::Mutex;
use tower_http::trace::TraceLayer;
use tower_sessions::{cookie::SameSite, MemoryStore, SessionManagerLayer};

use migration::{Migrator, MigratorTrait};

const DB_URL: &str = "postgres://postgres:zess@host.docker.internal/zess?sslmode=disable";

#[derive(Clone, Debug)]
struct AppState {
    db: DatabaseConnection,
    registering: Arc<Mutex<RegisterState>>,
}

#[derive(Clone, Debug)]
struct RegisterState {
    user: i32,
    end: DateTimeWithTimeZone,
    last_success: bool,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();

    let sess_store = MemoryStore::default();
    let sess_mw = SessionManagerLayer::new(sess_store)
        .with_same_site(SameSite::Lax)
        .with_http_only(false);

    let db = Database::connect(DB_URL).await.unwrap();
    Migrator::up(&db, None).await.unwrap();

    let registering_state = RegisterState {
        user: -1,
        end: Local::now().fixed_offset(),
        last_success: false,
    };
    let state = AppState {
        db,
        registering: Arc::new(Mutex::new(registering_state)),
    };

    // build our application with a route
    let app = Router::new()
        .nest("/api", routes())
        .layer(sess_mw)
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    // run it
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4000").await.unwrap();

    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

fn routes() -> Router<AppState> {
    Router::new()
        .route("/login", post(auth::login))
        .route("/logout", get(auth::logout))
        .route("/user", get(auth::current_user))
        .route("/auth/callback", get(auth::callback))
        .route("/cards", get(cards::get_for_current_user))
        .route("/cards/:card_id", patch(cards::update))
        .route(
            "/cards/register",
            get(cards::register_status).post(cards::start_register),
        )
        .route("/scans", get(scans::get_for_current_user))
        .route("/scans", post(scans::add))
        .route("/leaderboard", get(leaderboard::get))
}
