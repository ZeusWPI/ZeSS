use embedded_svc::http::{client::Client, Status};
use esp_idf_svc::{
    http::{
        client::{Configuration, EspHttpConnection},
        Method,
    },
    io::EspIOError, sys::{esp_crt_bundle_attach, EspError},
};
use mfrc522::Uid;

pub enum CardError {
    ServerError,
    ConnectionError,
    NotFoundError,
}

impl From<EspIOError> for CardError {
    fn from(e: EspIOError) -> Self {
        e.0.into()
    }
}

impl From<EspError> for CardError {
    fn from(_: EspError) -> Self {
        CardError::ConnectionError
    }
}

pub fn send_card_to_server(uid: Uid, auth_key: &str) -> Result<(), CardError> {
    let mut client = Client::wrap(
        EspHttpConnection::new(&Configuration {
            use_global_ca_store: true,
            crt_bundle_attach: Some(esp_crt_bundle_attach),
            ..Default::default()
        })?,
    );
    let mut request = client.post(
        "https://zess.zeus.gent/api/scans".as_ref(),
        &[],
    )?;
    let _ = request.write(format!("{};{}", hex::encode(uid.as_bytes()), auth_key).as_bytes());
    let response = request.submit()?;
    log::info!("response code: {}", response.status());
    match response.status() {
        200..300 => Ok(()), // 200 <= status < 300
        404      => Err(CardError::NotFoundError),
        _        => Err(CardError::ServerError),
    }
}
