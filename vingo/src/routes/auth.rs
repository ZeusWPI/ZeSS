use axum::extract::{Query, State};
use axum::response::{Html, IntoResponse, Redirect};
use axum::Json;
use chrono::Local;
use rand::distributions::{Alphanumeric, DistString};
use reqwest::StatusCode;
use sea_orm::sea_query::OnConflict;
use sea_orm::{EntityTrait, Set, TryIntoModel};
use serde::{Deserialize, Serialize};
use tower_sessions::Session;
use user::Model;

use crate::entities::{prelude::*, *};
use crate::AppState;

use super::util::session::get_user;
use super::util::errors::ResponseResult;

const ZAUTH_URL: &str = "https://zauth.zeus.gent";
const CALLBACK_URL: &str = "http://localhost:4000/api/auth/callback";

pub async fn current_user(session: Session) -> ResponseResult<Json<Model>> {
    let user = get_user(&session).await?;
    Ok(Json(user))
}

pub async fn login(session: Session) -> impl IntoResponse {
    let state = Alphanumeric.sample_string(&mut rand::thread_rng(), 16);
    session.insert("state", state.clone()).await.unwrap();
    Redirect::to(&format!("{ZAUTH_URL}/oauth/authorize?client_id=tomtest&response_type=code&state={state}&redirect_uri={CALLBACK_URL}"))
}

pub async fn logout(session: Session) -> ResponseResult<Json<bool>> {
    let user = get_user(&session).await?;
    session.clear().await;
    Ok(Json(true))
}

#[derive(Deserialize, Debug)]
pub struct Callback {
    state: String,
    code: String,
}

#[derive(Deserialize, Debug)]
pub struct ZauthToken {
    access_token: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ZauthUser {
    id: i32,
    username: String,
}

pub async fn callback(
    Query(params): Query<Callback>,
    session: Session,
    state: State<AppState>,
) -> Result<Html<String>, StatusCode> {
    let zauth_state = session
        .get::<String>("state")
        .await
        .unwrap()
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    if zauth_state != params.state {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let client = reqwest::Client::new();
    let form = [
        ("grant_type", "authorization_code"),
        ("code", &params.code),
        ("redirect_uri", CALLBACK_URL),
    ];

    let token = client
        .post(&format!("{ZAUTH_URL}/oauth/token"))
        .basic_auth("tomtest", Some("blargh"))
        .form(&form)
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json::<ZauthToken>()
        .await
        .unwrap();

    let zauth_user = client
        .get(format!("{ZAUTH_URL}/current_user"))
        .header("Authorization", "Bearer ".to_owned() + &token.access_token)
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json::<ZauthUser>()
        .await
        .unwrap();

    let db_user = user::ActiveModel {
        id: Set(zauth_user.id),
        name: Set(zauth_user.username),
        admin: Set(false),
        created_at: Set(Local::now().into()),
    };

    // update name if user already exists
    User::insert(db_user.clone())
        .on_conflict(
            OnConflict::column(user::Column::Id)
                .update_column(user::Column::Name)
                .to_owned(),
        )
        .exec(&state.db)
        .await
        .unwrap();

    let db_user = db_user.try_into_model().unwrap();
    let username = db_user.name.clone();

    session.clear().await;
    session.insert("user", db_user).await.unwrap();

    Ok(Html(format!("Logged in as {}", username)))
}
