
use embedded_svc::http::client::Client;
use esp_idf_svc::{
    http::client::{Configuration, EspHttpConnection},
    io::{EspIOError, Read},
    sys::{esp_crt_bundle_attach, EspError},
};
use mfrc522::Uid;

pub enum CardError {
    ServerError,
    ConnectionError(EspError),
    NotFoundError,
}

impl From<EspIOError> for CardError {
    fn from(e: EspIOError) -> Self {
        e.0.into()
    }
}

impl From<EspError> for CardError {
    fn from(e: EspError) -> Self {
        CardError::ConnectionError(e)
    }
}

pub fn send_card_to_server(uid: Uid, auth_key: &str) -> Result<String, CardError> {
    let mut client = Client::wrap(EspHttpConnection::new(&Configuration {
        use_global_ca_store: true,
        crt_bundle_attach: Some(esp_crt_bundle_attach),
        ..Default::default()
    })?);
    let mut request = client.post("https://zess.zeus.gent/api/scans".as_ref(), &[])?;
    let _ = request.write(format!("{};{}", hex::encode(uid.as_bytes()), auth_key).as_bytes());
    let mut response = request.submit()?;
    log::info!("response code: {}", response.status());
    match response.status() {
        200..300 => { // 200 <= status < 300
            let mut username = [0_u8; 128];
            let _ = response.read(&mut username)?;
            Ok(String::from_utf8(username.into()).unwrap())
        }
        404 => Err(CardError::NotFoundError),
        _ => Err(CardError::ServerError),
    }
}
