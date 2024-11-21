mod entities;
mod middleware;
mod routes;

use std::{
    env,
    sync::{Arc, LazyLock},
};

use chrono::Local;
use routes::{auth, cards, days, info, leaderboard, scans, seasons, settings};

use axum::{
    middleware::from_fn,
    routing::{delete, get, patch, post},
    Router,
};
use sea_orm::{prelude::DateTimeWithTimeZone, Database, DatabaseConnection};
use tokio::sync::Mutex;
use tower_http::cors::CorsLayer;
use tower_http::{
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tower_sessions::{cookie::SameSite, MemoryStore, SessionManagerLayer};

use migration::{Migrator, MigratorTrait};

static DB_URL: LazyLock<String> = LazyLock::new(|| {
    env::var("POSTGRES_CONNECTION_STRING").expect("POSTGRES_CONNECTION_STRING not present")
});

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

    let db = Database::connect(DB_URL.to_string()).await.unwrap();
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
    let mut app = Router::new()
        .nest("/api", routes())
        .layer(sess_mw)
        .layer(CorsLayer::very_permissive())
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    if env::var("DEVELOPMENT").unwrap_or("".into()) == "TRUE" {
        println!("yay we are developing")
    } else {
        app = app.fallback_service(
            ServeDir::new("public").not_found_service(ServeFile::new("public/index.html")),
        );
    };

    // run it
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4000").await.unwrap();

    println!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

fn routes() -> Router<AppState> {
    Router::new()
        .nest("", open_routes())
        .nest("", authenticated_routes())
        .nest("/admin", admin_routes())
}

fn open_routes() -> Router<AppState> {
    Router::new()
        .route("/login", post(auth::login))
        .route("/auth/callback", get(auth::callback))
        .route("/scans", post(scans::add))
        .route("/version", get(info::version))
        .route("/recent_scans", get(scans::recent))
        .route("/seasons", get(seasons::get_until_now))
}

fn authenticated_routes() -> Router<AppState> {
    // authenticated routes
    Router::new()
        .route("/logout", post(auth::logout))
        .route("/user", get(auth::current_user))
        .route("/cards", get(cards::get_for_current_user))
        .route("/cards/:card_id", patch(cards::update))
        .route(
            "/cards/register",
            get(cards::register_status).post(cards::start_register),
        )
        .route("/scans", get(scans::get_for_current_user))
        .route("/leaderboard", get(leaderboard::get))
        .route("/settings", get(settings::get).patch(settings::update))
        .route_layer(from_fn(middleware::is_logged_in))
}

fn admin_routes() -> Router<AppState> {
    Router::new()
        .route("/days", get(days::get).post(days::add_multiple))
        .route("/days/:day_id", delete(days::delete))
        .route("/seasons", get(seasons::get_all).post(seasons::add))
        .route("/seasons/:season_id", delete(seasons::delete))
        .route_layer(from_fn(middleware::is_admin))
}
