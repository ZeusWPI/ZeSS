use std::env;
use std::sync::LazyLock;

use axum::extract::{Query, State};
use axum::response::Redirect;
use axum::Json;
use chrono::Local;
use rand::distributions::{Alphanumeric, DistString};
use reqwest::StatusCode;
use sea_orm::sea_query::OnConflict;
use sea_orm::{EntityTrait, Set};
use serde::{Deserialize, Serialize};
use tower_sessions::Session;
use user::Model;

use crate::entities::{prelude::*, *};
use crate::AppState;

use super::util::errors::{ResponseResult, ResultAndLogError};
use super::util::session::{get_user, SessionKeys};

const ZAUTH_URL: LazyLock<String> =
    LazyLock::new(|| env::var("ZAUTH_URL").expect("ZAUTH_URL not present"));
const CALLBACK_URL: LazyLock<String> =
    LazyLock::new(|| env::var("ZAUTH_CALLBACK_PATH").expect("ZAUTH_CALLBACK_PATH not present"));
const FRONTEND_URL: LazyLock<String> =
    LazyLock::new(|| env::var("FRONTEND_URL").expect("FRONTEND_URL not present"));
const ZAUTH_CLIENT_ID: LazyLock<String> =
    LazyLock::new(|| env::var("ZAUTH_CLIENT_ID").expect("ZAUTH_CLIENT_ID not present"));
const ZAUTH_CLIENT_SECRET: LazyLock<String> =
    LazyLock::new(|| env::var("ZAUTH_CLIENT_SECRET").expect("ZAUTH_CLIENT_SECRET not present"));

pub async fn current_user(session: Session) -> ResponseResult<Json<Model>> {
    let user = get_user(&session).await?;
    Ok(Json(user))
}

pub async fn login(session: Session) -> ResponseResult<Redirect> {
    let state = Alphanumeric.sample_string(&mut rand::thread_rng(), 16);
    // insert state so we can check it in the callback
    session.insert("state", state.clone()).await.or_log((
        StatusCode::INTERNAL_SERVER_ERROR,
        "failed to insert state in session",
    ))?;
    // redirect to zauth to authenticate
    let zauth_url = ZAUTH_URL.to_string();
    let callback_url = CALLBACK_URL.to_string();
    let zauth_client_id = ZAUTH_CLIENT_ID.to_string();
    Ok(Redirect::to(&format!("{zauth_url}/oauth/authorize?client_id={zauth_client_id}&response_type=code&state={state}&redirect_uri={callback_url}")))
}

pub async fn logout(session: Session) -> ResponseResult<Json<bool>> {
    get_user(&session).await?;
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
) -> ResponseResult<Redirect> {
    let zauth_state = session
        .get::<String>("state")
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to get session"))?
        .ok_or((StatusCode::INTERNAL_SERVER_ERROR, "state not in session"))?;
    // check if saved state matches returned state
    if zauth_state != params.state {
        return Err((StatusCode::UNAUTHORIZED, "state does not match"));
    }

    let callback_url = CALLBACK_URL.to_string();
    let client = reqwest::Client::new();
    let form = [
        ("grant_type", "authorization_code"),
        ("code", &params.code),
        ("redirect_uri", &callback_url),
    ];

    let zauth_url = ZAUTH_URL.to_string();
    // get token from zauth with code
    let token = client
        .post(&format!("{zauth_url}/oauth/token"))
        .basic_auth(
            ZAUTH_CLIENT_ID.to_string(),
            Some(ZAUTH_CLIENT_SECRET.to_string()),
        )
        .form(&form)
        .send()
        .await
        .or_log((
            StatusCode::INTERNAL_SERVER_ERROR,
            "zauth token request error",
        ))?
        .error_for_status()
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "non 200 for zauth token"))?
        .json::<ZauthToken>()
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to parse json"))?;

    // get user info from zauth
    let zauth_user = client
        .get(format!("{zauth_url}/current_user"))
        .header("Authorization", "Bearer ".to_owned() + &token.access_token)
        .send()
        .await
        .or_log((
            StatusCode::INTERNAL_SERVER_ERROR,
            "zauth user request error",
        ))?
        .error_for_status()
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "non 200 for zauth user"))?
        .json::<ZauthUser>()
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "failed to parse json"))?;

    let db_user = user::ActiveModel {
        id: Set(zauth_user.id),
        name: Set(zauth_user.username),
        admin: Set(false), // cant insert if not set, even if default
        created_at: Set(Local::now().into()),
    };

    // update name if user already exists
    let db_user = User::insert(db_user.clone())
        .on_conflict(
            OnConflict::column(user::Column::Id)
                .update_column(user::Column::Name)
                .to_owned(),
        )
        .exec_with_returning(&state.db)
        .await
        .or_log((StatusCode::INTERNAL_SERVER_ERROR, "user insert error"))?;

    session.clear().await;
    session
        .insert(SessionKeys::User.as_str(), db_user)
        .await
        .or_log((
            StatusCode::INTERNAL_SERVER_ERROR,
            "failed to insert user in session",
        ))?;

    let frontend_url = FRONTEND_URL.to_string();
    Ok(Redirect::to(&frontend_url))
}
