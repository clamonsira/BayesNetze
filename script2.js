var jsonNodes = [
  { "name": "Alter", "values": ["unter 18","von 18 bis 50", "über 50"], "properties": [0.2,0.4,0.4]},
  { "name": "Blutdruck", "values": ["unter 18","von 18 bis 50", "über 50"], "properties": [0.2,0.4,0.4]},
  { "name": "Krebs", "values": ["ja","nein"], "properties": [0.2,0.8]},
  { "name": "Asien", "values": ["ja","nein"], "properties": [0.2,0.8]}
  ];

var links = [
    {"source": "Alter", "target": "Blutdruck"},
    {"source": "Blutdruck", "target": "Krebs"},
    {"source": "Alter", "target": "Krebs"},
    {"source": "Asien", "target": "Blutdruck"}
];

// ------------------------------------------
//Positionen
// ------------------------------------------

var statePosX = [50, 250, 50, 350];
var statePosY = [70,270,470,70]; 
var stateHeight = [];

function getStateHeight(nodes){
    for (i=0; i < nodes.length; i++){
        stateHeight.push(nodes[i].values.length * 20 + 24)
    }
    return stateHeight
}



/*function getNamePos(nodes){}
function getValuePos(nodes){
    ys= []
    for (i=0; i<nodes.length; i++) {
        valSize = nodes[i].length;
        ys.push(i*15)
    }
    return ys
*/


// ------------------------------------------
//HTML Elemente
// ------------------------------------------


var width = 960,
    height = 500;

var force = d3.layout.force()
                .nodes(jsonNodes)/*function (){
                    var arr=[]
                    for (i=0;i<jsonNodes.length; i++){
                        arr.push(jsonNodes[i].name)
                    }
                    return arr
                    })*/
                .links(links)
                .size([width, height])
                .linkDistance(60)
                .charge(-300)
                .on("tick", tick)
                .start();


var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

var link = svg.selectAll(".link")
            .data(force.links())
            .enter().append("line")
            .attr("class", "link");

var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "node")
            /*.on("mouseover", mouseover)
            .on("mouseout", mouseout)*/
            .call(force.drag);

var rects = node.append("rect");

/*var names  = node.append("text");

var values = nodes.append("g")
                    .selectAll("text")
                    .data(function(i) {return i.values;})
                    .enter()
                    .append("text")
                    .text(function (d) {return d})

var valueText = node.append("text")
*/
var rectAttributes = rects.attr("x", 0)//function(d,i) {return statePosX[i]})
                          .attr("y", 0)//statePosY)
                          .attr("width",200)
                          .attr("height",function(d,i){return getStateHeight(jsonNodes)[i]})
                          .style("fill", "yellow")
                          .style("stroke", "orange")
                          .attr("rx", 10)
                          .attr("ry", 10)

/*
var nameAttributes = names.style("fill", "purple")
                 .attr("x", 50)//function(d,i) {return  statePosX[i] + 50;})
                 .attr("y", 22)//statePosY + 22)
                 .text(function (d) {return d.name;})
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "20px")
                 //.attr("text-anchor", "middle");

var valueAttributes = valueText
                 .style("fill", "purple")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "15px")
                 .attr("x", 5)
                 .attr("y", 22)
                 //.attr("transform", "translate(0,20)")

                 .selectAll("tspan")
                 .data(function (d,i) {return d.values})
                 .enter()
                 .append("tspan")
                 .text(function(d) { return d; })
                 .attr("dy", 20)
                 .attr("x", 10)//this.parentElement.getAttribute("x")*/

function tick() {
  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

/*function mouseover() {
  d3.select(this).select("rect").transition()
      .duration(750)
      .attr("r", 16);
}

function mouseout() {
  d3.select(this).select("rect").transition()
      .duration(750)
      .attr("r", 8);
}*/