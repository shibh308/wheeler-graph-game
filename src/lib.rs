mod utils;
mod wheeler_graph;

use wasm_bindgen::prelude::*;

use crate::wheeler_graph::WheelerGraph;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wheeler-graph-game!");
}

#[wasm_bindgen]
pub fn gen_distinct_wg(n: usize, sigma: usize, in_deg_cent: f32, in_deg_dist: f32) -> String {
    let wg = WheelerGraph::label_distinct_wheeler_graph(n, sigma, in_deg_cent, in_deg_dist);
    wg.to_string()
}
