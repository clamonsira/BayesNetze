// ------------------------------------------
// Positionen (Vergleichswerte - wird nicht genutzt)
// ------------------------------------------

var statePosX = [50, 350, 650, 200, 500, 50, 350, 650, 50, 350, 650];
var statePosY = [670, 670, 670, 870, 870, 300, 300, 300, 70, 70, 70]; 

d3.json("http://10.200.1.75:8012/bn?name=bncancer1", function(error, json) {
    if (error) throw error;
    // ------------------------------------------
    // Bayes Netz
    // ------------------------------------------

    var width = window.innerWidth * 0.65 - 5,
        height = window.innerHeight - 5;

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
                    .attr("x1",function(d,i){return nodePosX[d.source] + 100;})
                    .attr("y1",function(d,i){return nodePosY[d.source] ;}) // hier muss noch der Fall berücksichtigt werden, wenn ein LINK IN GLEICHER EBENE ist, curvedEdges?
                    .attr("x2",function(d,i){return nodePosX[d.target] + 100;})
                    .attr("y2",function(d,i){return nodePosY[d.target] + getNodeHeight(d.target);})
                    //.attr("transform", function(d,i){return "translate(100,0)"})// +getNodeHeight(json.nodes[d.source])+ ")"})
                    .style("marker-end",  "url(#end)")
                    .attr("stroke", "lightblue")/*function(l,i) { FARBE PRO EBENE?
                        color = colors[Math.floor(Math.random()*colors.length)];
                        return color;
                    });*/
    //Arrows
                leftContainer.append("defs").selectAll("marker")
                    .data(["end"])
                    .enter().append("marker")
                    .attr("id", function(d) { return d; })
                    .attr("viewBox", "0 -5 10 10")
                    .attr("refX", 10)//versetzt den Marker nach hinten
                    .attr("refY", 0)
                    .attr("fill", "lightblue")
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
                                            headingDiscription.text(" ");
                                            headingTable.text(" ");
                                            rightContainer.selectAll("foreignObject").remove();
                                            discriptionBackground.attr("fill","white");
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
                                            headingTable.text(this.id);
                                            activeNodes[i] = true;
                                            //createTable
                                            var tabl = calculateTable(i);
                                            headingDiscription.text("Beschreibung");
                                            discriptionBackground.attr("fill","lightblue");
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
                              .style("stroke", function(d,i) {if(d.properties.type == "diagnosis") {return "#ffc266";};
                                                            if(d.properties.type == "therapy") {return "steelblue";};
                                                            if(d.properties.type == "examination") {return "#12858e";};
                                                            if(d.properties.type == "symptom") {return "#FE642E";}})
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
    
    //RadioButtons
    var radioButtons= node.append("g")
                        .attr("id","radioButtons") 
  
    var buttonGroups= radioButtons.selectAll("g.button")
                            .data(function(d,i) {return d.properties.states})
                            .enter()
                            .append("g")
                            .attr("class","button")
                            .style("cursor","pointer")
    
    //button width and height
    var bWidth= 10; //button width
    var bHeight= 10; //button height
    var bSpace= 9; //space between buttons
//ANPASSEN UND NACHGUCKEN
    var x0= 8; // x offset
    var y0= 33; //y offset
    
    //adding a rect to each button group
    buttonGroups.append("rect")
                .attr("class","buttonRect")
                .attr("width",bWidth)
                .attr("height",bHeight)
                .attr("x",function(d,i) {
                    return x0;
                })
                .attr("y",function(d,i) {
                    return y0+(bWidth+bSpace)*i;
                })
                .attr("fill","white")

    //adding text to each button group, centered within the button rect
    buttonGroups.append("text")
                .attr("id",function(d,i) { return "label" + i} )
                .attr("font-family","sans-serif")
                .attr("x",function(d,i) {
                    return x0 + bWidth/2;
                })
                .attr("y",function(d,i) {
                    return y0+(bWidth+bSpace)*i + bWidth/2;
                })
                .attr("text-anchor","middle")
                .attr("dominant-baseline","central")
                .attr("fill","purple")
                .text('\uf10c') //fontawesome labels
                .on("click", function hightlightButton(){
                        d3.select(document.getElementById(this.id)).text('\uf192');
                      
                 });
    
    
    //States
    var stateText = stateGroup.append("text");

    var stateAttributes = stateText
                     .style("fill", "purple")
                     .attr("font-size", "15px")
                     .attr("x", 10)
                     .attr("y", 22);

    var states = stateAttributes.selectAll("tspan")
                     .data(function (d,i) {return d.properties.states})
                     .enter()
                     .append("tspan")
                     .text(function(d) { return d.name; })
                     .attr("dy", 20)
                     .attr("x", 25);
    
    /*var hightlightState = stateAttributes.selectAll("rect")
                         .data(function (d,i) {return d.properties.states})
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
                     .data(function (d,i) {return d.properties.cpt.probabilities})
                     .enter()
                     .append("tspan")
                     .text(function(d) { return d.probability; })
                     .attr("dy", 20)
                     .attr("x", 190)
                     .attr("text-anchor", "end");
    
// ------------------------------------------
// rechte Seite
// ------------------------------------------
    
var widthRight = window.innerWidth * 0.35 - 5;

var rightContainer = d3.select("body").append("svg")
                                    .attr("width", widthRight)
                                    .attr("height", height)
                                    .style("border", "1px solid #e6e6ff")
                                    .attr("id", "rightContainer");
// -----------------
// Heading of Table
// -----------------
var headingTable = rightContainer.append("text")
                     .style("fill", "steelblue")
                     .attr("x", widthRight / 2)
                     .attr("y", 180)
                     .attr("font-size", "25px")            
                     .attr("text-anchor","middle");


// -----------------
// Buttons
// -----------------
var allButtons= rightContainer.append("g")
                    .attr("id","allButtons") 

//fontawesome button labels
var labels= ['\uf021 aktualisieren','\uf0ad bearbeiten','\uf0e2 zurück', '\uf055 erweitern'];

var buttonGroups= allButtons.selectAll("g.button")
                        .data(labels)
                        .enter()
                        .append("g")
                        .attr("class","button")
                        .style("cursor","pointer")
                        
//button width and height
var bWidth= 140; //button width
var bHeight= 40; //button height
var bSpace= 10; //space between buttons
        
var x0= 20; //x offset
var y0= 70; //y offset

//adding a rect to each button group
//sidenote: rx and ry give the rects rounded corners
buttonGroups.append("rect")
            .attr("class","buttonRect")
            .attr("width",bWidth)
            .attr("height",bHeight)
            .attr("x",function(d,i) {
                return x0+(bWidth+bSpace)*i;
            })
            .attr("y",y0)
            .attr("rx",5) 
            .attr("ry",5)
            .attr("fill","#FE642E")

//adding text to each button group, centered within the button rect
buttonGroups.append("text")
            .attr("class","buttonText")
            .attr("font-family","sans-serif")
            .attr("x",function(d,i) {
                return x0 + (bWidth+bSpace)*i + bWidth/2;
            })
            .attr("y",y0+bHeight/2)
            .attr("text-anchor","middle")
            .attr("dominant-baseline","central")
            .attr("fill","white")
            .text(function(d) {return d;})  
// -----------------
// Discription
// -----------------
var headingDiscription = rightContainer.append("text")
                     .style("fill", "steelblue")            
                     .attr("x", x0)
                     .attr("font-size", "20px");
var discriptionBackground = rightContainer.append("rect")
                                        .attr("width",590);
                                    
    
// ------------------------------------------
// Funktionen
// ------------------------------------------

function getNodeHeight(nodeIndex){
    return json.nodes[nodeIndex].properties.states.length * 20 + 27
}
    
function computeLayout() {
    //Arrays mit Indexen der Nodes nach Typen sortiert, in therapyNodes sind auch die examinations drin
    var symptomNodes = [], therapyNodes = [], diagnosisNodes = [];
    for(i = 0; i < json.nodes.length; i++){
        if (json.nodes[i].properties.type == "symptom"){
            symptomNodes.push(i);
        }
        if (json.nodes[i].properties.type == "diagnosis"){
            diagnosisNodes.push(i);
        }
        if (json.nodes[i].properties.type == "therapy" || json.nodes[i].properties.type == "examination"){
            therapyNodes.push(i);
        }
    }
    var allArrays = [symptomNodes, diagnosisNodes, therapyNodes]
    
    var xPos = new Array(json.nodes.length), yPos = new Array(json.nodes.length);
    
    allArrays.forEach(function(a,noOfArray){
        
        if (a.length > 6) {
            throw error;
        }
        else {
            a.forEach(function(nodeI, noOfIndex,a){
                // -----------------
                // yPos // umändern zu dynamisch! (mit scroll)
                // ----------------- 
                if(noOfIndex < 4) {
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
                
                if(noOfIndex % 4 == 0) {
                    xPos[nodeI] = 50;
                }
                if(noOfIndex % 4 == 1) {
                    xPos[nodeI] = 350;
                }
                if(noOfIndex % 4 == 2) {
                    xPos[nodeI] = 650;
                }
                if(noOfIndex % 4 == 3) {
                    xPos[nodeI] = 950;
                }
            })
            //in der letzten Zeile sind nur drei Zustände
            if(a.length == 3 || a.length == 7) {
                xPos[a[a.length-1]] = 800;
                xPos[a[a.length-2]] = 500;
                xPos[a[a.length-3]] = 200;
            }
            //in der letzten Zeile sind nur 2 Zustände
            if(a.length == 6 || a.length == 2) {
                xPos[a[a.length-1]] = 800;
                xPos[a[a.length-2]] = 200;
            }
            //in der letzten Zeile ist nur ein Zustand
            if(a.length == 1 || a.length == 5) {
                xPos[a[a.length-1]] = 500;
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
    
function calculateTable(indexOfNode){
        
    //was passiert, wenn keine states da sind? examinations
    var parents = getParentsIndex(indexOfNode);
    parents.push(indexOfNode)

    var columns = new Array(0);
    parents.forEach(function(element,index, array){
        columns.push(json.nodes[element].name)
    })
    json.nodes.forEach(function(d,i){
        if(d.name == columns[columns.length-1]){
            columns[columns.length-1] = d.properties.states[0].name;
            for(i=0; i<d.properties.states.length-1; i++){
                columns.push(d.properties.states[i+1].name);
            }
        }
    })

    var rows = [];
    var countRows = 1;
    for (p = 0; p < parents.length-1; p++){
        countRows *= json.nodes[parents[p]].properties.states.length;
        countRows *= json.nodes[parents[p]].properties.states.length;
    }

    var tryRow = new Array(columns.length - json.nodes[parents[parents.length-1]].properties.states.length)
    for(i=0;i<tryRow.length;i++){
        tryRow[i] = "state";
    }
    for (i = 0; i < json.nodes[parents[parents.length-1]].properties.states.length; i++){
        tryRow.push(json.nodes[parents[parents.length-1]].properties.cpt.probabilities[i].probability)
    }
    for (i = 0; i < countRows ; i++){
        rows.push(tryRow);
    }

    // jede Zusammensetzung der states
/*        for (i = 0; i < rows.length; i++){
        for (j = 0; j < parents.length; j++) {
            for (k=0; k<json.nodes[parents[j]].properties.states.length; k++) {
               rows[i][j] = json.nodes[parents[j]].properties.states[k];
            }
        }
    }*/
    return tabulate(rows, columns)
}

function tabulate(rows, columns) {
var x0= 20; //x offset
var y0= 210; //x offset
var table = rightContainer.append("foreignObject")
                            .attr("y", y0)
                            .attr("x", x0)
                            .attr("width",590)// widthRight)
                            .attr("height",500)// height / 2)
                            .append("xhtml:body")
                            .append("div")
                            .attr("id","table-div")
                            .style("max-width", "590px")
                            .style("max-height", "500px")
                            .style("overflow-y","auto")
                            .style("overflow-x","hidden")
                            //.style("display", "table")
                            .append("table")
                            .attr("width", 580)
                            .attr("heigth", "30%")
                            .attr("id", "table")
                            .attr("border", 1);

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
                       // .attr("width", cellwidth);


        var discriptionYPos = document.getElementById("table-div").getBoundingClientRect().height;

        headingDiscription.attr("y", discriptionYPos + y0 + 30)


        discriptionBackground.attr("height",100) // anpassen
                                                    .attr("x",x0)
                                                    .attr("y", discriptionYPos + y0 + 40)
                                                    .attr("rx",5) 
                                                    .attr("ry",5)
                                                    .attr("fill", "white")

    return table;
}

})
