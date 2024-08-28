use std::borrow::Borrow;

use axum::extract::Query;
use axum::response::{Html, IntoResponse, Redirect};
use rand::distributions::{Alphanumeric, DistString};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use tower_sessions::Session;

const ZAUTH_URL: &str = "https://zauth.zeus.gent";
const CALLBACK_URL: &str = "http://localhost:4000/api/auth/callback";

pub async fn login(session: Session) -> impl IntoResponse {
    let state = Alphanumeric.sample_string(&mut rand::thread_rng(), 16);
    session.insert("state", state.clone()).await.unwrap();
    Redirect::to(&format!("{ZAUTH_URL}/oauth/authorize?client_id=tomtest&response_type=code&state={state}&redirect_uri={CALLBACK_URL}"))
}

#[derive(Deserialize, Debug)]
pub struct Callback {
    state: String,
    code: String,
}

#[derive(Deserialize, Debug)]
pub struct ZauthToken {
    access_token: String,
    token_type: String,
    expires_in: u64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ZauthUser {
    id: u64,
    username: String,
}

pub async fn callback(
    Query(params): Query<Callback>,
    session: Session,
) -> Result<Html<String>, StatusCode> {
    let state = session
        .get::<String>("state")
        .await
        .unwrap()
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;
    if state != params.state {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let client = reqwest::Client::new();
    let form = [
        ("grant_type", "authorization_code"),
        ("code", &params.code),
        (
            "redirect_uri",
            CALLBACK_URL,
        ),
    ];

    let token = client
        .post(&format!("{ZAUTH_URL}/oauth/token"))
        .basic_auth(
            "tomtest",
            Some("blargh"),
        )
        .form(&form)
        .send()
        .await
        .unwrap()
        .error_for_status()
        .unwrap()
        .json::<ZauthToken>()
        .await
        .unwrap();

    let user = client
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

    let username = user.username.clone();
    session.clear().await;
    session.insert("user", &username).await.unwrap();

    Ok(Html(format!("Logged in as {}", username)))
}

pub async fn logout(session: Session) -> Result<Html<String>, StatusCode> {
    let username = session
        .get::<String>("user")
        .await
        .unwrap()
        .ok_or(StatusCode::INTERNAL_SERVER_ERROR)?;

    session.clear().await;
    Ok(Html("logged out as ".to_owned() + &username))   
}
