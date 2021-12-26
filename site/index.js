function update() {
    alert("hoge");
}

const js = import("../pkg/wheeler_graph_game.js");
js.then(js => {
    window.update = update;
    window.gen_fn = js.gen_distinct_wg;
});