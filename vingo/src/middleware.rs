use axum::{extract::Request, middleware::Next, response::IntoResponse};
use reqwest::StatusCode;
use tower_sessions::Session;

use crate::routes::util::{errors::ResponseResult, session::get_user};

pub async fn is_logged_in(
    session: Session,
    request: Request,
    next: Next,
) -> ResponseResult<impl IntoResponse> {
    get_user(&session).await?;
    Ok(next.run(request).await)
}

pub async fn is_admin(
    session: Session,
    request: Request,
    next: Next,
) -> ResponseResult<impl IntoResponse> {
    let user = get_user(&session).await?;
    if !user.admin {
        return Err((StatusCode::UNAUTHORIZED, "Not admin, get out >:I"));
    }
    Ok(next.run(request).await)
}
