function timer_inc(){
    let tim = document.getElementById("time");
    if (document.getElementById("result").innerHTML == "不正解！") {
        ++timer_cn;
    }
    tim.innerHTML = "経過時間: " + ('00' + Math.floor(timer_cn / 60)).slice(-2) + ":" + ('00' + (timer_cn % 60)).slice(-2);
}

function update_table(){
    let table = document.getElementById("table");
    while (table.rows.length != 0) {
        table.deleteRow(-1);
    }

    let row = table.insertRow(-1);
    let th = document.createElement('th');
    row.appendChild(th);
    let td = row.insertCell(-1);
    td.id = "table_00";
    for (j = 0; j < nodes.length; ++j) {
        let td = row.insertCell(-1);
        td.id = "table_j";
        td.innerHTML = j.toString();
    }
    for (i = 0; i < nodes.length; ++i) {
        let row = table.insertRow(-1);
        let th = document.createElement('th');
        row.appendChild(th);
        let td = row.insertCell(-1);
        td.id = "table_i";
        td.innerHTML = i.toString();
        for (j = 0; j < nodes.length; ++j) {
            let td = row.insertCell(-1);
            const group_mod = nodes.get(j)['group'] % 2;
            td.id = "table_ij" + group_mod;
        }
    }

    const node_size = graph['nodes'].length;
    let adj = new Array(node_size);
    for (i = 0; i < graph['nodes'].length; ++i) {
        adj[i] = new Array(node_size).fill(false);
    }

    for (i = 0; i < graph['nodes'].length; ++i) {
        const i_label = Number(nodes.get(i)['label']);
        graph['nodes'][i]['edges'].forEach((j) => {
            const j_label = Number(nodes.get(j)['label']);
            const group_mod = nodes.get(j)['group'] % 2;
            adj[i_label][j_label] = true;
            table.rows[i_label + 1].cells[j_label + 2].id = "table_ij_e" + group_mod;
            table.rows[i_label + 1].cells[j_label + 2].innerHTML = "*";
        });
    }
    let fl = true;
    let max_j = new Array(sigma).fill(-1);
    for (i = 0; i < node_size; ++i) {
        for(j = 0; j < node_size; ++j) {
            if (adj[i][j]) {
                const gr = nodes.get(j)['group'];
                if (max_j[gr] > j) {
                    fl = false;
                    break;
                }
                max_j[gr] = j;
            }
        }
    }
    console.log(fl);
    if (fl) {
        document.getElementById('result').innerHTML = "正解！"
    }
    else {
        document.getElementById('result').innerHTML = "不正解！"
    }
}

function generate(){
    const num_nodes = Number(document.forms.params_form.num_nodes.value);
    sigma = Number(document.forms.params_form.sigma.value);
    const edge_ave = document.forms.params_form.edge_ave.value;
    const edge_wid = document.forms.params_form.edge_wid.value;
    graph = JSON.parse(window.gen_fn(num_nodes, sigma, edge_ave, edge_wid));

    const node_num = graph['nodes'].length;
    let node_list = [];
    let node_group_list = new Array(sigma);
    for (i = 0; i < sigma; ++i) {
        node_group_list[i] = new Array();
    }
    for (i = 0; i < node_num; ++i) {
        node_group_list[graph['nodes'][i]['label']].push(i);
        // node_list.push({id: i, group: graph['nodes'][i]['label'], value: 20, scaling: { label: { enabled: true } }});
        node_list.push({id: i, group: graph['nodes'][i]['label'], label: i.toString(), value: 20, scaling: { label: { enabled: true } }});
    }
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    for (i = 0; i < sigma; ++i) {
        shuffle(node_group_list[i]);
    }
    let node_group_cnt = new Array(sigma).fill(0);
    for (i = 0; i < node_num; ++i) {
        let gr = graph['nodes'][i]['label'];
        node_list[i].label = node_group_list[gr][node_group_cnt[gr]].toString();
        ++node_group_cnt[gr];
    }

    let edge_list = [];
    for (i = 0; i < node_num; ++i) {
        graph['nodes'][i]['edges'].forEach((j) => {
            edge_list.push({from: i, to: j, arrows: 'to'});
        });
    }

    nodes = new vis.DataSet(node_list);
    edges = new vis.DataSet(edge_list);
    let container = document.getElementById('network');
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {};
    network = new vis.Network(container, data, options);
    network.on("click", (params) => {
        let nodeId = params['nodes'][0];
        if (nodeId == null) {
            selectedNode = null;
        }
        else {
            if (selectedNode != null) {
                const node1 = nodes.get(selectedNode);
                const node2 = nodes.get(nodeId);
                if (node1['group'] == node2['group']) {
                    const label1 = node1['label'];
                    const label2 = node2['label'];
                    nodes.update({id: selectedNode, label: label2});
                    nodes.update({id: nodeId, label: label1});
                    update_table();
                }
            }
            selectedNode = nodeId;
        }
    });
    update_table();
    let tim = document.getElementById("time");
    timer_cn = 0;
    tim.innerText = "経過時間: 00:00";
    clearInterval(timer);
    timer = setInterval('timer_inc()', 1000);
}
