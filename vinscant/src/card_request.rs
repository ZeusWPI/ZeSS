use embedded_svc::http::client::Client;
use esp_idf_svc::{
    http::{
        client::{Configuration, EspHttpConnection},
        Method,
    },
    io::EspIOError,
};
use mfrc522::Uid;

pub enum CardError {
    ServerError,
    ConnectionError,
    NotFoundError,
}

impl From<EspIOError> for CardError {
    fn from(value: EspIOError) -> Self {
        CardError::ConnectionError
    }
}

pub fn hannes_is_the_best_in_sending_requests(uid: Uid, auth_key: &str) -> Result<(), CardError> {
    let mut client = Client::wrap(
        EspHttpConnection::new(&Configuration {
            use_global_ca_store: true,
            crt_bundle_attach: Some(esp_idf_svc::sys::esp_crt_bundle_attach),
            ..Default::default()
        })
        .unwrap(),
    );
    let mut request = client.request(
        Method::Post,
        "https://zess.zeus.gent/api/scans".as_ref(),
        &[],
    )?;
    let _ = request.write(format!("{};{}", hex::encode(uid.as_bytes()), auth_key).as_bytes());
    let response = request.submit()?;
    log::info!("response code: {}", response.status());
    if response.status() == 200 {
        Ok(())
    } else {
        Err(CardError::NotFoundError)
    }
}
