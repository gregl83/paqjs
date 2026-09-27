use std::path::Path;

use napi_derive::napi;

#[napi(js_name = "hashSource")]
pub fn hash_source(
    source: String,
    ignore_hidden: bool,
    follow_links: Option<bool>,
) -> napi::Result<String> {
    let path = Path::new(&source);
    paq::hash_source(path, ignore_hidden, follow_links.unwrap_or(false))
        .map(|hash| hash.to_string())
        .map_err(|error| napi::Error::from_reason(error.to_string()))
}
