
    
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
var tableGroup = rightContainer.append("g").attr("id","tableGroup")

rightContainer.selectAll("g").append("rect").attr("width", rWidth-25).style("fill", "white").style("stroke", "purple").style("stroke-width", "5").attr("rx", 15).attr("ry", 15);
        
var x0= 10; //x offset
var y0= 10; //y offset
var yTemp = y0;
var gSpace= 10; //space between groups
    
// ----------------------------------------------------------
// Menu Buttons
// ----------------------------------------------------------

var menuHeight = 90;
//button width and height
var bWidth= 140; //button width
var bHeight= 50; //button height
var bSpace= 10; //space between buttons
    
d3.select(document.getElementById("menuGroup").firstChild).attr("height", menuHeight).attr("x", x0).attr("y", yTemp)
yTemp += (menuHeight + gSpace +10)//2xstroke-width

var MenuButtons= menuGroup.append("g")
                    .attr("id","MenuButtons") 

//fontawesome button labels
var labels= ['\uf08e laden', '\uf0c7 speichern', "\uf059 Information", '\uf009 Legende',];

var buttonGroups= MenuButtons.selectAll("g.button")
                        .data(labels)
                        .enter()
                        .append("g")
                        .attr("class","button")
                        .style("cursor","pointer")

//adding a rect to each button group
//sidenote: rx and ry give the rects rounded corners
buttonGroups.append("rect")
            .attr("id", function(d,i) {return d.split(" ")[1]})
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
                return x0+13 + (bWidth+bSpace)*i + bWidth/2;
            })
            .attr("y",y0+22+bHeight/2)
            .attr("text-anchor","middle")
            .attr("dominant-baseline","central")
            .attr("fill","white")
            .attr("font-size", "20px")  
            .text(function(d) {return d;}) 
// -----------------
// Information
// -----------------

d3.select(document.getElementById("Information"))
    .on("click", function () {
        var infoGroup = rightContainer.append("g").attr("id","infoGroup").style("position","fixed")

        d3.text("Info.txt",function(error,text) {
            
            var infoText = infoGroup.append("foreignObject").style("position","fixed")
                                        .attr("y", y0+22 + 20)
                                        .attr("x", x0+13 - 150 + 20)
                                        .attr("width",400)// widthRight)
                                        .attr("height",219)
                                        .append("xhtml:body").style("position","fixed")
                                        .append("div")
                                        .style("position","fixed")
                                        .append("text").html(text).attr("id","info-div")
                                        .attr("font-size", 30)
                                        .style("fill", "purple")
                                        .style("position","fixed")
                                        .attr("x", lWidth+ x0+13 - 150 + 10)
                                        .attr("y", y0+22 + 10)
                                        .attr("dy", ".35em");
            
            var bBox = document.getElementById("info-div").getBoundingClientRect().height;
            
            var infoRect = infoGroup.append("rect").attr("id", "infoRect")
                    .attr("x", x0+13 - 150).attr("y", y0+22)
                    .attr("width", 440).attr("height",bBox + 40)
                    .attr("rx",5).attr("ry",5)
                    .style("fill", "white").style("stroke","orange");
            d3.select("body").on("click", function() {infoGroup.remove()})
        })
        
    })


// -----------------
// Legende
// -----------------
var legendTypes = ["Therapie","Test","Diagnose","Symptom"]

d3.select(document.getElementById("Legende"))
    .on("click", function () {
        var legendGroup = rightContainer.append("g").attr("id","legendGroup")
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
})
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

d3.select(document.getElementById("laden"))
    .on("click", function () {
        var ladenGroup = rightContainer.append("g").attr("id","ladenGroup")
    
        d3.json("allBNs.json",function(error,allBNs) {
            
                    
            var ladenRect = ladenGroup.append("rect").style("position","absolute").style("z-index", 50)
                    .attr("x", x0+13 - 610).attr("y", y0+22)
                    .attr("width", 600).attr("height", allBNs.length * 67 + 100)
                    .attr("rx",5).attr("ry",5)
                    .style("fill", "white").style("stroke","orange");
            
            var netGroup = ladenGroup.append("g")
            var netRects = netGroup.selectAll("rect").data(allBNs).enter().append("rect")
                                    .attr("x",-565)
                                    .attr("y", function(d,i) { return 70 + i * 75;})
                                    .attr("width", 560)
                                    .attr("height", 67)
                                    .style("fill", "white").style("stroke", "orange").style("rx", 20).style("ry", 20)
                                    .style("stroke-width",2)
                                    .on("mouseover", function() {
                                        d3.select(this).style("stroke-width",5)
                                    })
                                    .on("mouseout", function() {
                                        d3.select(this).style("stroke-width",2)
                                    })
                                    .on("click",function(d,i) {
                                        bayesNet(allBNs[i].graphDBId);
                                    });
            var netTexts = netGroup.selectAll("text").data(allBNs).enter().append("text")
                                    .text(function(d) {return d.graphName})
                                    .attr("x", -555)
                                    .attr("y", function(d,i) { return 120 + i * 75;})
                                    .style("font-size",20).style("fill", "purple");
            
            d3.select("body").on("click", function() {ladenGroup.remove()})
                                    
        })
    })

