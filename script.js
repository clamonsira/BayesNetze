// ------------------------------------------
// Positionen
// ------------------------------------------

var statePosX = [50, 350, 650, 50];
var statePosY = [70,70,70,200]; 

// ------------------------------------------
// Bayes Netz
// ------------------------------------------

var width = window.innerWidth*0.7,
    height = window.innerHeight;

var leftContainer = d3.select("body").append("svg")
                                    .attr("width", width)
                                    .attr("height", height)
                                    .style("border", "1px solid black")
                                    .attr("id", "leftContainer")
                                    .append("g")
                                    .attr("id", "graph");

                                    
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
    
    force.nodes(json.nodes)//.concat(linkNodes))
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
                    .attr("stroke-width", 4)
                    .attr("stroke", "steelblue")
                    .style("marker-end",  "url(#end)");
    //Arrows
                leftContainer.append("defs").selectAll("marker")
                    .data(["end"])
                    .enter().append("marker")
                    .attr("id", function(d) { return d; })
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 10)
                    .attr("refY", 0)
                    .attr("markerWidth", 5)
                    .attr("markerHeight", 5)
                    .attr("orient", "auto")
                    .append("path")
                    .attr("d", "M0,-5L10,0L0,5")
                    .style("stroke", "steelblue")
                    .style("fill", "steelblue")
                    .style("stroke-width", 1)
                    //.style("opacity", "0.6");


    
    // -----------------
    // Nodes
    // -----------------   
                
    var activeNodes = new Array(json.nodes.length);
    for (var i = 0; i < activeNodes.length; ++i) { activeNodes[i] = false; };
    
    var node = leftContainer.selectAll(".node")
                          .data(json.nodes)
                        .enter().append("g")
                          .attr("class", "node")
                          .attr("id", function(d){return d.name})
                         //.attr("transform", function(d,i) { return "translate(" + statePosX[i] + "," + statePosY[i] + ")"}) 
                         .call(force.drag)
                         .on("click", function hightlightNode(){

                                 for (i=0; i<json.nodes.length; i++){
                                     if (this.id == json.nodes[i].name){

                                         if (activeNodes[i]){
                                            d3.select(this.childNodes[0]).style("stroke-width", 2);
                                            rightContainer.select("text").text(" ");
                                            rightContainer.select("rect").attr("height", 0);
                                            activeNodes[i] = false;
                                            break;
                                         }
                                        if (!activeNodes[i]){
                                            d3.select(this.childNodes[0]).style("stroke-width", 5);
                                            rightContainer.select("text").text(this.id);
                                            rightContainer.select("rect").attr("height",600);
                                            for (var j = 0; j < activeNodes.length; ++j) { 
                                                if (activeNodes[j]){
                                                    d3.select(document.getElementById(json.nodes[j].name).childNodes[0]).style("stroke-width", 2)
                                                }
                                                activeNodes[j] = false; 
                                            };
                                            activeNodes[i] = true;
                                            break;
                                        }  
                                     }
                                 }
                            
                        });

    var rects = node.append("rect");

    var rectAttributes = rects.attr("x", 0)
                              .attr("y", 0)
                              .attr("width",200)
                              .attr("height", function(d,i) {return getStateHeight(json.nodes)[i]})
                              .style("fill", function(d,i) {if(d.disease) {return "#F6E3CE";} else {return "white";}})
                              .style("stroke", "orange")
                              .style("stroke-width", 2)
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
    
    var valueGroup = node.append("g");
    
    var valueText = valueGroup.append("text");

    var valueAttributes = valueText
                     .style("fill", "purple")
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "15px")
                     .attr("x", 5)
                     .attr("y", 22);

    var values = valueAttributes.selectAll("tspan")
                     .data(function (d,i) {return d.values})
                     .enter()
                     .append("tspan")
                     .text(function(d) { return d; })
                     .attr("dy", 20)
                     .attr("x", 10);


    var probabilityText = valueGroup.append("text");

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

    
/*    var middle = node.append("circle")
                        .attr("cx", 100)
                        .attr("cy", function(d,i) {return getStateHeight(json.nodes)[i] * 0.5})
                        .attr("r", 100)
                        .style("fill", "red");*/
        
    // -----------------
    // linkNodes (to avoid link overlapping)
    // ----------------- 
    var linkNodes = [];

    json.links.forEach(function(link) {
      linkNodes.push({
        source: json.nodes.indexOf(link.source),
        target: json.nodes.indexOf(link.target)
      });
    });
/*    json.links.forEach(function(link) {
      linkNodes.push({
        source: document.getElementById(json.nodes[link.source].name),
        target: document.getElementById(json.nodes[link.target].name)
      });
    });*/
    
    var linkNode = leftContainer.selectAll(".link-node")
                    .data(linkNodes)
                    .enter().append("circle")
                    .attr("class", "link-node")
                    .attr("id", function(d) {return json.nodes[d.source].name + " + " + json.nodes[d.target].name})
                    .attr("r", 2)
                    .style("fill", "red");
    
    force.on("tick", function() {
        
        linkNode.attr("cx", function(d) { return d.x = (json.nodes[d.source].x + json.nodes[d.target].x) * 0.5 + 100; })
                .attr("cy", function(d) { return d.y = (json.nodes[d.source].y + json.nodes[d.target].y) * 0.5 + 67; });
        /*linkNode.attr("cx", function(d) { return d.x = (d.source.x + d.target.x) * 0.5; })
                .attr("cy", function(d) { return d.y = (d.source.y + d.target.y) * 0.5; });
        */
        link.attr("x1", function(d) { return Math.max(0, Math.min(width,d.source.x)); })
            .attr("y1", function(d) { return Math.max(0, Math.min(height,d.source.y)); })
            .attr("x2", function(d) { return Math.max(0, Math.min(width,d.target.x)); })
            .attr("y2", function(d) { return Math.max(0, Math.min(height,d.target.y)); });
        
        //node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        rectAttributes.attr("x", function(d) { return Math.max(0, Math.min(width - 200, d.x)); })
                      .attr("y", function(d) { return Math.max(0, Math.min(height - 67, d.y)); });
        nameAttributes.attr("x", function(d) { return Math.max(0, Math.min(width - 200, d.x))+100; })
                      .attr("y", function(d) { return Math.max(0, Math.min(height - 67, d.y))+22; })
        valueGroup.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        
        var bBox = document.getElementById("graph").getBBox() // später zur Zentrierung
        //document.getElementById("leftContainer").select("g").attr("transform", "scale(" + width / bBox.width+ "," + height / bBox.height + ")");
        });

});

// ------------------------------------------
// rechte Seite
// ------------------------------------------

var widthRight = window.innerWidth * 0.28;

var rightContainer = d3.select("body").append("svg")
                                    .attr("width", widthRight)
                                    .attr("height", height)
                                    .style("background", "lightyellow")
                                    .style("border", "1px solid black")
                                    .attr("id", "rightContainer");

var heading = rightContainer.append("text")
                     .style("fill", "purple")
                     .attr("x", 60)
                     .attr("y", 50)
                     //.text("test")
                     .attr("font-family", "sans-serif")
                     .attr("font-size", "22px");

var table = rightContainer.append("rect")
                          .attr("x", 40)
                          .attr("y", 70)
                          .attr("width",400)
                          .attr("height",0)
                          .style("fill", "white")
                          .style("stroke", "orange")
                          .style("stroke-width", 5)
                          .attr("rx", 2)
                          .attr("ry", 2);


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
