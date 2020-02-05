var svg = d3.select("svg");

/*
var width = +svg.attr("width");
var height = +svg.attr("height");
*/


console.log(window.innerWidth);

function changeSize() {
  var sizeAux = [];
  if(window.innerWidth < 700) if(window.innerWidth < 350)sizeAux.push(250); else sizeAux.push(300);
  else if(window.innerWidth < 800 || window.innerWidth < 1050) sizeAux.push(700); else sizeAux.push(1024);

  if(window.innerHeight < 900) sizeAux.push(400);
  else sizeAux.push(750);

  return sizeAux;
}

console.log(changeSize());

var width = changeSize()[0];
var height = changeSize()[1];

svg.attr("height",height);
svg.attr("width",width);

console.log(width);
console.log(height);

var r = 40;

var graph = {
  "nodes": [{
      "id": "A",
      "group": 1
    },
    {
      "id": "B",
      "group": 1
    },
    {
      "id": "C",
      "group": 3
    },
    {
      "id": "D",
      "group": 4
    }
  ],
  "links": [{
      "source": "A",
      "target": "C",
      "value": 1
    },
    {
      "source": "B",
      "target": "C",
      "value": 3
    },
    {
      "source": "C",
      "target": "D",
      "value": 2
    },
    {
      "source": "D",
      "target": "A",
      "value": 1
    }
  ]
}


var link = svg.append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(graph.links)
  .enter().append("line");

var node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("circle")
  .data(graph.nodes)
  .enter().append("circle")
  .attr("r", r)
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));


/*
//Para nodos rectangulares

var node = svg.append("g")
  .selectAll("rect")
  .data(graph.nodes)
  .enter().append("rect")
  .attr("height", 50)
  .attr("width", 100)
  .attr("rx", 10)
  .attr("ry", 10)
  .call(d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));
*/

node.append("title")
  .text(function(d) {
    return d.id;
  });

var simulation = d3.forceSimulation()
  .force("link", d3.forceLink().id((d) => d.id))
  .force("charge", d3.forceManyBody())
  .force("collide", d3.forceCollide(r + 5))
  .force("center", d3.forceCenter(width / 2, height / 2))
  .on("tick", ticked);

  simulation
  .nodes(graph.nodes)
  simulation
  .force("link")
  .links(graph.links);

function ticked() {
  link
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });

  //Para colocar el rectangulo cambiar al "cx" por "x", igual para "cy"
  node
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
