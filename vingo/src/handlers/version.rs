use axum::Json;
use serde::Serialize;

#[derive(Serialize)]
pub struct Version {
    version: &'static str,
}

pub struct VersionHandler;

impl VersionHandler {
    pub async fn version() -> Json<Version> {
        Json(Version {
            version: env!("CARGO_PKG_VERSION"),
        })
    }
}
