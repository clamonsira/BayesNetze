// ------------------------------------------
// Positionen
// ------------------------------------------

var statePosX = [50, 350, 650, 50];
var statePosY = [70,70,70,200]; 

// ------------------------------------------
// Funktionen
// ------------------------------------------
var stateHeight = [];

function getStateHeight(nodes){
    for (i=0; i < nodes.length; i++){
        stateHeight.push(nodes[i].values.length * 20 + 27)
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

function getEdgeLength(parent){
    var index;
    
    for (i=0;i<jsonNodes.length;i++){
        document.write(jsonNodes[i].name, parent)
        if(parent == jsonNodes[i].name){
            //p = jsonNodes[i]
            
            index = i 
        }
    }
    //return " 200,0 "
    return " " + statePosX[index] + "," + (statePosY[index]+getStateHeight(jsonNodes)[index])
}


// ------------------------------------------
// ------------------------------------------

var width = 2000,
    height = 1000;

var svgContainer = d3.select("body").append("svg")
                                    .attr("width", width)//"100%")
                                    .attr("height", height)// "100%")
                                    
var force = d3.layout.force()
                .size([width, height])
                .linkDistance(600)
                .charge(0)
                .gravity(0.05)
                .linkStrength(0.1);
                
d3.json("graph.json", function(error, json) {
    if (error) throw error;
    
    
    // ------------------------------------------
    // Graph-Layout
    // ------------------------------------------
    force.nodes(d3.values(json.nodes))
        .links(json.links)
        .start();
      
    // -----------------
    // Edges
    // -----------------
    var link = svgContainer.selectAll(".link")
                    .data(json.links)
                    .enter().append("line")
                    .attr("class", "link")
            .attr("stroke-width", 2)
            .attr("stroke", "steelblue");
            /*.append("g")
            .attr("class", "link")
            .selectAll("line")
            .data(json.links)
            .enter().append("line")
            .attr("stroke-width", 2)
            .attr("stroke", "steelblue");*/
    

    /*
    var edges = nodes.append("g")
                     //.attr("transform", "")
                     .attr("transform", "translate(100,0)")
                           /* .attr("id", "edges")
                            .selectAll("g")
                            .data(jsonNodes)
                            .enter()
                            .append("g")*/
                            /*.selectAll("polyline")
                            .data(function(d,i){return d.parents})
                            .enter()
                            .append("polyline")

    var edgeAttributes = edges.style("stroke", "steelblue")
                            .style("stroke-width", 4)
                            .style("fill","none")
                            .attr("points", function(d,i) {return "0,0," + getEdgeLength(d)})*/
    // -----------------
    // Nodes
    // -----------------    
    var node = svgContainer.selectAll(".node")
                          .data(json.nodes)
                        .enter().append("g")
                          .attr("class", "node")
                         //.attr("transform", function(d,i) { return "translate(" + statePosX[i] + "," + statePosY[i] + ")"}) 
                         .call(force.drag);
                        /*.append("g")
                        .attr("class", "node")
                        .selectAll("g") //pro Zustand eine Gruppe
                        .data(json.nodes)//liest array ein
                        .enter() 
                        .append("g")
                        .attr("id", function(d) {return d.name;});*/

    var rects = node.append("rect");

    var rectAttributes = rects.attr("x", 0)//function(d,i) {return statePosX[i]})
                              .attr("y", 0)//statePosY)
                              .attr("width",200)
                              .attr("height", function(d,i) {return getStateHeight(json.nodes)[i]})
                              .style("fill", "white")
                              .style("stroke", "orange")
                              .attr("rx", 10)
                              .attr("ry", 10)


    var name = node.append("text");

    var nameAttributes = name.style("fill", "purple")
                     .attr("x", 100)//function(d,i) {return  statePosX[i] + 50;})
                     .attr("y", 22)//statePosY + 22)
                     .text(function (d) {return d.name;})
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "22px")
                     .attr("text-anchor", "middle");


    /*var values = nodes.append("g")
                        .selectAll("text")
                        .data(function(i) {return i.values;})
                        .enter()
                        .append("text")
                        .text(function (d) {return d})*/

    var valueText = node.append("text")
                      //.attr("id", function(d,i){return "values" + i});

    var valueAttributes = valueText
                     .style("fill", "purple")
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "15px")
                     .attr("x", 5)
                     .attr("y", 22)
                     //.attr("transform", "translate(0,20)")

    var values = valueAttributes.selectAll("tspan")
                     .data(function (d,i) {return d.values})
                     .enter()
                     .append("tspan")
                     .text(function(d) { return d; })
                     .attr("dy", 20)
                     .attr("x", 10)//this.parentElement.getAttribute("x"))


    var probabilityText = node.append("text")
                      //.attr("id", function(d,i){return "values" + i});

    var probabilityAttributes = probabilityText
                     .style("fill", "purple")
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "15px")
                     .attr("x", 5)
                     .attr("y", 22)

                     //.attr("transform", "translate(0,20)")

    var probabilities = probabilityAttributes.selectAll("tspan")
                     .data(function (d,i) {return d.probabilities})
                     .enter()
                     .append("tspan")
                     .text(function(d) { return d; })
                     .attr("dy", 20)
                     .attr("x", 190)
                     .attr("text-anchor", "end");

    force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });
});