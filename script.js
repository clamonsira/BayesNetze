
    
    var lWidth = window.innerWidth * 0.65 - 5,
        height = window.innerHeight - 5;
    var rWidth = window.innerWidth * 0.35 - 5;
    
    var container = d3.select("body").append("svg") //one big svg because the button click overlaps
                                .attr("width", window.innerWidth -5)
                                .attr("height", height) // wenn tmpHeight > height scroll ein bauen
                                .attr("id", "container");

// ------------------------------------------
// RECHTE SEITE
// ------------------------------------------
var rightContainer = container.append("g")
                                    .attr("id", "rightContainer")
                                    .attr("transform", "translate(" + lWidth +","+ 0 +")");

var menuGroup = rightContainer.append("g").attr("id","menuGroup")


var menuRect = menuGroup.append("rect").attr("width", rWidth-25).style("fill", "white").style("stroke", "purple").style("stroke-width", "5")//.attr("rx", 15).attr("ry", 15);
        
var x0= 10; //x offset
var y0= 10; //y offset
var yTemp = y0;
var gSpace= 10; //space between groups
    
// ----------------------------------------------------------
// Menu Buttons
// ----------------------------------------------------------

var menuHeight = 90;
var bHeight= 50; //button height
var bSpace= 10; //space between buttons
    
menuRect.attr("height", menuHeight).attr("x", x0).attr("y", yTemp)
yTemp += (menuHeight + gSpace +10)//2xstroke-width

var menuButtons= menuGroup.append("g")
                    .attr("id","menuButtons") 

//fontawesome button labels
var labels= ['list,Bayes Net', "pencil,define Types", "info,Information"];

var bWidth= (rWidth - 75)/labels.length; //button width

var buttonGroups= menuButtons.selectAll("g.button")
                        .data(labels)
                        .enter()
                        .append("g")
                        .attr("class","button")
                        .style("cursor","pointer")
            .attr("id", function(d,i) {return d.split(",")[1]})

//adding a rect to each button group
//sidenote: rx and ry give the rects rounded corners
buttonGroups.append("rect")
            .attr("class","buttonRect")
            .attr("width",bWidth)
            .attr("height",bHeight)
            .attr("x",function(d,i) {
                return (x0+13)+(bWidth+bSpace)*i;
            })
            .attr("y",y0+22)
            .attr("rx",5) 
            .attr("ry",5)
            .attr("fill","#FE642E")

//adding text to each button group, centered within the button rect
buttonGroups.append("text")
            .attr("class","buttonText")
            .attr("font-family","sans-serif")
            .attr("x",function(d,i) {
                return x0+13 + (bWidth+bSpace)*i +40;
            })
            .attr("y",y0+22+bHeight/2)
            .attr("text-anchor","begin")
            .attr("dominant-baseline","central")
            .attr("fill","white")
            .attr("font-size", "20px")  
            .text(function(d) {return d.split(",")[1];})

buttonGroups.append("svg:foreignObject")
    .attr("width", 200)
    .attr("height", 200)
    .attr("y", (y0+22+17) + "px")
    .attr("x", function(d,i) {return x0+13 + (bWidth+bSpace)*i + 20})
    .append("xhtml:i")
            .attr("class", function(d) {return "fa fa-" + d.split(",")[0] +" fa-inverse fa-1.5x";})

/*buttonGroups.append("svg:foreignObject")
    .attr("width", 200)
    .attr("height", 200)
    .attr("y", "-7px")
    .attr("x", "-7px")
  .append("xhtml:span")
    .attr("class", "fa fa-spinner fa-pulse fa-10x");
// -----------------*/
// Information
// -----------------

d3.select(document.getElementById("Information"))
    .on("click", function () {
        var infoGroup = rightContainer.append("g").attr("id","infoGroup").style("position","fixed").attr("transform", "translate(" + (150/2 +80) +","+ 100 +")").style("position", "fixed").style("z-index", 4000);

        d3.text("Info.txt",function(error,text) {
            
            var infoText = infoGroup.append("foreignObject").style("position","fixed")
                                        .attr("y", y0+22 + 20)
                                        .attr("x", x0+13 - 150 + 20)
                                        .attr("width",rWidth - 50)
                                        .attr("height",219)
                                        .append("xhtml:body").style("position","fixed")
                                        .append("div")
                                        .style("position","fixed")
                                        .append("text").html(text).attr("id","info-div")
                                        .attr("width",rWidth - 50)
                                        .attr("font-size", "12px")
                                        .style("fill", "purple")
                                        .attr("x", lWidth+ x0+13 - 150 + 10 + 150)
                                        .attr("y", y0+22 + 10)
                                        .attr("dy", ".35em");
            
            var bBox = document.getElementById("info-div").getBoundingClientRect().height;
            
            var infoRect = infoGroup.append("rect").attr("id", "infoRect") //ANPASSEN InsertBefore
                    .attr("x", x0+13 - 150).attr("y", y0+22)
                    .attr("width", rWidth - 50).attr("height",bBox + 40)
                    .attr("rx",5).attr("ry",5)
                    .style("fill", "white").style("stroke","orange");
            infoGroup.append("i").attr("class", "fa fa-camera-retro")
            
            d3.select("body").on("click", function() {infoGroup.remove()})
        })
        
    })



/*// -----------------
// Legende
// -----------------
var legendTypes = ["Therapie","Test","Diagnose","Symptom"]

d3.select(document.getElementById("Legende"))
    .on("click", function () {
        var legendGroup = rightContainer.append("g").attr("id","legendGroup").attr("transform", "translate(" + (150/2 +80) +","+ 100 +")").style("position", "fixed").style("z-index", 4000);
    
        var legendRect = legendGroup.append("rect")
                                .attr("id","legendRect")
                                .attr("x", x0+13).attr("y", y0+22)
                                .attr("width", 440).attr("height", 219)
                                .attr("rx",5).attr("ry",5)
                                .style("fill", "white").style("stroke","orange")
        var legendRects = legendGroup.append("g").selectAll("rect").data(legendTypes).enter()
                            .append("rect")
                                .attr("id",function(d,i) {return "legendRect" + i})
                                .attr("x", function(d,i) {return x0+13+15 + (i%2)* 210})
                                .attr("y", function(d,i) {return y0+22+15 + (i<2)* 100})
                                .attr("width", 200).attr("height", 87)
                                .attr("rx",5).attr("ry",5)
                                .style("fill", "white")
                                .style("stroke-width", 5)
                                .style("stroke",function(d,i){if(i == 0) {return "#ffc266";};
                                                             if(i == 1) {return "steelblue";};
                                                             if(i == 2) {return "#12858e";};
                                                             if(i == 3) {return "#FE642E";}})
        var legendText = legendGroup.selectAll("text").data(legendTypes).enter().append("text").text(function(d){return d})
                                        .attr("x", function(d,i) {return x0+13+15 + (i%2)* 210 + 20})
                                .attr("y", function(d,i) {return y0+22+15 + (i<2)* 100 + 30})
                                        .style("fill",function(d,i){if(i == 0) {return "#ffc266";};
                                                             if(i == 1) {return "steelblue";};
                                                             if(i == 2) {return "#12858e";};
                                                             if(i == 3) {return "#FE642E";}})
                                        .attr("font-size", 22)
        
        //d3.select("body").on("click", function() {legendGroup.remove()}) ANPASSEn
    })

    .on("mouseout", function () {
                            d3.select(document.getElementById("legendGroup")).remove()
})*/
// -----------------
// Legende
// -----------------
/*d3.select(document.getElementById("legendeGroup").firstChild).attr("height", 120).attr("x", x0 -20).attr("y", yTemp+5)

/*var headingLegende = legendeGroup.append("text")
                     .style("fill", "steelblue")            
                     .attr("x", x0)
                     .attr("y", yTemp+gSpace +35)
                     .attr("font-size", "23px")
                     .text("Legende");

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
                     .attr("dominant-baseline","central")*/
// -----------------
// Laden
// -----------------

d3.select(document.getElementById("Bayes Net"))
    .on("click", function () {    
        var ladenGroup = rightContainer.append("g").attr("id","ladenGroup").attr("transform", "translate(0,"+ 100 +")")//" + (450 + 150/2 +80) +
    
        d3.json("http://52.59.228.237:8016/graphs/all-bns" ,function(error,allBNs) {//"http://52.59.228.237:8016/graphs/all-bns"
            
            var scrollDivLaden = ladenGroup.append("foreignObject")//.style("position", "relative").style("z-index", 99)
                                        .attr("y", 25)
                                        .attr("x", 25)
                                        .attr("width",rWidth-40)
                                        .attr("height",height - menuHeight - 50+"px") 
                                        .append("xhtml:body")
                                        .append("div")
                                        .attr("id","scroll-div-laden").style("overflow", "auto")

            var scrollSVGLaden = scrollDivLaden.append("svg").attr("viewBox", (x0+13-610)+"," + (y0+22) +","+(rWidth -40) +","+(allBNs.length * 67 + 100))

            var ladenRect = scrollSVGLaden.append("rect")
                    .attr("x", x0+13 - 610).attr("y", y0+22)
                    .attr("width", rWidth - 50).attr("height", allBNs.length * 67 + 100)
                    .attr("rx",5).attr("ry",5)
                    .style("fill", "white").style("stroke","orange").style("stroke-width",2);
            
            var netGroup = scrollSVGLaden.selectAll("g").data(allBNs).enter().append("g")                                    
                                    .on("mouseover", function() {
                                        d3.select(this.firstChild).style("stroke-width",5)
                                    })
                                    .on("mouseout", function() {
                                        d3.select(this.firstChild).style("stroke-width",2)
                                    })
                                    .on("click",function(d,i) {
                                        if (document.getElementById("leftContainer") != null) {d3.select(document.getElementById("leftContainer")).remove()};
                                        bayesNet(allBNs[i].graphDBId);
                                    });
            
            var netRects = netGroup.append("rect")
                                    .attr("x",-565)
                                    .attr("y", function(d,i) { return 70 + i * 75;})
                                    .attr("width", rWidth - 100 )
                                    .attr("height", 67)
                                    .style("fill", "white").style("stroke", "orange").style("rx", 20).style("ry", 20)
                                    .style("stroke-width",2)

            var netNames = netGroup.append("text")
                                    .text(function(d) {return d.graphName})
                                    .attr("x", -555)
                                    .attr("y", function(d,i) { return 120 + i * 75;})
                                    .style("font-size",20).style("fill", "purple");
            
/*            var N = [];
            var E = [];
            allBNs.forEach(function(d,i) {
                d3.json("http://52.59.228.237:8012/bn?name=" + d.graphDBId , function(error, j) {
                        if (error) throw error;                
                   N.push(j.nodes.length);
                   E.push(j.links.length);
                })
            })
            
            var nodeNo = netGroup.append("text") 
                                    .text(function(d,i) {
   
                                        return "# Nodes: " + N[N.length-1-i] + " # Edges: " + E[N.lenght-1-i]; 
                                    })
                                    .attr("y", function(d,i) { return 120 + i * 75;})
                                    .attr("x", -555 +rWidth - 120)
                                    .style("font-size",12).style("fill", "purple").attr("text-anchor","end");

            */
            d3.select("body").on("click", function() {ladenGroup.remove()})
        })
    })

// -----------------
// Typen
// -----------------
