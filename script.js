var lWidth = window.innerWidth * 0.65 - 5,
    height = window.innerHeight - 5;
var rWidth = window.innerWidth * 0.35 - 5;

var container = d3.select("body").append("svg")
    .attr("width", window.innerWidth - 5)
    .attr("height", height)
    .attr("id", "container");

// ------------------------------------------
// RECHTE SEITE
// ------------------------------------------
var rightContainer = container.append("g")
    .attr("id", "rightContainer")
    .attr("transform", "translate(" + lWidth + "," + 0 + ")");

var menuGroup = rightContainer.append("g").attr("id", "menuGroup")


var menuRect = menuGroup.append("rect").attr("width", rWidth - 25).style("fill", "white").style("stroke", "purple").style("stroke-width", "5")

var x0 = 10; 
var y0 = 10; 
var yTemp = y0;
var gSpace = 10; 

// ----------------------------------------------------------
// Menu Buttons
// ----------------------------------------------------------

var menuHeight = 90;
var bHeight = 50; 
var bSpace = 10; 

menuRect.attr("height", menuHeight).attr("x", x0).attr("y", yTemp);
yTemp += (menuHeight + gSpace + 10);
var menuButtons = menuGroup.append("g")
    .attr("id", "menuButtons");

//fontawesome button labels
var labels = ['list,Bayes Net', "info,Information"]; 

var bWidth = (rWidth - 75) / labels.length; 

var buttonGroups = menuButtons.selectAll("g.button")
    .data(labels)
    .enter()
    .append("g")
    .attr("class", "button")
    .style("cursor", "pointer")
    .attr("id", function(d, i) {
        return d.split(",")[1]
    });


buttonGroups.append("rect")
    .attr("class", "buttonRect")
    .attr("width", bWidth)
    .attr("height", bHeight)
    .attr("x", function(d, i) {
        return (x0 + 13) + (bWidth + bSpace) * i;
    })
    .attr("y", y0 + 22)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", "#FE642E");

buttonGroups.append("text")
    .attr("class", "buttonText")
    .attr("font-family", "sans-serif")
    .attr("x", function(d, i) {
        return x0 + 13 + (bWidth + bSpace) * i + 40;
    })
    .attr("y", y0 + 22 + bHeight / 2)
    .attr("text-anchor", "begin")
    .attr("dominant-baseline", "central")
    .attr("fill", "white")
    .attr("font-size", "20px")
    .text(function(d) {
        return d.split(",")[1];
    })

buttonGroups.append("svg:foreignObject")
    .attr("width", 20)
    .attr("height", 20)
    .attr("y", (y0 + 22 + 17) + "px")
    .attr("x", function(d, i) {
        return x0 + 13 + (bWidth + bSpace) * i + 20
    })
    .append("xhtml:i")
    .attr("class", function(d) {
        return "fa fa-" + d.split(",")[0] + " fa-inverse fa-1.5x";
    })

// -----------------
// Information
// -----------------

d3.select(document.getElementById("Information"))
    .on("click", function() {
        var infoGroup = rightContainer.append("g").attr("id", "infoGroup").style("position", "fixed").attr("transform", "translate(" + (150 / 2 + 80) + "," + 100 + ")").style("position", "fixed").style("z-index", 4000);

        d3.text("Info.txt", function(error, text) {


            var infoText = infoGroup.append("foreignObject").style("position", "fixed")
                .attr("y", y0 + 22 + 20).attr("id", "info-div")
                .attr("x", x0 + 13 - 150 + 20)
                .attr("width", rWidth - 100)
                .attr("height", height)
                .append("xhtml:body").style("position", "fixed")
                .append("div").style("width", rWidth - 80)
                .append("text").html(text).attr("id", "info-text")
                .style("font-size", "19px")

            var bBox = document.getElementById("info-text").getBoundingClientRect().height;

            var infoRect = infoGroup.append("rect").attr("id", "infoRect")
                .attr("x", x0 + 13 - 150).attr("y", y0 + 22)
                .attr("width", rWidth - 50)
                .attr("height", bBox + 15)
                .attr("rx", 5).attr("ry", 5)
                .style("fill", "white").style("stroke", "orange");

            document.getElementById("infoGroup").insertBefore(infoRect.node(), document.getElementById("info-div"));

            //schließt sich bei nächstem klick 
            d3.select("body").on("click", function() {
                infoGroup.remove()
            })
        })

    })


// -----------------
// Laden
// -----------------

d3.select(document.getElementById("Bayes Net"))
    .on("click", function() {
        var ladenGroup = rightContainer.append("g").attr("id", "ladenGroup").attr("transform", "translate(0," + 100 + ")") 

        d3.json("http://10.200.1.75:8016/graphs/all-bns", function(error, allBNs) { 

            var scrollDivLaden = ladenGroup.append("foreignObject")
                .attr("y", 25)
                .attr("x", 25)
                .attr("width", rWidth - 40)
                .attr("height", height - menuHeight - 50 + "px")
                .append("xhtml:body")
                .append("div")
                .attr("id", "scroll-div-laden").style("overflow", "auto")

            var scrollSVGLaden = scrollDivLaden.append("svg").attr("viewBox", (x0 + 13 - 610) + "," + (y0 + 22) + "," + (rWidth - 40) + "," + (allBNs.length * 67 + 100))

            var ladenRect = scrollSVGLaden.append("rect")
                .attr("x", x0 + 13 - 610).attr("y", y0 + 22)
                .attr("width", rWidth - 50).attr("height", allBNs.length * 67 + 100)
                .attr("rx", 5).attr("ry", 5)
                .style("fill", "white").style("stroke", "#ffc266").style("stroke-width", 2);

            var netGroup = scrollSVGLaden.selectAll("g").data(allBNs).enter().append("g")
                .on("mouseover", function() {
                    d3.select(this.firstChild).style("stroke-width", 5)
                })
                .on("mouseout", function() {
                    d3.select(this.firstChild).style("stroke-width", 2)
                })
                .on("click", function(d, i) {
                    if (document.getElementById("leftContainer") != null) {
                        d3.select(document.getElementById("leftContainer")).remove()
                    };
                    bayesNet(allBNs[i].graphDBId);
                });

            var netRects = netGroup.append("rect")
                .attr("x", -565)
                .attr("y", function(d, i) {
                    return 70 + i * 75;
                })
                .attr("width", rWidth - 100)
                .attr("height", 67)
                .style("fill", "white").style("stroke", "orange").style("rx", 20).style("ry", 20)
                .style("stroke-width", 2)

            var netNames = netGroup.append("text")
                .text(function(d) {
                    return d.graphName
                })
                .attr("x", -555)
                .attr("y", function(d, i) {
                    return 120 + i * 75;
                })
                .style("font-size", 20).style("fill", "purple");

            d3.select("body").on("click", function() {
                ladenGroup.remove()
            })
        })
    })