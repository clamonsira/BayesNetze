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

function getNodeHeight(node){
    var heigth = 0;
    d3.json("graph.json", function(error, json) {
        if (error) throw error;
        $.each(json.nodes,function(i, v) {
            if (v.name == node.name) {
                heigth = node.values.length *20 +27;
                
            }
        });
    })
    return height;
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

function hightlightNode(){
    node.style("fill", "black");
}

// ------------------------------------------
// Bayes Netz
// ------------------------------------------

var width = 900,
    height = 1000;

var leftContainer = d3.select("body").append("svg")
                                    .attr("width", "70%")
                                    .attr("height", "100%")
                                    .style("border", "1px solid black");

                                    
d3.json("graph.json", function(error, json) {
    if (error) throw error;
    
    
    // ------------------------------------------
    // Graph-Layout
    // ------------------------------------------
    var force = d3.layout.force()
                .size([width, height])
                .linkDistance(300)
                .charge(-3000)
                .gravity(0.08)
                .linkStrength(3);
                
    force.nodes(d3.values(json.nodes))
        .links(json.links)
        .start();
      
    // -----------------
    // Edges
    // -----------------
    var link = leftContainer.selectAll(".link")
                    .data(json.links)
                    .enter().append("line")
                    .attr("class", "link")
                    .attr("transform", function(d,i){return "translate(100,67)"})// +getNodeHeight(json.nodes[d.source])+ ")"})
                    .attr("stroke-width", 2)
                    .attr("stroke", "steelblue")
                    .style("marker-end",  "url(#suit)");
    //Pfeile
                leftContainer.append("defs").selectAll("marker")
                    .data(["suit", "licensing", "resolved"])
                    .enter().append("marker")
                    .attr("id", function(d) { return d; })
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 25)
                    .attr("refY", 0)
                    .attr("markerWidth", 10)
                    .attr("markerHeight", 10)
                    .attr("orient", "auto")
                    .append("path")
                    .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
                    .style("stroke", "steelblue")
                    .style("stroke-width", 1)
                    //.style("opacity", "0.6");


    
    // -----------------
    // Nodes
    // -----------------    
    var node = leftContainer.selectAll(".node")
                          .data(json.nodes)
                        .enter().append("g")
                          .attr("class", "node")
                          .attr("id", function(d){return d.name})
                         //.attr("transform", function(d,i) { return "translate(" + statePosX[i] + "," + statePosY[i] + ")"}) 
                         .call(force.drag)
                         .on("click", function(){
                             var r = d3.select(this).id;
                             var active = r.active? false : true,
                             newWidth = active ? 5 : 1;
                             if (r.active){
                                 d3.select(this).select("rect").style("stroke-width", 1);
                             }
                             if (!r.active){
                                 d3.select(this).select("rect").style("stroke-width", 5);
                             }
                             r.active = active;
                         });

    var rects = node.append("rect");

    var rectAttributes = rects.attr("x", 0)
                              .attr("y", 0)
                              .attr("width",200)
                              .attr("height", function(d,i) {return getStateHeight(json.nodes)[i]})
                              .style("fill", function(d,i) {if(d.disease) {return "#EFFBFB";} else {return "white";}})
                              .style("stroke", "orange")
                              .attr("rx", 10)
                              .attr("ry", 10);


    var name = node.append("text");

    var nameAttributes = name.style("fill", "purple")
                     .attr("x", 100)
                     .attr("y", 22)
                     .text(function (d) {return d.name;})
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "22px")
                     .attr("text-anchor", "middle");

    var valueText = node.append("text");

    var valueAttributes = valueText
                     .style("fill", "purple")
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "15px")
                     .attr("x", 5)
                     .attr("y", 22);
                     //.attr("transform", "translate(0,20)")

    var values = valueAttributes.selectAll("tspan")
                     .data(function (d,i) {return d.values})
                     .enter()
                     .append("tspan")
                     .text(function(d) { return d; })
                     .attr("dy", 20)
                     .attr("x", 10);


    var probabilityText = node.append("text");

    var probabilityAttributes = probabilityText
                     .style("fill", "purple")
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "15px")
                     .attr("x", 5)
                     .attr("y", 22);

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
    link.attr("x1", function(d) { return Math.min(width,d.source.x); })
        .attr("y1", function(d) { return Math.min(width,d.source.y); })
        .attr("x2", function(d) { return Math.min(width,d.target.x); })
        .attr("y2", function(d) { return Math.min(width,d.target.y); });

    node.attr("transform", function(d) { return "translate(" + Math.min(width, d.x) + "," + Math.min(height, d.y) + ")"; });
    });
});

// ------------------------------------------
// rechte Seite
// ------------------------------------------

var widthRight = 800;

var rightContainer = d3.select("body").append("svg")
                                    .attr("width", "29%")
                                    .attr("height", "100%")
                                    .style("background", "lightyellow")
                                    .style("border", "1px solid black");

                                    
            
