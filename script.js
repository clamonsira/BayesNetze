// ------------------------------------------
// Positionen (Vergleichswerte - wird nicht genutzt)
// ------------------------------------------

var statePosX = [50, 350, 650, 200, 500, 50, 350, 650, 50, 350, 650];
var statePosY = [670, 670, 670, 870, 870, 300, 300, 300, 70, 70, 70]; 

d3.json("Dgraph.json", function(error, json) { //"http://10.200.1.75:8012/bn?name=bncancer1,http://10.200.1.75:8012/bn?name=bncancer1,http://10.200.1.75:8012/bn?name=bnlung1"
    if (error) throw error;
    // ------------------------------------------
    // Bayes Netz
    // ------------------------------------------

    var width = window.innerWidth * 0.65 - 5,
        height = window.innerHeight - 5;

    var leftContainer = d3.select("body").append("svg")
                                        .attr("width", width)
                                        .attr("height", height);
                                        leftContainer.attr("id", "leftContainer").append("rect").attr("x", 10).attr("y", 10).attr("height", height-20).attr("width", width-20).style("fill", "white").style("stroke", "purple").style("stroke-width", "5").attr("rx", 20).attr("ry", 20);
                                        leftContainer.append("g")
                                        .attr("id", "graph");
    
    // -----------------
    // Compute Layout
    // -----------------
    var nodePosX, nodePosY;
    var positions = computeLayout();
    nodePosX = positions[0];
    nodePosY = positions[1];
    
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
        positions = computeLayout(true);
        nodePosX = positions[0];
        nodePosY = positions[1];
    }
    
    // -----------------
    // links
    // -----------------
    var linkSpace = 7;
    var link = leftContainer.selectAll(".link")
                    .data(json.links)
                    .enter().append("line")
                    .attr("id", "link")
                    .attr("class", "link")
                    .attr("x1",function(d,i){
                        if(nodePosY[d.source]==nodePosY[d.target]){//link in same level
                            if(nodePosX[d.target] < nodePosX[d.source]){return nodePosX[d.source] - linkSpace;}//link from right to left
                            else {return nodePosX[d.source] + 200 + linkSpace} //link from left to right
                        } 
                        else{
                            var c = 0;//counter, of links which start in source node
                            var p,x; //p position of this link, x added pixels
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
                                           if(j == i) {
                                               p = c;
                                           }
                                        } 
                                    }
                                }
                            } else {//this link is from up to down
                                for(j= 0; j < json.links.length;j++){ 
                                   if(nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //other link is from down to up
                                       if(json.links[j].target == json.links[i].source){
                                           c++;
                                           if(j == i) {
                                               p = c;
                                           }
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
                            
                            //DYNAMISCH?
                            if(c == 1){x = 100}
                            else if(c == 2){if(p==1){x=50}else if(p==2){x=150}}
                            else if(c == 3){if(p==1){x=50}else if(p==2){x=100}else if(p==3){x=150}}
                            else if(c == 4){if(p==1){x=30}else if(p==2){x=75}else if(p==3){x=125}else if(p==4){x=170}}
                            else if(c == 5){if(p==1){x=5}else if(p==2){x=50}else if(p==3){x=100}else if(p==4){x=150}else if(p==5){x=195}}
                            return nodePosX[d.source] + x;}
                        })
                    .attr("y1",function(d,i){
                        if(nodePosY[d.source]==nodePosY[d.target]){//link in same level
                            return nodePosY[d.source] + getNodeHeight(d.source)*0.5;
                        }                        
                        else if(nodePosY[d.source] < nodePosY[d.target]){//link from up to down
                            return nodePosY[d.source] + getNodeHeight(d.source) + linkSpace;
                        } else{ //links from down to up
                            return nodePosY[d.source] - linkSpace;
                        }
                    })
                    .attr("x2",function(d,i){ //i index aller links
                        if(nodePosY[d.source]==nodePosY[d.target]){//link in same level
                            if(nodePosX[d.target] < nodePosX[d.source]){return nodePosX[d.target] +200 + linkSpace;} //link from right to left
                            else {return nodePosX[d.target] - linkSpace} //link from left to right
                        }
                        else{
                            var c = 0;//counter, of links which start in source node
                            var p,x; //p position of this link, x added pixels
                            if(nodePosY[d.source] > nodePosY[d.target]) { //this link is from down to up
                                for(j= 0; j < json.links.length;j++){ 
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
                                           if(j == i) {
                                               p = c;
                                           }
                                        } 
                                    }
                                }
                            } else {//this link is from up to down
                                for(j= 0; j < json.links.length;j++){ 
                                   if(nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //other link is from down to up
                                       if(json.links[j].source == json.links[i].target){
                                           c++;
                                           if(j == i) {
                                               p = c;
                                           }
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
                            if(i == 3) {alert("p,c "+p+c)}
                            
                            //DYNAMISCH?
                            if(c == 1){x = 100}
                            else if(c == 2){if(p==1){x=50}else if(p==2){x=150}}
                            else if(c == 3){if(p==1){x=50}else if(p==2){x=100}else if(p==3){x=150}}
                            else if(c == 4){if(p==1){x=30}else if(p==2){x=75}else if(p==3){x=125}else if(p==4){x=170}}
                            else if(c == 5){if(p==1){x=5}else if(p==2){x=50}else if(p==3){x=100}else if(p==4){x=150}else if(p==5){x=195}}
                            return nodePosX[d.target] + x;}
                        })
                    .attr("y2",function(d,i){
                        if(nodePosY[d.source]==nodePosY[d.target]){
                            return nodePosY[d.target] + getNodeHeight(d.target)*0.5;
                        }
                        else if(nodePosY[d.source] < nodePosY[d.target]){//link from up to down
                            return nodePosY[d.target] - linkSpace;
                        }
                        else{ //links from down to up
                            return nodePosY[d.target] + getNodeHeight(d.target) + linkSpace;
                        }
                    })
                    //.attr("transform", function(d,i){return "translate(100,0)"})// +getNodeHeight(json.nodes[d.source])+ ")"})
                    .style("marker-end",  "url(#low)")
                    .attr("stroke", "lightblue")/*function(l,i) { FARBE PRO EBENE?
                        color = colors[Math.floor(Math.random()*colors.length)];
                        return color;
                    });*/
    //Arrows
                leftContainer.append("defs").selectAll("marker")
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
                     .on("click", function hN() {
                         
                         highlightNode(this.id);
                         
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
                              .style("stroke-width", 4)
                              .attr("rx", 10)
                              .attr("ry", 10);


    var name = node.append("text");

    var nameAttributes = name.style("fill", "purple")
                     .attr("x", 5)
                     .attr("y", 23)
                     .text(function (d) {return d.name;})
                     .attr("font-size", function(d) {return Math.min(25, 80 / this.getComputedTextLength() * 24) + "px"; });
    
    var stateGroup = node.append("g")
                         .attr("id", function(d) {return "stateGroup" });//+ d.name} );
        
    
    
    var color = d3.scale.category10();
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
                .style("fill", function(d,i){return color(i)})
                .text('\uf10c') //fontawesome labels
                .on("click", function highlightButton(){
        //Wieso werden alle Nodes unhighlighted wenn ein Button ausgewählt wird??? Der Node soll highlighted sein wenn ein Button ausgewählt wird, ist auch activeNodes == true!
                    highlightNode(this.id.split(" ")[0],true);
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
                     .style("fill", function(d,i){return color(i)})
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
    json.nodes.forEach(function(d,i,a) {
        var w =60;
        var h = 60;
        var r = Math.min(w, h) / 2; //anpassen getNodeHeight 

        var svg = d3.select(document.getElementById(json.nodes[i].name))
          .append('svg')
          .attr("x",125)
          .attr("y", 4)      //anpassen getNodeHeight
          .attr('width', w)
          .attr('height', h)
          .append('g')
          .attr('transform', 'translate(' + (w / 2) +
            ',' + (h / 2) + ')');

        var arc = d3.svg.arc()
          .innerRadius(0)
          .outerRadius(r);

        var pie = d3.layout.pie()
          .value(function(d0) {return d0.probability; })
          .sort(null);

        var path = svg.selectAll('path')
          .data(pie(d.properties.cpt.probabilities.slice(-(d.properties.states.length - d.properties.cpt.probabilities.length)))) //nimmt im moment die ersten Tabellenwerte
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d1,i1) {
            return color(i1);
          });
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
    
    
// ------------------------------------------
// RECHTE SEITE
// ------------------------------------------
    
var widthRight = window.innerWidth * 0.35 - 5;

var rightContainer = d3.select("body").append("svg")
                                    .attr("width", widthRight)
                                    .attr("height", height)
                                    .attr("id", "rightContainer");

var menuGroup = rightContainer.append("g").attr("id","menuGroup")
var tableGroup = rightContainer.append("g").attr("id","tableGroup")
var legendeGroup = rightContainer.append("g").attr("id","legendeGroup")

rightContainer.selectAll("g").append("rect").attr("x", 20).attr("y", function(d,i){return i *200}).attr("height", 300).attr("width", widthRight-25).style("fill", "white").style("stroke", "purple").style("stroke-width", "5").attr("rx", 15).attr("ry", 15);
        
var x0= 22; //x offset
var y0= 70; //y offset
var yTemp = y0 -60;
var gSpace= 10; //space between groups
    
// -----------------
// Menu Buttons
// -----------------

//button width and height
var bWidth= 140; //button width
var bHeight= 40; //button height
var bSpace= 10; //space between buttons
    
d3.select(document.getElementById("menuGroup").firstChild).attr("height", 90).attr("x", x0-20).attr("y", yTemp)
yTemp += (90 + gSpace)

var MenuButtons= menuGroup.append("g")
                    .attr("id","MenuButtons") 

//fontawesome button labels
var labels= ['\uf021 aktualisieren', '\uf055 erweitern','\uf08e laden','\uf0c7 speichern'];

var buttonGroups= MenuButtons.selectAll("g.button")
                        .data(labels)
                        .enter()
                        .append("g")
                        .attr("class","button")
                        .style("cursor","pointer")

//adding a rect to each button group
//sidenote: rx and ry give the rects rounded corners
buttonGroups.append("rect")
            .attr("class","buttonRect")
            .attr("width",bWidth)
            .attr("height",bHeight)
            .attr("x",function(d,i) {
                return x0-5+(bWidth+bSpace)*i;
            })
            .attr("y",y0-30)
            .attr("rx",5) 
            .attr("ry",5)
            .attr("fill","#FE642E")

//adding text to each button group, centered within the button rect
buttonGroups.append("text")
            .attr("class","buttonText")
            .attr("font-family","sans-serif")
            .attr("x",function(d,i) {
                return x0-5 + (bWidth+bSpace)*i + bWidth/2;
            })
            .attr("y",(y0-30)+bHeight/2)
            .attr("text-anchor","middle")
            .attr("dominant-baseline","central")
            .attr("fill","white")
            .text(function(d) {return d;}) 

// -----------------
// Heading of Table
// -----------------

d3.select(document.getElementById("tableGroup").firstChild).attr("height", 730).attr("x", x0 -20).attr("y", yTemp)
yTemp += (730 + gSpace)

var tableHeading = tableGroup.append("text")
                     .style("fill", "steelblue")
                     .attr("x", widthRight / 2)
                     .attr("y", 180)
                     .attr("font-size", "25px")            
                     .attr("text-anchor","middle");
    

// -----------------
// Discription
// -----------------
var headingDiscription = tableGroup.append("text")
                     .style("fill", "steelblue")            
                     .attr("x", x0)
                     .attr("font-size", "20px");
var discriptionBackground = tableGroup.append("rect")
                                        .attr("width",590);


// -----------------
// Legende
// -----------------
d3.select(document.getElementById("legendeGroup").firstChild).attr("height", 120).attr("x", x0 -20).attr("y", yTemp+5)

/*var headingLegende = legendeGroup.append("text")
                     .style("fill", "steelblue")            
                     .attr("x", x0)
                     .attr("y", yTemp+gSpace +35)
                     .attr("font-size", "23px")
                     .text("Legende");*/

var rectLegende = legendeGroup
                .selectAll("rect")
                .data([0,0,1,2,3,4]).enter()
                .append("rect")
                .attr("x", function(d,i) {if(i==5) {return x0 + d*130 }
                                                        else {return x0 + d*120}})
                .attr("y", yTemp+gSpace+30)
                .attr("height", 60)
                .attr("width", function(d,i){if(i==5) {return 60} else{return 110}})
                .style("fill", function(d,i){if(i==5) {return "#FE642E" }
                                            else{return "white"}})
                .style("stroke", function(d,i) {if(i==1) {return "steelblue"}
                                                else if(i==2) {return "#12858e"}
                                                else if(i==3) {return "#ffc266"}
                                                else if(i==4) {return "#FE642E"}})
                .style("stroke-width", "3")
                .attr("rx", function(d,i){if(i==5) {return 60} else{return 9}}).attr("ry",function(d,i){if(i==5) {return 60} else{return 9}});

var text = [0,"Therapie","Test","Diagnose","Symptom","\uf059"]

var textLegende = legendeGroup.selectAll("text").data(text).enter()
                    .append("text")
                    .text(function(d,i) {return d})
                     .style("fill", "purple")            
                     .attr("x", function(d,i) {{if(i==5) {return x0 +55+ (i-1)*120 +15} else {
                                                return x0 +55+ (i-1)*120}}})
                     .attr("y", yTemp+gSpace+30+30)
                     .attr("font-size", function(d,i){if(i==5) {return "50px"} else {return "18px"}})
                     .attr("text-anchor","middle")
                     .attr("dominant-baseline","central")

// ------------------------------------------
// Funktionen
// ------------------------------------------

function getNodeHeight(nodeIndex){
    if(json.nodes[nodeIndex].properties.states.length==1){
        return (json.nodes[nodeIndex].properties.states.length+1) * 20 + 27
    }
    return json.nodes[nodeIndex].properties.states.length * 20 + 27
}
    
function computeLayout(turn = false) {
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
    if(!turn){
        allArrays = [symptomNodes, diagnosisNodes, therapyNodes] // gibt die Reihenfolge der Ebenen an
    } else {
        allArrays = [therapyNodes, diagnosisNodes, symptomNodes]
    }
    
 //WENN ES WAAGERECHTE EDGES GIBT, DANN FÜGE DIE BEIDEN NODES NACH VORNE IN DER LISTE
    
    var xPos = new Array(json.nodes.length), yPos = new Array(json.nodes.length);
    var YSpace = 250, tmpYPos = 0, YStart = 70;
    var XSpace = 300, tmpXPos = 0, XStart = 50;
    
    allArrays.forEach(function(a,noOfArray){
        
        if (a.length > 8) {
            throw error;
        }
        else {
            tmpYPos = YStart + noOfArray * YSpace
            tmpXPos = XStart 

            a.forEach(function(nodeI, noOfIndex,a){
                // -----------------
                // yPos pro Array
                // ----------------- 
                
                //dyn: yPos[nodeI] = tmpYPos; // + 200 *Reihe array intern
                
                if(noOfIndex < 4) {
                    if (noOfArray == 0) {
                        yPos[nodeI] = 750;
                    }
                    if (noOfArray == 1) {
                        yPos[nodeI] = 400;
                    }
                    if (noOfArray == 2) {
                        yPos[nodeI] = 70;
                    }
                }
                else {
                    if (noOfArray == 0) {
                        yPos[nodeI] = 890;
                    }
                    if (noOfArray == 1) {
                        yPos[nodeI] = 550;
                    }
                    if (noOfArray == 2) {
                        yPos[nodeI] = 220;
                    }
                }
            // -----------------
            // xPos
            // ----------------- 
                //dyn: xPos[nodeI] = tmpXPos + (noOfIndex % 4)*XSpace;
                
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
    
function calculateTableContent(indexOfNode){
        
    var parents = getParentsIndex(indexOfNode);
    parents.push(indexOfNode)
    var parentSize = parents.length -2;
    
    // parents in columns (Spalten)
    var columns = new Array(0);
    parents.forEach(function(element,index, array){
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
    
    return tabulate(rows, columns, parentSize)
}

    function tabulate(rows, columns, parentSize) {
        var x0= 15; //x offset
        var y0= 210; //y offset

        var table = rightContainer.append("foreignObject")
                                    .attr("y", y0)
                                    .attr("x", x0)
                                    .attr("width",590)// widthRight)
                                    .attr("height",200)
                                    .append("xhtml:body")
                                    .append("div")
                                    .attr("id","table-div")
                                    .style("max-width", "590px")
                                    .style("max-height", "200px")
                                    .style("overflow-y","auto")
                                    .style("overflow-x","hidden")
                                    //.style("display", "table")
                                    .append("table")
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
            if(i == parentSize){return "solid orange";}}) 

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
            if(i == parentSize){return "solid orange";}})

       // var thread = table.append("thread").attr("width", 400)

        //var tbody = table.append("tbody")

        //tablelength = 500
        //var cellwidth = 500/columns.length;

                                            /*    var row = table.selectAll("tr")
                                                            .data(rows.concat([columns]))
                                                            .enter()
                                                            .append("tr")*/


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

    /*                                                //funktioniert aber keine unterscheidung zw td und th
                                                    var cells = row.selectAll("th")
                                                                    .data(function(d,i) {if(i==0) {return columns;}
                                                                                         else {return rows[i-1];}})
                                                                    .enter()
                                                                    .append("th")
                                                                    //.attr("overflow", "hidden")
                                                                    .text(function(cell) { return cell; })
                                                                   // .attr("width", cellwidth);*/



        var discriptionYPos = document.getElementById("table-div").getBoundingClientRect().height;

        headingDiscription.attr("y", discriptionYPos + y0 + 30)
        //headingDiscription.attr("y", 440)


        discriptionBackground.attr("height",100) // anpassen
                                                    .attr("x",x0)
                                                    .attr("y", discriptionYPos + y0 + 50)
                                                    .attr("rx",5) 
                                                    .attr("ry",5)
                                                    .attr("fill", "white")

        return table;
    }
    
    function highlightNode(id,ac=false){
        for (i=0; i<json.nodes.length; i++){
              if (id == json.nodes[i].name){
                  if (activeNodes[i] && !ac){
                     d3.select(document.getElementById(id).firstChild).style("stroke-width", 4);
                     headingDiscription.text(" ");
                     tableHeading.text(" ");
                     rightContainer.selectAll("foreignObject").remove();
                     discriptionBackground.attr("fill","white");
                     activeNodes[i] = false;
                     break;
                  }
                 if (!activeNodes[i]){
                    //wenn schon ein anderer activ war
                     for (var j = 0; j < activeNodes.length; ++j) { 
                         if (activeNodes[j]){
                             d3.select(document.getElementById(json.nodes[j].name).firstChild).style("stroke-width", 4);
                             rightContainer.selectAll("foreignObject").remove();
                         }
                         activeNodes[j] = false; 
                     };
                     d3.select(document.getElementById(id).childNodes[0]).style("stroke-width", 7);
                     tableHeading.text(id);
                     activeNodes[i] = true;
                     //createTable
                     var tabl = calculateTableContent(i);
                     headingDiscription.text("Beschreibung");
                     discriptionBackground.attr("fill","lightblue");
                   // parents = getParentsIndex(i);//links HIER MIT FUNKTIONIERT ES NICHT
                   // alert("p: "+parents)
/*                    for(k = 0; k < parents.length; k++){
                        for (l = 0; l < json.links.length; l++) {
                             if(parents[k] == json.links[l].source) {
                                 d3.select(document.getElementById("graph").childNodes[l]).attr("stroke", "#0489B1").style("marker-end",  "url(#high)");
                                
                             }
                        }
                    }*/
                     break;

                 }  
              }
          }
        alert(activeNodes)//wieso wird diese Zeile nicht ausgeführt wenn man einen Node makiert?
}
        
        //AUFGERÄUMT FEHLER?
/*        for (i=0; i<json.nodes.length; i++){
              if (id == json.nodes[i].name){
                  if (activeNodes[i] && !ac){
                      //Node
                     d3.select(document.getElementById(id).firstChild).style("stroke-width", 2);
                     activeNodes[i] = false;
                     tableHeading.text(" ");
                     //Table weg
                     rightContainer.selectAll("foreignObject").remove();
                      //Discription
                      headingDiscription.text(" ");
                     discriptionBackground.attr("fill","white");
                     break;
                  }
                 if (!activeNodes[i]){
                    //wenn schon ein anderer activ war
                     for (var j = 0; j < activeNodes.length; ++j) { 
                         if (activeNodes[j]){
                             d3.select(document.getElementById(json.nodes[j].name).firstChild).style("stroke-width", 2);
                             rightContainer.selectAll("foreignObject").remove();
                             //Discriptiion weg
                             //Pie weg
                         }
                         activeNodes[j] = false; 
                     };
                     //Node
                     d3.select(document.getElementById(id).childNodes[0]).style("stroke-width", 5);
                     activeNodes[i] = true;  
                     //Links
                   // parents = getParentsIndex(i);//links HIER MIT FUNKTIONIERT ES NICHT
                   // alert("p: "+parents)
/*                    for(k = 0; k < parents.length; k++){
                        for (l = 0; l < json.links.length; l++) {
                             if(parents[k] == json.links[l].source) {
                                 d3.select(document.getElementById("graph").childNodes[l]).attr("stroke", "#0489B1").style("marker-end",  "url(#high)");
                                
                             }
                        }
                    }*/
                     //Table
                    /* tableHeading.text(id);
                     var tabl = calculateTableContent(i);
                     //Discription
                     headingDiscription.text("Beschreibung");
                     discriptionBackground.attr("fill","lightblue");
                     //chart
                     break;

                 }  
              }
          }}*/
        //alert(activeNodes)//wieso wird diese Zeile nicht ausgeführt wenn man einen Node makiert?
    
/*         for (i=0; i<json.nodes.length; i++){
             if (id == json.nodes[i].name){
                 parents = getParentsIndex(i);//links
                 
                 if (activeNodes[i]){// && !ac){
                    //unhighlight this node
                    d3.select(document.getElementById(id).firstChild).style("stroke-width", 2); //rect HARD CODE
                    headingDiscription.text(" ");
                    tableHeading.text(" ");
                    rightContainer.selectAll("foreignObject").remove(); //removes table
                    discriptionBackground.attr("fill","white");
                    //links
                    json.links.forEach(function(d,ind,a){
                        d3.select(document.getElementById("graph").childNodes[ind]).attr("stroke", "lightblue").style("marker-end",  "url(#low)");
                    })
                    activeNodes[i] = false;
                    break;
                 }
                if (!activeNodes[i]){
                    //highlight this node
                        //if there was any other node highlighted, it becomes unhighlighted
                    for (var j = 0; j < activeNodes.length; ++j) { 
                        if (activeNodes[j]){
                            d3.select(document.getElementById(json.nodes[j].name).firstChild).style("stroke-width", 2); //rect HARD CODE
                            rightContainer.selectAll("foreignObject").remove();
                            //links
                            json.links.forEach(function(d,i,a){
                            d3.select(document.getElementById("graph").childNodes[i]).attr("stroke", "lightblue").style("marker-end",  "url(#low)")});
                            activeNodes[j] = false;
                        } 
                    };
                    
                    //this node gets highlighted
                    d3.select(document.getElementById(id).childNodes[0]).style("stroke-width", 5);
                    tableHeading.text(id);                   
                    headingDiscription.text("Beschreibung");
                    discriptionBackground.attr("fill","lightblue");
                    //createTable
                    var tabl = calculateTableContent(i);
                    //links
                    for(k = 0; k < parents.length; k++){
                        for (l = 0; l < json.links.length; l++) {
                             if(parents[k] == json.links[l].source) {
                                 d3.select(document.getElementById("graph").childNodes[l]).attr("stroke", "#0489B1").style("marker-end",  "url(#high)");
                                 break;
                             }
                        }
                    }
                    activeNodes[i] = true; 
                    break;

                }  
             }
         }
alert(activeNodes)
    }*/

})
