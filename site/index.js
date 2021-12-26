// let generate = () => {

const js = import("../pkg/wheeler_graph_game.js");
js.then(js => {
    window.gen_fn = js.gen_distinct_wg;
    generate();
});