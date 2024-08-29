use reqwest::StatusCode;

pub type ResponseResult<T> = Result<T, (StatusCode, &'static str)>;

pub trait ResultAndLogError<T, F> {
    fn or_log(self, err_value: F) -> Result<T, F>;
}

impl<T, E: std::fmt::Display, F> ResultAndLogError<T, F> for Result<T, E> {
    fn or_log(self, err_value: F) -> Result<T, F> {
        match self {
            Ok(v) => Ok(v),
            Err(e) => {
                eprintln!("err {e}");
                Err(err_value)
            }
        }
    }
}
