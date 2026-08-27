use std::path::Path;

use napi_derive::napi;

#[napi(js_name = "hashSource")]
pub fn hash_source(source: String, ignore_hidden: bool) -> napi::Result<String> {
    let path = Path::new(&source);
    paq::try_hash_source(path, ignore_hidden)
        .map(|hash| hash.to_string())
        .map_err(|error| napi::Error::from_reason(error.to_string()))
}
