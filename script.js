// ------------------------------------------
// Positionen (Vergleichswerte - wird nicht genutzt)
// ------------------------------------------

var statePosX = [50, 350, 650, 200, 500, 50, 350, 650, 50, 350, 650];
var statePosY = [670, 670, 670, 870, 870, 300, 300, 300, 70, 70, 70]; 

d3.json("graph.json", function(error, json) {
    if (error) throw error;
    // ------------------------------------------
    // Bayes Netz
    // ------------------------------------------

    var width = window.innerWidth * 0.50,
        height = window.innerHeight;

    var leftContainer = d3.select("body").append("svg")
                                        .attr("width", width)
                                        .attr("height", height)
                                        .attr("id", "leftContainer")
                                        .append("g")
                                        .attr("id", "graph");
    
    // -----------------
    // Compute Layout
    // -----------------
    var nodePosX, nodePosY;
    var positions = computeLayout();
    nodePosX = positions[0];
    nodePosY = positions[1];
    
    // -----------------
    // Edges
    // -----------------
    var link = leftContainer.selectAll(".link")
                    .data(json.links)
                    .enter().append("line")
                    .attr("id", "link")
                    .attr("class", "link")
                    .attr("x1",function(d,i){return nodePosX[json.links[i].source];})
                    .attr("y1",function(d,i){return nodePosY[json.links[i].source];})
                    .attr("x2",function(d,i){return nodePosX[json.links[i].target];})
                    .attr("y2",function(d,i){return nodePosY[json.links[i].target];})// unten y  auf 0 setzen?
                    .attr("transform", function(d,i){return "translate(100,67)"})// +getNodeHeight(json.nodes[d.source])+ ")"})
                    .style("marker-end",  "url(#end)");
    //Arrows
                leftContainer.append("defs").selectAll("marker")
                    .data(["end"])
                    .enter().append("marker")
                    .attr("id", function(d) { return d; })
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 10)//versetzt den Marker nach hinten
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
                         .attr("transform", function(d,i) { return "translate(" + nodePosX[i] + "," + nodePosY[i] + ")"}) 

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
    
    var rects = node.append("rect").attr("class", "nodeRect");

    var rectAttributes = rects.attr("x", 0)
                              .attr("y", 0)
                              .attr("width", 200)
                              .attr("height", function(d,i) {return getNodeHeight(i)})
                              .style("fill", function(d,i) {return "white"})
                              .style("stroke", function(d,i) {if(d.type == "disease") {return "#ffc266";};
                                                            if(d.type == "therapy") {return "steelblue";};
                                                            if(d.type == "examination") {return " #12858e";};
                                                            if(d.type == "symptom") {return "orange";}})
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
    
    var stateGroup = node.append("g")
                         .attr("id", function(d) {return "stateGroup" });//+ d.name} );
    
    var stateText = stateGroup.append("text");

    var stateAttributes = stateText
                     .style("fill", "purple")
                     .attr("font-size", "15px")
                     .attr("x", 10)
                     .attr("y", 22);

    var states = stateAttributes.selectAll("tspan")
                     .data(function (d,i) {return d.states})
                     .enter()
                     .append("tspan")
                     .text(function(d) { return d; })
                     .attr("dy", 20)
                     .attr("x", 10);
    
    /*var hightlightState = stateAttributes.selectAll("rect")
                         .data(function (d,i) {return d.states})
                        .enter()
                        .append("rect")
                        .style("stroke")
                        .on("click", function(){alert(true)})*/

    var probabilityText = stateGroup.append("text");

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
    
// ------------------------------------------
// rechte Seite
// ------------------------------------------

var widthRight = window.innerWidth * 0.48;

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

var menu = rightContainer.append("g")

var menuHeading = menu.append("text")
                     .style("fill", "purple")
                     .attr("x", 60)
                     .attr("y", 770)
                     .attr("font-size", "25px")
                     .text("Das Bayes Netz ...");
    
var aktualisierButton = menu.append("rect")
                        .attr("x", 60)
                        .attr("y", 800)
                        .attr("width", 100)
                        .attr("height", 22)
                        .style("fill", "white")
                        .style("stroke", "orange")
                        .attr("rx", 10)
                        .attr("ry", 10);
                        
var aktualisierButtonName = menu.append("text")
                     .attr("x", 65)
                     .attr("y", 818)
                     .text("aktualisieren")
                     .style("fill", "purple");

var erweiterButton = menu.append("rect")
                        .attr("x", 60)
                        .attr("y", 840)
                        .attr("width", 100)
                        .attr("height", 22)
                        .style("fill", "white")
                        .style("stroke", "orange")
                        .attr("rx", 10)
                        .attr("ry", 10);
                        
var erweiterButtonName = menu.append("text")
                     .attr("x", 75)
                     .attr("y", 858)
                     .text("erweitern")
                     .style("fill", "purple");

var heading = rightContainer.append("text")
                     .style("fill", "purple")
                     .attr("x", 60)
                     .attr("y", 70)
                     .attr("font-size", "25px");


// ------------------------------------------
// Funktionen
// ------------------------------------------

function getNodeHeight(nodeIndex){
    return json.nodes[nodeIndex].states.length * 20 + 27
}
    
function computeLayout() {
    //Arrays mit Indexen der Nodes nach Typen sortiert, in therapyNodes sind auch die examinations drin
    var symptomNodes = [], therapyNodes = [], diseaseNodes = [];
    for(i = 0; i < json.nodes.length; i++){
        if (json.nodes[i].type == "symptom"){
            symptomNodes.push(i);
        }
        if (json.nodes[i].type == "disease"){
            diseaseNodes.push(i);
        }
        if (json.nodes[i].type == "therapy" || json.nodes[i].type == "examination"){
            therapyNodes.push(i);
        }
    }
    var allArrays = [symptomNodes, diseaseNodes, therapyNodes]
    
    var xPos = new Array(json.nodes.length), yPos = new Array(json.nodes.length);
    
    allArrays.forEach(function(a,noOfArray){
        
        if (a.length > 6) {
            throw error;
        }
        else {
            a.forEach(function(nodeI, noOfIndex,a){
                // -----------------
                // yPos
                // ----------------- 
                if(noOfIndex < 3) {
                    if (noOfArray == 0) {
                        yPos[nodeI] = 670;
                    }
                    if (noOfArray == 1) {
                        yPos[nodeI] = 300;
                    }
                    if (noOfArray == 2) {
                        yPos[nodeI] = 70;
                    }
                }
                else {
                    if (noOfArray == 0) {
                        yPos[nodeI] = 870;
                    }
                    if (noOfArray == 1) {
                        yPos[nodeI] = 500;
                    }
                    if (noOfArray == 2) {
                        yPos[nodeI] = 270;
                    }
                }
                // -----------------
                // xPos
                // ----------------- 
                
                if(noOfIndex % 3 == 0) {
                    xPos[nodeI] = 50;
                }
                if(noOfIndex % 3 == 1) {
                    xPos[nodeI] = 350;
                }
                if(noOfIndex % 3 == 2) {
                    xPos[nodeI] = 650;
                }
            })
            //in der letzten Zeile sind nur 2 Zustände
            if(a.length == 5 || a.length == 2) {
                xPos[a[a.length-1]] = 500;
                xPos[a[a.length-2]] = 200;
            }
            //in der letzten Zeile ist nur ein oder es sind nur 4 Zustände
            if(a.length == 1 || a.length == 4) {
                xPos[a[a.length-1]] = 200;
            }
        }
    })

    return [xPos, yPos]; 
    }

    function getParentsIndex(indexOfNode){
        var name = json.nodes[indexOfNode].name;
        var parents = new Array(0);
        for (i = 0; i < json.links.length; i++) {
           if (json.links[i].target == indexOfNode){

                parents.push(json.links[i].source);
            }
        }
        return parents;
    }
    
    function createTable(indexOfNode){
        var parents = getParentsIndex(indexOfNode);
        parents.push(indexOfNode)
        
        var columns = new Array(0);
        parents.forEach(function(element,index, array){
            columns.push(json.nodes[element].name)
        })
        json.nodes.forEach(function(d,i){
            if(d.name == columns[columns.length-1]){
                columns[columns.length-1] = d.states[0];
                for(i=0; i<d.states.length-1; i++){
                    columns.push(d.states[i+1]);
                }
            }
        })
        
        var rows = [];
        var countRows = 1;
        for (p = 0; p < parents.length-1; p++){
            countRows *= json.nodes[parents[p]].states.length;
        }
        
        var tryRow = new Array(columns.length - json.nodes[parents[parents.length-1]].states.length)
        for(i=0;i<tryRow.length;i++){
            tryRow[i] = "state";
        }
        for (i = 0; i < json.nodes[parents[parents.length-1]].states.length; i++){
            tryRow.push(json.nodes[parents[parents.length-1]].probabilities[i])
        }
        for (i = 0; i < countRows ; i++){
            rows.push(tryRow);
        }
        
        // jede Zusammensetzung der states
/*        for (i = 0; i < rows.length; i++){
            for (j = 0; j < parents.length; j++) {
                for (k=0; k<json.nodes[parents[j]].states.length; k++) {
                   rows[i][j] = json.nodes[parents[j]].states[k];
                }
            }
        }*/
        return tabulate(rows, columns)
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

        //tablelength = 500
        var cellwidth = 500/columns.length;

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
                            //.attr("overflow", "hidden")
                            .text(function(cell) { return cell; })
                            .attr("width", cellwidth);

        return table;
    }

})
