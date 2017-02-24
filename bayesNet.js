function bayesNet(id) {
    
d3.json(id + ".json", function(error, json) { //"http://10.200.1.75:8012/bn?name=bncancer1,lung1,asia1,alarm1,hepar1, Dgraph.json" "cancer.json", function(error, json) {//
    if (error) throw error;
    // ------------------------------------------
    // LINKE SEITE
    // ------------------------------------------

        // -----------------
        // Compute Layout
        // -----------------
        var nodePosX, nodePosY;
        var positions = computeLayout(json);
        nodePosX = positions[0];
        nodePosY = positions[1];
        tmpHeight = positions[2];

        //turn layout
        var c1 = 0,c2 = 0;
        for(i = 0; i < json.links.length; i++) {
            if(nodePosY[json.links[i].target] < nodePosY[json.links[i].source] ) { //link is from down to up
                c1++;
            } else {
                c2++;
            }
        }

        if(c1 < c2) {
            positions = computeLayout(json,true);
            nodePosX = positions[0];
            nodePosY = positions[1];
            tmpHeight = positions[2];
        }

        // ------------------------------------------
        // Bayes Netz
        // ------------------------------------------
        var leftContainer = container.append("g").attr("id", "leftContainer");

        var scrollDiv = leftContainer.append("foreignObject").style("position", "relative").style("z-index", 99)
                                        .attr("y", 4)
                                        .attr("x", 4)
                                        .attr("width",lWidth)
                                        .attr("height",height)
                                        .append("xhtml:body")
                                        .append("div")
                                        .attr("id","scroll-div").style("overflow", "auto")
    //                                    .attr("width",lWidth)
    //                                    .attr("max-height",height)

        var scrollSVG = scrollDiv.append("svg").attr("viewBox", "0,0,"+lWidth+","+tmpHeight)

        var containerRect = scrollSVG.attr("id", "leftContainer")
                                    .append("rect").attr("x", 10).attr("y", 10).attr("height", tmpHeight - 20).attr("width", lWidth-20)
                                    .style("fill", "white").style("stroke", "purple").style("stroke-width", "5").attr("rx", 20).attr("ry", 20);

        var  graph = scrollSVG.append("g")
                                  .attr("id", "graph");


        // -----------------
        // links
        // -----------------
        var linkSpace = 2;
        var link = graph.selectAll(".link")
                        .data(json.links)
                        .enter().append("line")
                        .attr("id", "link")
                        .attr("class", "link")
                        .attr("x1",function(d,i){
                            if(nodePosY[d.source]== nodePosY[d.target]) {//link in same level
                                var cs = 0, ct = 0;//counter, of links which start in source node / target node
                                var ps,pt; //p position of this link
                                for(j= 0; j < json.links.length;j++){ 
                                    if(nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //other link is from down to up
                                        if(json.links[j].target == json.links[i].source){
                                            cs++;
                                        } 
                                        if (json.links[j].target == json.links[i].target){
                                            ct++;
                                        } 
                                    } else if(nodePosY[json.links[j].source] < nodePosY[json.links[j].target]) { //link from up to down
                                        if(json.links[j].source == json.links[i].source){
                                            cs++;
                                        } 
                                        if (json.links[j].source == json.links[i].target){
                                            ct++;
                                        }
                                        
                                    } else {//link in one level
                                        if (json.links[j].target == json.links[i].target || json.links[j].source == json.links[i].target){
                                            ct++;
                                            if(j == i) {
                                               pt = ct;
                                            }
                                        } 
                                        if (json.links[j].target == json.links[i].source || json.links[j].source == json.links[i].source){
                                            cs++;
                                            if(j == i) {
                                               ps = cs;
                                            }
                                        }
                                            
                                    }
                                
                                }
                                document.getElementById("graph").childNodes[i].remove();
                                curvedLink(json,nodePosY[d.source],(nodePosX[d.source]+ (200/(cs+1))*ps), (nodePosX[d.target]+ (200/(ct+1))*pt), d.source, d.target);
/*                                if(nodePosX[d.target] < nodePosX[d.source]){return nodePosX[d.source] - linkSpace;}//link from right to left
                                else {return nodePosX[d.source] + 200 + linkSpace} //link from left to right*/
                            } 
                            else{
                                var c = 0;//counter, of links which start in source node
                                var p; //p position of this link
                                if(nodePosY[d.source] > nodePosY[d.target]) { //this link is from down to up
                                    for(j= 0; j < json.links.length;j++){ 
                                       if(nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //other link is from down to up
                                           if(json.links[j].source == json.links[i].source){
                                               c++;
                                               if(j == i) {
                                                   p = c;
                                               }
                                            } 
                                        } else if(nodePosY[json.links[j].source] < nodePosY[json.links[j].target]) { //link from up to down
                                            if(json.links[j].target == json.links[i].source){
                                               c++;
                                            } 
                                        }
                                    }
                                } else {//this link is from up to down
                                    for(j= 0; j < json.links.length;j++){
                                        if(Math.abs(nodePosY[json.links[j].source]-nodePosY[json.links[j].target]) < 150) { //link in same level
                                            if(json.links[j].target == json.links[i].source || json.links[j].source == json.links[i].source){
                                               c++;
                                            } 
                                        } 
                                        else
                                       if(nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //other link is from down to up
                                           if(json.links[j].target == json.links[i].source){
                                               c++;
                                            } 
                                        } else if(nodePosY[json.links[j].source] < nodePosY[json.links[j].target]){ //other link is from up to down
                                            if(json.links[j].source == json.links[i].source){
                                               c++;
                                               if(j == i) {
                                                   p = c;
                                               }
                                            } 
                                        }
                                    }
                                }

                                return nodePosX[d.source] + (200/(c+1))*p;}
                            })
                        .attr("y1",function(d,i){
/*                            if(nodePosY[d.source]==nodePosY[d.target]){//link in same level
                                //DIESER TEIL KANN DANN RAUS
                                return nodePosY[d.source] + getNodeHeight(json, d.source)*0.5;
                            }                        
                            else*/ if(nodePosY[d.source] < nodePosY[d.target]){//link from up to down
                                return nodePosY[d.source] + getNodeHeight(json, d.source) + linkSpace;
                            } else{ //links from down to up
                                return nodePosY[d.source] - linkSpace;
                            }
                        })
                        .attr("x2",function(d,i){ //i index aller links
/*                            if(nodePosY[d.source]==nodePosY[d.target]){//link in same level
                                //DIESER TEIL KANN DANN RAUS
                                if(nodePosX[d.target] < nodePosX[d.source]){return nodePosX[d.target] +200 + linkSpace;} //link from right to left
                                else {return nodePosX[d.target] - linkSpace} //link from left to right
                            }
                            else{*/
                                var c = 0;//counter, of links which start in source node
                                var p,x; //p position of this link, x added pixels
                                if(nodePosY[d.source] > nodePosY[d.target]) { //this link is from down to up
                                    for(j= 0; j < json.links.length;j++){ 
                                        if(Math.abs(nodePosY[json.links[j].source]-nodePosY[json.links[j].target]) < 150) { //link in same level
                                            if(json.links[j].target == json.links[i].target || json.links[j].source == json.links[i].target){
                                               c++;
                                            } 
                                        } 
                                        else
                                       if(nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //other link is from down to up
                                           if(json.links[j].target == json.links[i].target){
                                               c++;
                                               if(j == i) {
                                                   p = c;
                                               }
                                            } 
                                        } else if(nodePosY[json.links[j].source] < nodePosY[json.links[j].target]){ //link from up to down
                                            if(json.links[j].source == json.links[i].target){
                                               c++;
                                            } 
                                        }
                                    }
                                } else {//this link is from up to down
                                    for(j= 0; j < json.links.length;j++){ 
                                       if(nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //other link is from down to up
                                           if(json.links[j].source == json.links[i].target){
                                               c++;
                                            } 
                                        } else if(nodePosY[json.links[j].source] < nodePosY[json.links[j].target]){ //other link is from up to down
                                            if(json.links[j].target == json.links[i].target){
                                               c++;
                                               if(j == i) {
                                                   p = c;
                                               }
                                            } 
                                        }
                                    }
                                }

                                return nodePosX[d.target] + (200/(c+1))*p;//}
                            })
                        .attr("y2",function(d,i){
/*                            if(nodePosY[d.source]==nodePosY[d.target]){
                                //DIESER TEIL KANN DANN RAUS
                                return nodePosY[d.target] + getNodeHeight(json, d.target)*0.5;
                            }
                            else */if(nodePosY[d.source] < nodePosY[d.target]){//link from up to down
                                return nodePosY[d.target] - linkSpace;
                            }
                            else{ //links from down to up
                                return nodePosY[d.target] + getNodeHeight(json, d.target) + linkSpace;
                            }
                        })
                        //.attr("transform", function(d,i){return "translate(100,0)"})// +getNodeHeight(json, json.nodes[d.source])+ ")"})
                        .style("marker-start",  "url(#low)").style("marker-end",  "url(#low)")
                        .attr("stroke", "lightblue")/*function(l,i) { FARBE PRO EBENE?
                            color = colors[Math.floor(Math.random()*colors.length)];
                            return color;
                        });*/
        //Arrows
                    graph.append("defs").selectAll("marker")
                        .data(["low", "high"])
                        .enter().append("marker")
                        .attr("id", function(d) { return d; })
                        .attr("viewBox", "0 -5 10 10")
                        .attr("refX", 10)//versetzt den Marker nach hinten
                        .attr("refY", 0)
                        .attr("fill", function(d,i) {if(i == 0){return "lightblue"} else{ return "#0489B1"}})
                        .attr("markerWidth", 7)
                        .attr("markerHeight", 17)
                        .attr("orient", "auto")
                        .append("path")
                        .attr("d", "M0,-5L10,0L0,5")
                        //.style("opacity", "0.6");   
        //Source Dots//marker start
                    graph.selectAll("circle").data(json.links).enter().append("circle")
                    .attr("cx", function(d,i) {return document.getElementById("graph").childNodes[i].getAttribute("x1")})
                    .attr("cy", function(d,i) {return document.getElementById("graph").childNodes[i].getAttribute("y1")})
                    .style("fill", d3.rgb("lightblue").darker()).attr("r", 5)

        // -----------------
        // Nodes
        // -----------------   

        var activeNodes = new Array(json.nodes.length);
        for (var i = 0; i < activeNodes.length; ++i) { activeNodes[i] = false; };
        var node = graph.selectAll(".node")
                          .data(json.nodes)
                        .enter().append("g")
                          .attr("class", "node")
                          .attr("id", function(d){return d.name})
                         .attr("transform", function(d,i) { return "translate(" + nodePosX[i] + "," + nodePosY[i] + ")"}) 
                         .on("click", function hN() {
                             var p = getParentsIndexByIndex(json,getIndexByName(json,this.id));
                             highlightNode(json,this.id, false, p);

                         });

        var rects = node.append("rect").attr("class", "nodeRect");
        
    
        var diagnosisColor = "#ffc266",
            therapyColor = "steelblue",
            examinationColor = "#12858e",
            symptomColor = "#FE642E";
    
        var rectAttributes = rects.attr("x", 0)
                                  .attr("y", 0)
                                  .attr("width", 200)
                                  .attr("height", function(d,i) {return getNodeHeight(json, i)})
                                  .style("fill", function(d,i) {return "white"})
                                  .style("stroke", function(d,i) {if(d.properties.type == "diagnosis") {return diagnosisColor;};
                                                                 if(d.properties.type == "therapy") {return therapyColor;};
                                                                 if(d.properties.type == "examination") {return examinationColor;};
                                                                 if(d.properties.type == "symptom") {return symptomColor;}})
                                  .style("stroke-width", 4)
                                  .attr("rx", 10)
                                  .attr("ry", 10)
                                  .on("mouseover", function () {d3.select(this).style("fill", "#EEE9E9")})
                                  .on("mouseout", function () {d3.select(this).style("fill", "white")});



        var name = node.append("text");

        var nameAttributes = name.style("fill", "purple")
                         .attr("x", 5)
                         .attr("y", 23)
                         .text(function (d) {return d.name;})
                         .attr("font-size", function(d) {return Math.min(25, 80 / this.getComputedTextLength() * 24) + "px"; });

        var stateGroup = node.append("g")
                             .attr("id", function(d) {return "stateGroup" });//+ d.name} );
    
        //RadioButtons
        var radioButtons= node.append("g")
                            .attr("id", function(d,i) {return d.name + "radioButtons"}) 

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
                    .attr("fill",function(d,i) {
            
                                return d3.rgb(eval(json.nodes[getIndexByName(json,this.parentElement.parentElement.id.substring(0,this.parentElement.parentElement.id.length-12))].properties.type + "Color")).brighter([i]);
                            })

        clickedButtons = []; // includes all ids of clicked Buttons

        //adding text to each button group, centered within the button rect
        buttonGroups.append("text")
                    .attr("id",function(d,i) { 
                            return this.parentElement.parentElement.parentElement.id + " " + i
                    } )
                    .attr("font-family","sans-serif")
                    .attr("x",function(d,i) {
                        return x0 + bWidth/2;
                    })
                    .attr("y",function(d,i) {
                        return y0+(bWidth+bSpace)*i + bWidth/2;
                    })
                    .attr("text-anchor","middle")
                    .attr("dominant-baseline","central")
                    .style("fill", function(d,i){return "purple"})
                    .text('\uf10c') //fontawesome labels
                    .on("click", function highlightButton(){
                        var p = getParentsIndexByIndex(json,getIndexByName(json,this.id.split(" ")[0]));
                        highlightNode(json,getIndexByName(json,this.id.split(" ")[0]),true,p);
                        active = false;
                        //checks if clicked button is already clicked an reverses text
                        if(clickedButtons.indexOf(this.id) != -1){
                            d3.select(document.getElementById(this.id)).text('\uf10c');
                            clickedButtons.splice(clickedButtons.indexOf(this.id),1);
                            active = false;
                        } else { // button was not clicked before
                            //checks if there is another clicked button in this node
                            for(i = 0; i < clickedButtons.length; i++){
                                if (this.parentElement.parentElement.parentElement.id == clickedButtons[i].split(" ")[0]){
                                    active = true;
                                    break;
                                }
                            }
                            //if not, reverse text of this button and push to list
                            if(active == false){
                                d3.select(document.getElementById(this.id)).text('\uf192');
                                clickedButtons.push(this.id);
                            } else { // if there already is a clicked Button in Node, change text of old and new button and push to list
                                //old button
                                for(i = 0; i < clickedButtons.length; i++){
                                    if (this.parentElement.parentElement.parentElement.id == clickedButtons[i].split(" ")[0]){
                                        d3.select(document.getElementById(clickedButtons[i])).text('\uf10c');
                                        oldButtonI = clickedButtons.indexOf(clickedButtons[i]);
                                        clickedButtons.splice(oldButtonI, 1); //removes oldButtons Id
                                        clickedButtons.push(this.id)
                                    }
                                }
                                //new button
                                d3.select(document.getElementById(this.id)).text('\uf192'); 
                            }
                        } 
                     });


        //States
        var stateText = stateGroup.append("text");

        var stateAttributes = stateText
                         .attr("font-size", "15px")
                         .attr("x", 10)
                         .attr("y", 22);

        var states = stateAttributes.selectAll("tspan")
                         .data(function (d,i) {return d.properties.states})
                         .enter()
                         .append("tspan")
                         .style("fill", function(d,i){return "purple"})
                         .text(function(d) { return d.name; })
                         .attr("dy", 20)
                         .attr("x", 25);

        /*var hightlightState = stateAttributes.selectAll("rect")
                             .data(function (d,i) {return d.properties.states})
                            .enter()
                            .append("rect")
                            .style("stroke")
                            .on("click", function(){alert(true)})*/
        //Pie Chart
    d3.json(id + "Inf.json",  function(error, inf) { // "http://10.200.1.75:8012/bn/inference?name=" + id,
        inf.nodes.forEach(function(d,i,a) {
            var w = 60;
            var h = 60;
            var r = Math.min(w, h) / 2; //anpassen getNodeHeight 

            var svg = d3.select(document.getElementById(json.nodes[i].name))
              .append('svg')
              .attr("x",125)
              .attr("y",4)      //anpassen getNodeHeight
              .attr('width', w)
              .attr('height', h)
              .append('g')
              .attr('transform', 'translate(' + (w / 2) +
                ',' + (h / 2) + ')');

            var arc = d3.svg.arc()
              .innerRadius(0)
              .outerRadius(r);

            var pie = d3.layout.pie()
              .value(function(d0) {return d0;})
              .sort(null);
            
            var beliefArray = [];
            for (var key in d.properties.beliefs) {
                beliefArray.push(d.properties.beliefs[key]);
            }
            
            var path = svg.selectAll('path')
              .data(pie(beliefArray))
              .enter()
              .append('path')
              .attr('d', arc)
              .attr('fill', function(d1,i1) {
                return d3.rgb(eval(json.nodes[i].properties.type + "Color")).brighter([i1]);
              });
        })
    })

        //Probabilities
    /*    var probabilityText = stateGroup.append("text");

        var probabilityAttributes = probabilityText
                         .style("fill", "purple")
                         .attr("font-size", "15px")
                         .attr("x", 5)
                         .attr("y", 22);

                         //.attr("transform", "translate(0,20)")

        var probabilities = probabilityAttributes.selectAll("tspan")
                         .data(function (d,i) {return d.properties.cpt.probabilities.slice(-(d.properties.states.length - d.properties.cpt.probabilities.length))})
                         .enter()
                         .append("tspan")
                         .text(function(d) { return d.probability; })
                         .attr("dy", 20)
                         .attr("x", 190)
                         .attr("text-anchor", "end");*/

    
// -----------------
// Reload Button
// -----------------
var reloadButton = leftContainer.append("g").attr("class","button").style("position", "fixed").style("z-index", 999)
                        .style("cursor","pointer").attr("transform", "translate("+ (lWidth - 80) + "," + (height - 80) + ")")

var reloadRect = reloadButton.append("rect")
            .attr("id", "reload")
            .attr("class","buttonRect")
            .attr("width",50)
            .attr("height",50)
            .attr("x", 25)
            .attr("y",32)
            .attr("rx",5) 
            .attr("ry",5)
            .attr("fill","#FE642E")

var reloadText = reloadButton.append("text")
            .attr("class","buttonText")
            .attr("font-family","sans-serif")
            .attr("x",50)
            .attr("y",32 + 25)
            .attr("text-anchor","middle")
            .attr("dominant-baseline","central")
            .attr("fill","white")
            .attr("font-size", "20px")  
            .text("\uf021") 
    
// ------------------------------------------
// Funktionen
// ------------------------------------------

function getNodeHeight(json,nodeInd){
    if(json.nodes[nodeInd].properties.states.length==1){
        return (json.nodes[nodeInd].properties.states.length+1) * 20 + 27
    }
    return json.nodes[nodeInd].properties.states.length * 20 + 27
}
    
function computeLayout(json, turn = false) {
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
    
   var allArrays;
    if(turn){
        allArrays = [symptomNodes, diagnosisNodes, therapyNodes] // gibt die Reihenfolge der Ebenen an
    } else {
        allArrays = [therapyNodes, diagnosisNodes, symptomNodes]
    }
    
 //WENN ES WAAGERECHTE EDGES GIBT, DANN FÜGE DIE BEIDEN NODES NACH VORNE IN DER LISTE?
    
    var yCounter = 0;
    var rows = new Array(allArrays.length)
    
    allArrays.forEach(function(a,noOfArray){
        if(a.length/4 == 0) {
            rows[noOfArray] = 0;
        } else
        if(a.length/4 < 1.1) {
            yCounter = yCounter + 1;
            rows[noOfArray] = 1;
        } else if(a.length/4 < 2) {
            yCounter = yCounter + 2;
            rows[noOfArray] = 2;
        } else if(a.length/4 < 2.5) {
            yCounter = yCounter + 3;
            rows[noOfArray] = 3;
        } else { //array ueber 9 wird in 5er gruppen unterteilt(3+2) und rest wird angehängt
            var r = 0;
            if((a.length%5) + 5 < 5) {
                r = 1;
            } else if ((a.length%5) + 5 < 8){
                r = 2;
            } else if ((a.length%5) + 5 < 10) {
                r = 3;
            }
            yCounter = yCounter + (Math.floor(a.length/5)-1)* 2 + r;
            rows[noOfArray] = (Math.floor(a.length/5)-1)* 2 + r;
        }
        
    })
    
    var xPos = new Array(json.nodes.length), yPos = new Array(json.nodes.length);
    var YStart = 50, //was ist wenn nur eine Gruppe existiert
        YSpace = 160,  //states berücksichtigen 
        groupSpace = Math.max((window.innerHeight - yCounter*YSpace - YStart*2 - 20)/(allArrays.length-1),100),
        tmpYPos = YStart;
    var XStart = 50,
        tmpXPos = XStart;
    
    allArrays.forEach(function(a,noOfArray){
    
        a.forEach(function(nodeInd, arrayInd,a){
            
            if(rows[noOfArray] == 1) {
                yPos[nodeInd] = tmpYPos;
                
                if(a.length == 1){
                    xPos[nodeInd] = 500;
                } else if(arrayInd == 0) { //DYN: gerade : startgerade + i * spacegerade, ungerade vice versa
                    xPos[nodeInd] = 50;
                }
                if(a.length == 2){
                    if(arrayInd == 1) { //DYN: gerade : startgerade + i * spacegerade, ungerade vice versa
                        xPos[nodeInd] = 800;
                    } else if(arrayInd == 0) { //DYN: gerade : startgerade + i * spacegerade, ungerade vice versa
                        xPos[nodeInd] = 200;
                    }
                }
                else if(a.length == 3){
                    if(arrayInd == 1) { 
                        xPos[nodeInd] = 500;
                    } else if(arrayInd == 2) {
                        xPos[nodeInd] = 950;
                    }
                }
                else if(a.length == 4){
                    if(arrayInd == 1) { 
                        xPos[nodeInd] = 350;
                    } else if(arrayInd == 2) { 
                        xPos[nodeInd] = 650;
                    } else if(arrayInd == 3) {
                        xPos[nodeInd] = 950;
                    }
                }
                
            } else 
            if(a.length == 5 || rows[noOfArray] > 3) { //5er Gruppen

                yPos[nodeInd] = tmpYPos + Math.floor(arrayInd*2/5)*YSpace;
                
                if(arrayInd%5 == 0) {
                    xPos[nodeInd] = 50;
                } else if(arrayInd%5 == 1) {
                    xPos[nodeInd] = 500;
                } else if(arrayInd%5 == 2) {
                    xPos[nodeInd] = 950;
                } else if(arrayInd%5 == 3) {
                    xPos[nodeInd] = 200;
                } else if(arrayInd%5 == 4) {
                    xPos[nodeInd] = 800;
                }
                
            } else if(a.length == 6 || (a.length == 7)) {
                if(arrayInd < 4) {
                    yPos[nodeInd] = tmpYPos;
                } else {
                    yPos[nodeInd] = tmpYPos + YSpace;
                }
                
                if(arrayInd == 0) { //DYN: gerade : startgerade + i * spacegerade, ungerade vice versa
                    xPos[nodeInd] = 50;
                } else if(arrayInd == 1) {
                    xPos[nodeInd] = 350;
                } else if(arrayInd == 2) {
                    xPos[nodeInd] = 650;
                } else if(arrayInd == 3) {
                    xPos[nodeInd] = 950;
                } else if(arrayInd == 4) {
                    xPos[nodeInd] = 200; 
                } else if(arrayInd == 5) {
                    if(a.length == 6) { 
                        xPos[nodeInd] = 800;
                    } else if(a.length == 7) {
                        xPos[nodeInd] = 350;
                    }
                } else if(arrayInd == 6) {
                        xPos[nodeInd] = 800;
                }
            } else if(a.length == 8) {
                if(arrayInd < 3) {
                    yPos[nodeInd] = tmpYPos;
                } else if(arrayInd < 5){
                    yPos[nodeInd] = tmpYPos + YSpace;
                } else {
                    yPos[nodeInd] = tmpYPos + 2*YSpace;
                }
                
                if(arrayInd == 0) { //DYN: gerade : startgerade + i * spacegerade, ungerade vice versa
                    xPos[nodeInd] = 50;
                } else if(arrayInd == 1) {
                    xPos[nodeInd] = 500;
                } else if(arrayInd == 2) {
                    xPos[nodeInd] = 950;
                } else if(arrayInd == 3) {
                    xPos[nodeInd] = 200;
                } else if(arrayInd == 4) {
                    xPos[nodeInd] = 800; 
                } else if(arrayInd == 5) {
                    xPos[nodeInd] = 50;
                } else if(arrayInd == 6) {
                    xPos[nodeInd] = 500;
                } else if(arrayInd == 7) {
                    xPos[nodeInd] = 950;
                }

            } else if(a.length == 9) {
                if(arrayInd < 4) {
                    yPos[nodeInd] = tmpYPos;
                } else if(arrayInd < 7){
                    yPos[nodeInd] = tmpYPos + YSpace;
                } else {
                    yPos[nodeInd] = tmpYPos + 2*YSpace;
                }
                
                if(arrayInd == 0) { //DYN: gerade : startgerade + i * spacegerade, ungerade vice versa
                    xPos[nodeInd] = 50;
                } else if(arrayInd == 1) {
                    xPos[nodeInd] = 300;
                } else if(arrayInd == 2) {
                    xPos[nodeInd] = 650;
                } else if(arrayInd == 3) {
                    xPos[nodeInd] = 950;
                } else if(arrayInd == 4) {
                    xPos[nodeInd] = 200; 
                } else if(arrayInd == 5) {
                    xPos[nodeInd] = 500;
                } else if(arrayInd == 6) {
                    xPos[nodeInd] = 800;
                } else if(arrayInd == 7) {
                    xPos[nodeInd] = 200;
                } else if(arrayInd == 8) {
                    xPos[nodeInd] = 950;
                }
            }
            else {
                throw error;
            }
        })
        
        tmpYPos = tmpYPos + rows[noOfArray]*YSpace + groupSpace;
    })

    return [xPos, yPos, Math.max(window.innerHeight-20,tmpYPos-YSpace)]; //ANPASSEN für states der letzten zeile
}

function getIndexByName(json,name) {
    for (var i = 0; i < json.nodes.length; i++) {
        if(json.nodes[i].name == name){
            return i;
        }
    } return -1;
}
    
function getParentsIndexByIndex(json,indexOfNode){
    var name = json.nodes[indexOfNode].name;
    var parents = new Array(0);
    for (i = 0; i < json.links.length; i++) {
       if (json.links[i].target == indexOfNode){

            parents.push(json.links[i].source);
        }
    }
    return parents;
}
    
function calculateTableContent(json,IndexOfNode, id){
        
    var parents = getParentsIndexByIndex(json,IndexOfNode);
    parents.push(IndexOfNode)
    var parentSize = parents.length -2;
    
    // parents in columns (Spalten)
    var columns = new Array(0);
    parents.forEach(function(element,Id, array){
        columns.push(json.nodes[element].name)
    })
    // states of this node in last columns (this node is last element of parents)
    json.nodes.forEach(function(d,i){
        if(d.name == columns[columns.length-1]){
            if(d.properties.states.length == 0){ //node has no states (examinstions?)
                columns.split(columns.length-1,1);
            } else { //node has states
                columns[columns.length-1] = d.properties.states[0].name;
                for(i=0; i<d.properties.states.length-1; i++){
                    columns.push(d.properties.states[i+1].name);
                }
            }
        }
    })

    var rows = [];
    
    var countRows = 1;
    for (p = 0; p < parents.length-1; p++){
        countRows *= json.nodes[parents[p]].properties.states.length;
    }
    
    // statenames 
    // #columns - #states of this node
    var stateRow = new Array(columns.length - json.nodes[parents[parents.length-1]].properties.states.length)
    var probRow = new Array(json.nodes[parents[parents.length-1]].properties.states.length)
    for (j=0; j<countRows; j++){
        for(i=0; i<(columns.length - json.nodes[parents[parents.length-1]].properties.states.length); i++){
            stateRow[i] = json.nodes[parents[parents.length-1]].properties.cpt.probabilities[j*2+i].conditions[i].name;         
        }
        for (h=0; h<json.nodes[parents[parents.length-1]].properties.states.length; h++){
            probRow[h] = json.nodes[parents[parents.length-1]].properties.cpt.probabilities[j*2+h].probability;
        }
        rows.push(stateRow.concat(probRow))
    }
    
    return tabulate(rows, columns, parentSize, id)
}

function tabulate(rows, columns, parentSize, id) {
    
// -----------------
// Table Group
// -----------------
    var tableGroup = leftContainer.append("g").attr("id","tableGroup")
    
    var tableRect = tableGroup.append("rect").attr("width", rWidth-25).style("fill", "white").style("stroke", "purple").style("stroke-width", "5").attr("rx", 15).attr("ry", 15).attr("x", 10 + lWidth).attr("y", menuHeight + 25).style("position", "fixed").style("z-index", 40); // ANPASSEN WENN TABLE NICHT OBEN
    var tablePartHeight = height -menuHeight - 40;
    tableRect.attr("height", tablePartHeight)
    var tableHeading = tableGroup.append("text").style("position", "fixed").style("z-index", 40)
                         .style("fill", "purple")
                         .attr("x", lWidth + rWidth / 2)
                         .attr("y", 180)
                         .attr("font-size", "25px")            
                         .attr("text-anchor","middle").text(id);;

    
    var x0= 25; //x offset
    var y0= 220; //y offset

    var table = tableGroup.append("foreignObject")
                                .attr("y", y0)
                                .attr("x", lWidth + x0)
                                .attr("width",590)// widthRight)
                                .attr("height",200)
                                .append("xhtml:body")
                                .append("div")
                                .attr("id","table-div")
                                .style("max-width", "590px")
                                .style("max-height", "200px")
                                .style("overflow-y","auto")
                                .style("overflow-x","auto")
                                //.style("display", "table")
                                .append("table")//.style("position", "fixed").style("z-index", 40)
                                .attr("width", 580)
                                .attr("heigth", "20%")
                                .attr("id", "table")
                                //.attr("border", );


    ths = d3.select("table")
        .append("tr")
        .attr("class", "head")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .html(function (d) {return d;});

    //thick line between parents and states
    ths.style("border-right", function(d,i){
        if(i == parentSize){return "solid purple";}}) 

    d3.select("table")
        .selectAll("tr.data")
        .data(rows).enter()
        .append("tr")
        .attr("class", "data");

    tds = d3.selectAll("tr")
        .selectAll("td")
        .data(function(d) {return d3.entries(d)})
        .enter()
        .append("td")
        .html(function (d) {return d.value});

    //thick line between parents and states
    tds.style("border-right", function(d,i){
        if(i == parentSize){return "solid purple";}})

    return table;
}
    
function highlightNode(json,id, ac=false, parents){

    //yTemp += (tablePartHeight + gSpace)
    for (i=0; i<json.nodes.length; i++){
          if (id == json.nodes[i].name){
/*              if (activeNodes[i] && ac){//if this node was highlighted before
                     d3.select(document.getElementById(id).firstChild).style("stroke-width", 4);
                     headingDiscription.text(" ");
                     tableHeading.text(" ");
                     rightContainer.selectAll("foreignObject").remove();
                     discriptionBackground.attr("fill","white");
                     activeNodes[i] = false;
                     break;
                }*/
                if (!activeNodes[i]){//if this node was not highlighted before
                     for (var j = 0; j < activeNodes.length; ++j) { 
                         if (activeNodes[j]){ //if other node was highlighted before unhighlight it
                             //rect
                             d3.select(document.getElementById(json.nodes[j].name).firstChild).style("stroke-width", 4);
                             //table
                             tableGroup.remove();
                             //links
                             var otherParents = [1,0,2]; //ANPASSEN
                             for(k = 0; k <otherParents.length; k++){
                                for (l = 0; l < json.links.length; l++) {
                                     if(otherParents[k] == json.links[l].source) {
                                         d3.select(document.getElementById("graph").childNodes[l]).attr("stroke", "lightblue").style("marker-end",  "url(#low)");

                                     }
                                }
                             }
                         }
                         activeNodes[j] = false; 
                     };
                     //highlight this node
                     //links
/*                     for(k = 0; k < parents.length; k++){
                        for (l = 0; l < json.links.length; l++) {
                             if(parents[k] == json.links[l].source) {
                                 d3.select(document.getElementById("graph").childNodes[l]).attr("stroke", "#0489B1").style("marker-end",  "url(#high)");

                             }
                        }
                     }*/
                     //nodeRect
                     d3.select(document.getElementById(id).childNodes[0]).style("stroke-width", 6);
                     activeNodes[i] = true;
                     //table
                     var tabl = calculateTableContent(json, i, id);
                     break;

                 }  
              }
          }
         
}
    
function curvedLink(json,yPos, sX, tX, sourceId, targetId) {
/*    var c1,cs = 0,ct = 0;
    if(yPos <=  height/2) { //kante dreht nach oben
        c1 = - 50;
    } else { *///kante dreht IMMER nach unten
        c1 = 60;
        cs = getNodeHeight(json,sourceId); 
        ct = getNodeHeight(json,targetId);
    //} //FALL yPos zu klein fehlt
    
    var lineData = [ { "x": sX,   "y": yPos +cs},  { "x": Math.min(sX,tX) + (Math.abs(sX-tX) / 2),  "y": yPos + c1 + Math.max(cs,ct)},
               { "x": tX,  "y": yPos+ ct}];
    
    var lineFunction = d3.svg.line()
                            .x(function(d) { return d.x; })
                            .y(function(d) { return d.y; })
                            .interpolate("basis");
    
    graph.append("path").attr("stroke-width", 4).attr("d",lineFunction(lineData)).attr("fill", "white").style("stroke", "lightblue").style("opacity", 0.5).style("marker-end",  "url(#low)")
    graph.append("circle")
                    .attr("cx", function(d,i) {return sX})
                    .attr("cy", function(d,i) {return yPos + cs})
                    .style("fill", d3.rgb("lightblue").darker()).attr("r", 6)
}
})
}