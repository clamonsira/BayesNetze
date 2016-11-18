// ------------------------------------------
// Positionen
// ------------------------------------------

var statePosX = [50, 350, 650, 50];
var statePosY = [70,70,70,200]; 

// ------------------------------------------
// Bayes Netz
// ------------------------------------------

var width = window.innerWidth * 0.7,
    height = window.innerHeight;

var leftContainer = d3.select("body").append("svg")
                                    .attr("width", width)
                                    .attr("height", height)
                                    //.style("border", "1px solid black")
                                    .attr("id", "leftContainer")
                                    .append("g")
                                    .attr("id", "graph");

                                    
d3.json("graph.json", function(error, json) {
    if (error) throw error;
    
   /* // -----------------
    // Linknodes to avoid edge overlapping
    // -----------------
      var linkNodes = [];

      json.links.forEach(function(link) {
            linkNodes.push({
                source: json.nodes[link.source],
                target: json.nodes[link.target]
            });
      });   */
    
    // ------------------------------------------
    // Graph-Layout
    // ------------------------------------------
    var force = d3.layout.force()
                .size([width, height])                
                .linkDistance(300)
                .charge(-2000)
                .gravity(0.08)
                .linkStrength(3)
                //.center(d3.forceCenter(width / 2, height / 2));
        
                //.friction(0.5).chargeDistance(400);
    
    force.nodes(json.nodes)//.concat(linkNodes))
        .links(json.links)//.concat(invisibleArray))
        .start();
      
    // -----------------
    // Edges
    // -----------------
    var link = leftContainer.selectAll(".link")
                    .data(json.links)
                    .enter().append("line").attr("id", "link")
                    .attr("class", "link")
                    .attr("transform", function(d,i){return "translate(100,67)"})// +getNodeHeight(json.nodes[d.source])+ ")"})
                    .style("marker-end",  "url(#end)");
    //Arrows
                leftContainer.append("defs").selectAll("marker")
                    .data(["end"])
                    .enter().append("marker")
                    .attr("id", function(d) { return d; })
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 10)
                    .attr("refY", 0)
                    .attr("markerWidth", 7)
                    .attr("markerHeight", 17)
                    .attr("orient", "auto")
                    .append("path")
                    .attr("d", "M0,-5L10,0L0,5")
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

                        // -----------------
                        // highlight Node
                        // -----------------
                         .on("click", function hightlightNode(){

                                     for (i=0; i<json.nodes.length; i++){
                                         if (this.id == json.nodes[i].name){

                                             if (activeNodes[i]){
                                                d3.select(this.firstChild).style("stroke-width", 2);
                                                rightContainer.select("text").text(" ");
                                                rightContainer.selectAll("foreignObject").remove();
                                                activeNodes[i] = false;
                                                break;
                                             }
                                            if (!activeNodes[i]){
                                                //wenn schon ein anderer active war
                                                for (var j = 0; j < activeNodes.length; ++j) { 
                                                    if (activeNodes[j]){
                                                        d3.select(document.getElementById(json.nodes[j].name).firstChild).style("stroke-width", 2);
                                                        rightContainer.selectAll("foreignObject").remove();
                                                    }
                                                    activeNodes[j] = false; 
                                                };
                                                d3.select(this.childNodes[0]).style("stroke-width", 5);
                                                rightContainer.select("text").text(this.id);
                                                activeNodes[i] = true;
                                                //createTable
                                                var tabl = createTable(i);
                                                break;
                                            }  
                                         }
                                     }
                        });
    // -----------------
    // create Table
    // -----------------
    
    function createTable(indexOfNode){
        //gibt im Moment immer einen leeren Array zurueck
        //var p = getParentsIndex(indexOfNode);
        var parents = [2,4,1] 
        parents.push(indexOfNode)
        
        var columns = new Array(0);
        parents.forEach(function(element,index, array){
            columns.push(json.nodes[element].name)
        })
        
        var rows = [];
        var countRows = 1;
        for (p = 0; p < parents.length; p++){
            countRows *= json.nodes[parents[p]].values.length;
        }
        
        for (i = 0; i < countRows ; i++){
            rows.push(new Array (columns.length));
        }
        
        // jede Zusammensetzung der Values
/*        for (i = 0; i < rows.length; i++){
            for (j = 0; j < parents.length; j++) {
                for (k=0; k<json.nodes[parents[j]].values.length; k++) {
                   rows[i][j] = json.nodes[parents[j]].values[k];
                }
            }
        }*/

        return tabulate(rows, columns)
    }
    
    function getParentsIndex(indexOfNode){
        var name = json.nodes[indexOfNode].name;
        //maximal 6 elternknoten
        var parents = new Array(6);
        for (i = 0; i < json.links.length; i++) {
            //alert(parseInt((json.links[i].target)))
            // das sind beides Ojects, keine ints und sind nie gleich
            if (json.links[i].target == indexOfNode) {
                parents.push(json.links[i].source);
            }
        }
        return parents;
    }
    
    function tabulate(rows, columns) {

    var table = rightContainer.append("foreignObject")
                                .attr("y", 100)
                                .attr("x", 50)
                                .attr("width", widthRight)
                                .attr("height", height / 2)
                                .append("xhtml:body")
                                .append("table")
                                .attr("id", "table")
                                .attr("border", 1)

       // var thread = table.append("thread").attr("width", 400)

        //var tbody = table.append("tbody")

        //tablelength = 400
        var cellwidth = 400/columns.length;

        var row = table.selectAll("tr")
                    .data(rows.concat([columns]))
                    .enter()
                    .append("tr")


            //Unterscheidung zw thread und tbody(th und td)
    /*        row.forEach(function(d,i){
                if(i == 0){
                    d3.select(this).attr("class", "thread")
                                .selectAll("td")
                                .data(columns)
                                .enter()
                                .append("td")
                                .text(function(cell) {return cell;})
                }
                else{
                    d3.select(this).attr("class", "tbody")
                            .selectAll("th")
                            .data(rows[i-1])
                            .enter()
                            .append("th")
                            .attr("overflow", "hidden")
                            .text(function(cell) {return cell; })
                            .attr("width", cellwidth);
                }
            })*/

            //funktioniert aber keine unterscheidung zw td und th
            var cells = row.selectAll("th")
                            .data(function(d,i) {if(i==0) {return columns;}
                                                 else {return rows[i-1];}}
                                 )
                            .enter()
                            .append("th")
                            .attr("overflow", "hidden")
                            .text(function(cell) { return cell; })
                            .attr("width", cellwidth);

        return table;
    }
    // -----------------
    // end Table
    // -----------------
    
    var rects = node.append("rect").attr("class", "nodeRect");

    var rectAttributes = rects.attr("x", 0)
                              .attr("y", 0)
                              .attr("width", 200)
                              .attr("height", function(d,i) {return getStateHeight(json.nodes)[i]})
                              .style("fill", function(d,i) {if(d.disease) {return "#ffc266";} else {return "white";}})
                              .style("stroke-width", 2)
                              .attr("rx", 10)
                              .attr("ry", 10);


    var name = node.append("text");

    var nameAttributes = name.style("fill", "purple")
                     .attr("x", 100)
                     .attr("y", 22)
                     .text(function (d) {return d.name;})
                     .text(function (d) {return d.name;})
                     .attr("font-size", "22px")
                     .attr("text-anchor", "middle");
    
    var valueGroup = node.append("g")
                         .attr("id", function(d) {return "valueGroup" });//+ d.name} );
    
    var valueText = valueGroup.append("text");

    var valueAttributes = valueText
                     .style("fill", "purple")
                     .attr("font-size", "15px")
                     .attr("x", 15)
                     .attr("y", 22);

    var values = valueAttributes.selectAll("tspan")
                     .data(function (d,i) {return d.values})
                     .enter()
                     .append("tspan")
                     .text(function(d) { return d; })
                     .attr("dy", 20)
                     .attr("x", 30);
    
/*    var click = valueGroup.append("g")
                     .selectAll("rect")
                     .data(function (d,i) {return d.values})
                     .enter()
                     .append("rect")
                     .attr("id", function(d) {return d;})
    
    var activeClicks = new Array(json.nodes.length);
    for (var j = 0; j < activeClicks.length; j++) {
        activeClicks[j] = new Array(json.nodes[j].values.length)
    }
    for (var i = 0; i < activeClicks.length; ++i) { 
        for (var k = 0; k < activeClicks[i].length; k++){
            activeNodes[i][k] = false; 
        }
    };
    
    var clickAttributes = click.attr("width", 17)
                     .attr("height", 15)
                     .attr("x", 5)
                     .attr("y", function(d,i) {return 20 * (i+1) +8})
                     .style("fill", "#F8FBEF")
                     .style("stroke", "orange")
                     .on("click",function(){
                         for (i=0; i<json.nodes.length; i++){
                            if(this.parentNode.parentNode.parentNode.id == json.nodes[i].name)
                                for (j=0; j<json.nodes[i].values.length; j++){
                                    if(d3.select(this).id = json.nodes[i].values[j]){
                                        if(activeClicks[i][j]){
                                            d3.select(this).style("fill", "#F8FBEF")
                                            activeClicks[i][j] = false;
                                        }
                                        else {
                                            for (k = 0; k < activeClicks[i].length; k++){
                                                if(activeClicks[i][k]) {
                                                    d3.select(document.getElementById(json.nodes[i].values[k])).style("fill", "#F8FBEF")
                                                    activeClicks[i][k] = false;
                                                }
                                                d3.select(this).style("fill", "purple");
                                                activeClicks[i][j] = true;
                                               /// hightlightNode(this.parentNode.parentNode.parentNode,json);
                                                
                                            }
                                        }
                                    }
                                }
                         }
                     }
                    )*/


    var probabilityText = valueGroup.append("text");

    var probabilityAttributes = probabilityText
                     .style("fill", "purple")
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

    
/*  var middle = node.append("circle")
                        .attr("cx", 100)
                        .attr("cy", function(d,i) {return getStateHeight(json.nodes)[i] * 0.5})
                        .attr("r", 100)
                        .style("fill", "red");*/
    
  /*  
    // -----------------
    // Linknodes
    // -----------------
    var linkNode = leftContainer.selectAll(".link-node")
                    .data(linkNodes)
                    .enter().append("circle")
                    .attr("class", "link-node")
                    //.attr("id", function(d) {return json.nodes[d.source].name + " + " + json.nodes[d.target].name})
                    .attr("r", 2)
                    .style("fill", "red");
    */
    // -----------------
    // adjust Layout after moving a node
    // -----------------
    force.on("tick", function() { 
    
        link.attr("x1", function(d) { return Math.max(0, Math.min(width, d.source.x)); })
            .attr("y1", function(d) { return Math.max(0, Math.min(height, d.source.y)); })
            .attr("x2", function(d) { return Math.max(0, Math.min(width, d.target.x)); })
            .attr("y2", function(d) { return Math.max(0, Math.min(height, d.target.y)); });
        
/*      node.forEach(function(d){

            var valueBBox = document.getElementById(d.name).getBBox();
            var valueWidth = valueBBox.width + valueBBox.x;
            var valueHeight = valueBBox.height + valueBBox.y;

            if((valueWidth < width) && (valueHeight < height) && (valueWidth > 0) && (valueHeight > 0)){
                document.getElementById(d.name).attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                }
        })*/
        rectAttributes.attr("x", function(d) { return Math.max(0, Math.min(width - 200, d.x)); })
                      .attr("y", function(d) { return Math.max(0, Math.min(height - 67, d.y)); }); //getStateHeight
        nameAttributes.attr("x", function(d) { return Math.max(0, Math.min(width - 200, d.x))+100; })
                      .attr("y", function(d) { return Math.max(0, Math.min(height - 67, d.y))+22; })
        
        var valueBBox = document.getElementById("valueGroup").getBBox();
        var valueWidth = valueBBox.width + valueBBox.x;
        var valueHeight = valueBBox.height + valueBBox.y;
        
        valueGroup.forEach(function(d) {
            if((valueWidth < width) && (valueHeight < height) && (valueWidth > 0) && (valueHeight > 0)){
                valueGroup.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                //valueGroup.attr("transform", function(d) { return "translate(" + d.childNodes[0].childNodes[0].x + "," + d.childNodes[0].childNodes[0].y + ")"; }); muss noch angepasst werden(xWert von erstem tspan)
            }
        })
        
        /*valueGroup.selectAll("text").attr("y", function(d) { return Math.max(0, Math.min(height - 67, d.y))+22; })
                                    .attr("x", function(d) { return Math.max(0, Math.min(width - 200, d.x))+5; })
        
        valueText.selectAll("tspan").attr("dx", function(d) { return Math.max(0, Math.min(width - 200, d.x))+5; })
        probabilityText.selectAll("tspan").attr("dx", function(d) { return Math.max(0, Math.min(width - 200, d.x))+190; })*/

       /* linkNode.attr("cx", function(d) { return d.x = (d.source.x + d.target.x) * 0.5 +100; })
                .attr("cy", function(d) { return d.y = (d.source.y + d.target.y) * 0.5 + 67; });*/
        
        
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
                                    .style("border", "1px solid #e6e6ff")
                                    .attr("id", "rightContainer");

var heading = rightContainer.append("text")
                     .style("fill", "purple")
                     .attr("x", 60)
                     .attr("y", 70)
                     .attr("font-size", "25px");



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
 
