use reqwest::StatusCode;

pub type ResponseResult<T> = Result<T, (StatusCode, &'static str)>;