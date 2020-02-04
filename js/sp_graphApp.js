/*
const w = 500;
const h = 500;

const marco = d3.select("#canvas-div")
  .append("canvas")
  .attr("width", w)
  .attr("height", h);

var graph = {
  nodes: [{
      name: "A",
      age: 15
    },
    {
      name: "B",
      age: 75
    },
    {
      name: "C",
      age: 5
    },
    {
      name: "D",
      age: 34
    },
    {
      name: "E",
      age: 48
    }
  ],
  links: [{
      source: "A",
      target: "B"
    },
    {
      source: "B",
      target: "C"
    },
    {
      source: "C",
      target: "D"
    },
    {
      source: "D",
      target: "E"
    },
    {
      source: "E",
      target: "A"
    },
  ]
};

var ctx = marco.node().getContext("2d");
var r = 40;
var simulation = d3.forceSimulation()
  .force("x", d3.forceX(w / 2))
  .force("y", d3.forceY(h / 2))
  .force("collide", d3.forceCollide(r + 5))
  .force("charge", d3.forceManyBody().strength(-700))
  .force("link", d3.forceLink().id(function(d) {
    return d.name;
  }))
  .on("tick", update);

simulation.nodes(graph.nodes);
simulation.force("link")
  .links(graph.links)

graph.nodes.forEach(function(d) {
  d.x = Math.random() * w;
  d.y = Math.random() * h;
})

function update() {
  ctx.clearRect(0, 0, w, h);

  ctx.beginPath();
  graph.links.forEach(drawLink);
  ctx.stroke();

  ctx.beginPath();
  graph.nodes.forEach(drawNode);
  ctx.fill();
}

marco.call(d3.drag()
  .container(marco.node())
  .subject(dragsubject)
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended));


function dragsubject() {
  return simulation.find(d3.event.x, d3.event.y);
}

function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
  console.log(d3.event.subject);
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}

function drawNode(d) {
  ctx.moveTo(d.x, d.y);
  ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
  ctx.fillStyle = "darkBlue";
}

function drawLink(l) {
  ctx.moveTo(l.source.x, l.source.y);
  ctx.lineTo(l.target.x, l.target.y);
  ctx.lineWidth = 15;
  ctx.strokeStyle = "Chartreuse";
}

update();

*/
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

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
