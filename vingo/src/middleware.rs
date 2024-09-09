use axum::{
    extract::Request,
    middleware::Next,
    response::{IntoResponse, Response},
};
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

// pub async fn is_admin(session: Session, next: Next) ->
