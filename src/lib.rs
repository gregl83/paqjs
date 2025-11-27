use std::path::Path;

use napi_derive::napi;

#[napi(js_name = "hashSource")]
pub fn hash_source(source: String, ignore_hidden: bool) -> String {
    let path = Path::new(&source);
    paq::hash_source(path, ignore_hidden).to_string()
}
