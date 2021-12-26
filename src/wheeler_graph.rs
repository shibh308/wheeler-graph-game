use rand::distributions::Uniform;
use rand::rngs::ThreadRng;
use rand::seq::{IteratorRandom, SliceRandom};
use rand::{thread_rng, Rng};

#[derive(Debug)]
struct WheelerGraphNode {
    label: u8,
    edges: Vec<usize>,
}

#[derive(Debug)]
struct WheelerGraph {
    edge_num: usize,
    label_num: usize,
    nodes: Vec<WheelerGraphNode>,
}

impl WheelerGraphNode {
    pub fn new(label: u8) -> Self {
        WheelerGraphNode {
            label,
            edges: vec![],
        }
    }
}

fn gen_split(n: usize, m: usize, rng: &mut ThreadRng) -> Vec<usize> {
    // [1, n) からm-1個を選び, sortして末尾にnを追加した物を還す
    let mut perm_head = (1..n).choose_multiple(rng, m - 1);
    perm_head.sort();
    perm_head.push(n);
    perm_head
}

impl WheelerGraph {
    pub fn label_distinct_wheeler_graph(
        n: usize,
        sigma: usize,
        in_deg_cent: f32,
        in_deg_dist: f32,
    ) -> Self {
        assert!(sigma <= n);
        assert!(sigma < u8::MAX as usize);

        let mut wg = WheelerGraph {
            edge_num: 0,
            label_num: sigma,
            nodes: vec![],
        };

        let mut rng = rand::thread_rng();

        /*
        let edge_cnt = (0..n)
            .into_iter()
            .map(|_x| rng.sample(Uniform::new(edge_low, edge_high + 1)))
            .collect::<Vec<_>>();
        let edge_adj = edge_cnt
            .iter()
            .map(|&cnt| {
                let mut v = vec![true; cnt];
                v.append(&mut vec![false; sigma - cnt]);
                v.shuffle(&mut rng);
                v
            })
            .collect::<Vec<_>>();
         */

        let spl = gen_split(n, sigma, &mut rng);

        for (c, &en) in spl.iter().enumerate() {
            while wg.nodes.len() < en {
                wg.nodes.push(WheelerGraphNode::new(c as u8));
            }
        }
        let in_deg_dist = Uniform::<f32>::new(in_deg_cent - in_deg_dist, in_deg_cent + in_deg_dist);
        for (c, &en) in spl.iter().enumerate() {
            let st = if c == 0 { 0 } else { spl[c - 1] };
            println!("start: {} , {}", c, st);

            let spl2 = gen_split(n, en - st, &mut rng);

            for (i, &en2) in spl2.iter().enumerate() {
                let st2 = if i == 0 { 0 } else { spl2[i - 1] };
                let to = i + st;
                // ラベルcの頂点toへの辺を張るか決める
                let in_deg = (rng.sample(&in_deg_dist).round() as usize)
                    .min(en2 - st2)
                    .max(1);
                for from in (st2..en2).choose_multiple(&mut rng, in_deg) {
                    wg.nodes[from].edges.push(to);
                    wg.edge_num += 1;
                }
            }
        }
        dbg!(&wg);
        wg
    }
    pub fn size(&mut self) -> usize {
        self.nodes.len()
    }
}

#[test]
fn graph_gen_test() {
    WheelerGraph::label_distinct_wheeler_graph(6, 2, 1.5, 1.0);
}
