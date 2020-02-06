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

var width = changeSize()[0];
var height = changeSize()[1];

svg.attr("height",height);
svg.attr("width",width);

var r = 5;

var ciclos = 2;
var countCiclos = [];
for (let index = 0; index < ciclos; index++) {
  countCiclos.push(20);
}
var distMin = width/(ciclos+1);

var graph = {
  "nodes": [{
      "id": "1MAT04",
      "nombre": "Álgebra matricial y geometría analítica",
      "creditos": 4.5,
      "requisitos": [],
      "ciclo": 1
    },
    {
      "id": "1MAT05",
      "nombre": "Fundamentos del cálculo",
      "creditos": 4.5,
      "requisitos": [],
      "ciclo": 1
    },
    {
      "id": "1FIS01",
      "nombre": "Fundamentos de física",
      "creditos": 3.5,
      "requisitos": [],
      "ciclo": 1
    },
    {
      "id": "1QUI01",
      "nombre": "Química 1",
      "creditos": 3.5,
      "requisitos": [],
      "ciclo": 1
    },
    {
      "id": "1QUI02",
      "nombre": "Química 1",
      "creditos": 0.75,
      "requisitos": ["1QUI01"],
      "ciclo": 1
    },
    {
      "id": "1LIN15",
      "nombre": "Comunicación académica",
      "creditos": 3.0,
      "requisitos": [],
      "ciclo": 1
    },
    {
      "id": "1MAT06",
      "nombre": "Cálculo diferencial",
      "creditos": 4.5,
      "requisitos": ["1MAT05", "1MAT04"],
      "ciclo": 2
    },
    {
      "id": "1FIS02",
      "nombre": "Física 1",
      "creditos": 4.5,
      "requisitos": ["1MAT06", "1FIS01", "1FIS03"],
      "ciclo": 2
    },
    {
      "id": "1FIS03",
      "nombre": "Laboratorio de física 1",
      "creditos": 0.5,
      "requisitos": ["1FIS02"],
      "ciclo": 2
    },
    {
      "id": "ING02",
      "nombre": "Dibujo en ingeniería",
      "creditos": 4.5,
      "requisitos": ["1MAT04"],
      "ciclo": 2
    },
    {
      "id": "1LIN16",
      "nombre": "Trabajo académico",
      "creditos": 3.0,
      "requisitos": ["1LIN15"],
      "ciclo": 2
    },
    {
      "id": "1FIL01",
      "nombre": "Ciencia y filosofía",
      "creditos": 3,
      "requisitos": [],
      "ciclo": 2
    }
  ],
  "links": [{
      "source": "1QUI01",
      "target": "1QUI02",
      "value": 1
    },
    {
      "source": "1MAT06",
      "target": "1MAT05",
      "value": 3
    },
    {
      "source": "1MAT06",
      "target": "1MAT04",
      "value": 2
    },
    {
      "source": "1FIS02",
      "target": "1MAT06",
      "value": 1
    },
    {
      "source": "1FIS02",
      "target": "1FIS01",
      "value": 2
    },
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
  /*.force("charge", d3.forceManyBody())*/
  .force("collide", d3.forceCollide(r + 2))
  /*.force("center", d3.forceCenter(width / 2, height / 2))*/
  .on("tick", ticked);

  simulation
  .nodes(graph.nodes)
  .force("x", d3.forceX( function(d){
    console.log(d.nombre + ": "+ d.ciclo+"["+distMin*d.ciclo+"]");
    return distMin*d.ciclo;
  }))
  .force("y", d3.forceY( function(d){
    var aux = countCiclos[d.ciclo-1];
    countCiclos[d.ciclo-1] += 50;
    return aux;
  }));
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
