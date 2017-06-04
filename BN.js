function bayesNet(id) {
    // ------------------------------------------
    // Farben
    // ------------------------------------------
    var highlightColor = "#6FFF0D",
        contentColor = "purple",
        contentColorLight = "#575757";

    var diagnosisColor = "#FE642E",
        therapyColor = "#118b54",
        examinationColor = "steelblue",
        symptomColor = "#ffc266";
    
    // ------------------------------------------
    // Laden-Animation
    // ------------------------------------------
    var spinner = container.append("svg:foreignObject")
        .attr("width", 2000)
        .attr("height", 2000)
        .attr("y", window.innerHeight * 0.5 - 100 + "px")
        .attr("x", window.innerWidth * 0.5 - 100 + "px");
    spinner.append("xhtml:span").style("fill", "purple")
        .attr("class", "fa fa-spinner fa-pulse fa-5x");
    
    // ------------------------------------------
    // Lädt das Netz 
    // ------------------------------------------
    setTimeout(function() { 
        d3.json("http://10.200.1.75:8012/bn?name=" + id,
            function(error, json) {
                if (error) throw error;
                
                spinner.remove();

                // -----------------
                // Berechne Layout
                // -----------------
                var nodePosX, nodePosY;
                var positions = computeLayout(json);
                nodePosX = positions[0];
                nodePosY = positions[1];
                tmpHeight = positions[2];


                // ------------------------------------------
                // Baue Bayes'sches Netz
                // ------------------------------------------
                var leftContainer = container.append("g").attr("id", "leftContainer");
                document.getElementById("container").insertBefore(document.getElementById("leftContainer"), document.getElementById("rightContainer"));

                var scrollDiv = leftContainer.append("foreignObject") 
                    .attr("y", 4)
                    .attr("x", 4)
                    .attr("width", lWidth)
                    .attr("height", height)
                    .append("xhtml:body")
                    .append("div")
                    .attr("id", "scroll-div").style("overflow", "auto");

                var scrollSVG = scrollDiv.append("svg").attr("viewBox", "0,0," + lWidth + "," + tmpHeight);

                var containerRect = scrollSVG.attr("id", "leftContainer")
                    .append("rect").attr("x", 6).attr("y", 6).attr("height", tmpHeight - 10).attr("width", lWidth - 20)
                    .style("fill", "white").style("stroke", contentColor).style("stroke-width", "5");

                var graph = scrollSVG.append("g")
                    .attr("id", "graph");

                // -----------------
                // Kanten
                // -----------------
                var linkSpace = 2; //Platz zwischen Kantenende und Knoten
                var link = graph.selectAll(".link")
                    .data(json.links)
                    .enter().append("line")
                    .attr("id", "link")
                    .attr("x1", function(d, i) {
                        if (nodePosY[d.source] == nodePosY[d.target]) { //Kante in gleicher Ebene
                            var cs = 0, //zählt wie viele Kanten in source ankommen
                                ct = 0; //zählt wie viele Kanten in target ankommen
                            var ps, pt; //Position bzw Index von der betrachteten Kante
                            for (j = 0; j < json.links.length; j++) {
                                if (nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //andere Kante führt von unten nach oben
                                    if (json.links[j].target == json.links[i].source) {
                                        cs++;
                                    }
                                    if (json.links[j].target == json.links[i].target) {
                                        ct++;
                                    }
                                } else if (nodePosY[json.links[j].source] < nodePosY[json.links[j].target]) { //andere Kante führt von oben nach unten
                                    if (json.links[j].source == json.links[i].source) {
                                        cs++;
                                    }
                                    if (json.links[j].source == json.links[i].target) {
                                        ct++;
                                    }

                                } else { //Kante in gleicher Ebene
                                    if (json.links[j].target == json.links[i].target || json.links[j].source == json.links[i].target) {
                                        ct++;
                                        if (j == i) {
                                            pt = ct;
                                        }
                                    }
                                    if (json.links[j].target == json.links[i].source || json.links[j].source == json.links[i].source) {
                                        cs++;
                                        if (j == i) {
                                            ps = cs;
                                        }
                                    }

                                }

                            }

                            curvedLink(json, nodePosY[d.source], (nodePosX[d.source] + (200 / (cs + 1)) * ps), (nodePosX[d.target] + (200 / (ct + 1)) * pt), d.source, d.target, i);

                            document.getElementById("graph").childNodes[i + 1].remove(); // diese Kante wird gelöscht
                            return 1; 
                        } else {
                            var c = 0; //zählt Kanten, die in source losgehen
                            var p; //Position von der betrachteten Kante
                            if (nodePosY[d.source] > nodePosY[d.target]) { //diese Kante geht von unten nach oben
                                for (j = 0; j < json.links.length; j++) {
                                    if (nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //andere Kante geht von unten nach oben
                                        if (json.links[j].source == json.links[i].source) {
                                            c++;
                                            if (j == i) {
                                                p = c;
                                            }
                                        }
                                    } else if (nodePosY[json.links[j].source] < nodePosY[json.links[j].target]) { //andere Kante geht von oben nach unten
                                        if (json.links[j].target == json.links[i].source) {
                                            c++;
                                        }
                                    }
                                }
                            } else { //diese Kante geht von oben nach unten
                                for (j = 0; j < json.links.length; j++) {
                                    if (nodePosY[json.links[j].source] == nodePosY[json.links[j].target]) { //andere Kante in gleicher Ebene
                                        if (json.links[j].target == json.links[i].source || json.links[j].source == json.links[i].source) {
                                            c++;
                                        }
                                    } else
                                    if (nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //andere Kante geht von unten nach oben
                                        if (json.links[j].target == json.links[i].source) {
                                            c++;
                                        }
                                    } else if (nodePosY[json.links[j].source] < nodePosY[json.links[j].target]) { //andere Kante geht von oben nach unten
                                        if (json.links[j].source == json.links[i].source) {
                                            c++;
                                            if (j == i) {
                                                p = c;
                                            }
                                        }
                                    }
                                }
                            }

                            return nodePosX[d.source] + (200 / (c + 1)) * p;
                        }
                    })
                    .attr("y1", function(d, i) {
                        if (nodePosY[d.source] < nodePosY[d.target]) { //Kante geht von oben nach unten
                            return nodePosY[d.source] + getNodeHeight(json, d.source) + linkSpace;
                        } else { //Kante geht von unten nach oben
                            return nodePosY[d.source] - linkSpace;
                        }
                    })
                    .attr("x2", function(d, i) { // i alle Kanten
                        if (nodePosY[d.source] == nodePosY[d.target]) { //Kante in gleicher Ebene
                            return 1; // diese Kante wurde gelöscht
                        } else {
                            var c = 0; //zählt Kanten die in source starten
                            var p, x; //Position der Kante, x addierte Pixel
                            if (nodePosY[d.source] > nodePosY[d.target]) { //diese Kante geht von unten nach oben
                                for (j = 0; j < json.links.length; j++) {
                                    if (nodePosY[json.links[j].source] == nodePosY[json.links[j].target]) { //andere Kante in gleicher Ebene
                                        if (json.links[j].target == json.links[i].target || json.links[j].source == json.links[i].target) {
                                            c++;
                                        }
                                    } else
                                    if (nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //andere Kante geht von unten nach oben
                                        if (json.links[j].target == json.links[i].target) {
                                            c++;
                                            if (j == i) {
                                                p = c;
                                            }
                                        }
                                    } else if (nodePosY[json.links[j].source] < nodePosY[json.links[j].target]) { //andere Kante geht von oben nach unten
                                        if (json.links[j].source == json.links[i].target) {
                                            c++;
                                        }
                                    }
                                }
                            } else { //diese Kante geht von oben nach unten
                                for (j = 0; j < json.links.length; j++) {
                                    if (nodePosY[json.links[j].source] > nodePosY[json.links[j].target]) { //andere Kante geht von unten nach oben
                                        if (json.links[j].source == json.links[i].target) {
                                            c++;
                                        }
                                    } else if (nodePosY[json.links[j].source] < nodePosY[json.links[j].target]) { //andere Kante geht von  oben nach unten
                                        if (json.links[j].target == json.links[i].target) {
                                            c++;
                                            if (j == i) {
                                                p = c;
                                            }
                                        }
                                    }
                                }
                            }

                            return nodePosX[d.target] + (200 / (c + 1)) * p;
                        }

                    })
                    .attr("y2", function(d, i) {
                        if (nodePosY[d.source] < nodePosY[d.target]) { //Kante geht von oben nach unten
                            return nodePosY[d.target] - linkSpace;
                        } else { //Kante geht von unten nach oben
                            return nodePosY[d.target] + getNodeHeight(json, d.target) + linkSpace;
                        }
                    })
                    //setzt Anfangsmarker
                    .style("marker-start", "url(#lowDot)").style("marker-end", "url(#lowArrow)")
                    .attr("stroke", "lightblue")
                
                // -----------------
                // Marker
                // -----------------
                var marker = graph.append("defs").selectAll("marker")
                    .data(["lowArrow", "highArrow", "lowDot", "highDot"])
                    .enter().append("marker")
                    .attr("id", function(d) {
                        return d;
                    })

                //Target
                d3.select("#lowArrow").attr("refX", 10) //versetzt den Marker nach hinten
                    .attr("refY", 6)
                    .attr("markerWidth", 13)
                    .attr("markerHeight", 13)
                    .attr("orient", "auto").attr("fill", "lightblue")
                    .append("path")
                    .attr("d", "M2,2L2,11L10,6L2,2")
                d3.select("#highArrow").attr("refX", 9) 
                    .attr("refY", 6)
                    .attr("markerWidth", 13)
                    .attr("markerHeight", 13)
                    .attr("orient", "auto")
                    .attr("fill", "steelblue")
                    .append("path")
                    .attr("d", "M2,2L2,11L10,6L2,2")
            
                //Source
                d3.select("#lowDot").attr("refX", 5)
                    .attr("refY", 5)
                    .attr("markerWidth", 8)
                    .attr("markerHeight", 8)
                    .append("circle")
                    .attr("cx", 5)
                    .attr("cy", 5)
                    .attr("fill", d3.rgb("lightblue").darker()).attr("r", 1.75)
                d3.select("#highDot").attr("refX", 5)
                    .attr("refY", 5)
                    .attr("markerWidth", 8)
                    .attr("markerHeight", 8)
                    .append("circle")
                    .attr("cx", 5)
                    .attr("cy", 5)
                    .attr("fill", d3.rgb("steelblue").darker()).attr("r", 1.75)

                // -----------------
                // Knoten
                // -----------------   
                var activeNodes = new Array(json.nodes.length);
                for (var i = 0; i < activeNodes.length; ++i) {
                    activeNodes[i] = false;
                };
                var node = graph.selectAll(".node")
                    .data(json.nodes)
                    .enter().append("g")
                    .attr("class", "node")
                    .attr("id", function(d) {
                        return d.name
                    })
                    .attr("transform", function(d, i) {
                        return "translate(" + nodePosX[i] + "," + nodePosY[i] + ")"
                    })
                    .on("click", function hN() {
                        var p = getParentNodes(json, getIndexByName(json, this.id));
                        highlightNode(json, this.id, false, p);

                    })

                    .on("mouseover", function() {
                        d3.select(this.childNodes[0]).style("fill", "#EEE9E9")
                    })
                    .on("mouseout", function() {
                        d3.select(this.childNodes[0]).style("fill", "white")
                    });

                var rects = node.append("rect").attr("class", "nodeRect");


                var rectAttributes = rects.attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 200)
                    .attr("height", function(d, i) {
                        return getNodeHeight(json, i)
                    })
                    .style("fill", function(d, i) {
                        return "white"
                    })
                    .style("stroke", function(d, i) {
                        if (d.properties.type == "diagnosis") {
                            return diagnosisColor;
                        };
                        if (d.properties.type == "therapy") {
                            return therapyColor;
                        };
                        if (d.properties.type == "examination") {
                            return examinationColor;
                        };
                        if (d.properties.type == "symptom") {
                            return symptomColor;
                        }
                    })
                    .style("stroke-width", 4)
                    .attr("rx", 10)
                    .attr("ry", 10)

                //Namen
                var name = node.append("text");

                var nameAttributes = name.style("fill", contentColor)
                    .attr("x", 5)
                    .attr("y", 23)
                    .text(function(d) {
                        return d.name;
                    })
                    .attr("font-size", function(d) {
                        return Math.min(25, 80 / this.getComputedTextLength() * 24) + "px";
                    });


                //RadioButtons
                var radioButtons = node.append("g")
                    .attr("id", function(d, i) {
                        return d.name + "radioButtons"
                    });

                var buttonGroups = radioButtons.selectAll("g.button")
                    .data(function(d, i) {
                        return d.properties.states
                    })
                    .enter()
                    .append("g")
                    .attr("class", "button")
                    .style("cursor", "pointer");

                var bWidth = 10; 
                var bHeight = 10; 
                var bSpace = 9; 
                var x0 = 8; 
                var y0 = 33; 

                buttonGroups.append("circle")
                    .attr("class", "buttonRect")
                    .attr("r", 6)
                    .attr("cx", function(d, i) {
                        return x0 + 4;
                    })
                    .attr("cy", function(d, i) {
                        return y0 + (bWidth + bSpace) * i + 6;
                    })
                    // Farbe des Torten-Stücks
                    .attr("fill", function(d, i) {
                        return d3.rgb(eval(json.nodes[getIndexByName(json, this.parentElement.parentElement.id.substring(0, this.parentElement.parentElement.id.length - 12))].properties.type + "Color")).darker(0.8).brighter(i);
                    })

                //Zustände
                var stateGroup = node.append("g")
                    .attr("id", function(d) {
                        return "stateGroup"
                    });

                var stateText = stateGroup.append("text");

                var stateAttributes = stateText
                    .attr("font-size", "15px")
                    .attr("x", 10)
                    .attr("y", 22);

                var states = stateAttributes.selectAll("tspan")
                    .data(function(d, i) {
                        return d.properties.states
                    })
                    .enter()
                    .append("tspan")
                    .style("fill", "black")
                    .text(function(d) {
                        return d.name;
                    })
                    .attr("dy", 20)
                    .attr("x", 25)
                    .style("cursor", "pointer")
                    //markiert den Zustand
                    .on("click", function() {
                        var childNo = 0;
                        var child = this;
                        while (child.previousSibling != null) {
                            childNo++;
                            child = child.previousSibling;
                        }
                        var stateID = this.parentElement.parentElement.parentElement.id + "," + childNo;
                        highlightButton(stateID);
                    });

                // Umrandung der Knöpfe
                buttonGroups.append("svg:foreignObject")
                    .attr("width", 20)
                    .attr("height", 20)
                    .attr("y", function(d, i) {
                        return y0 + (bWidth + bSpace) * i + bWidth / 2 - 8;
                    })
                    .attr("x", function(d, i) {
                        return x0 + bWidth / 2 - 8;
                    })
                    .append("xhtml:i")
                    .attr("class", function(d) {
                        return "fa fa-circle-o fa-1.5x";
                    })
                    .attr("id", function(d, i) {
                        return this.parentElement.parentElement.parentElement.id + "," + i
                    })
                    .style("fill", contentColor)
                    .on("click", function() {
                        var stateID = this.id;
                        highlightButton(stateID);
                    });

                //speichert alle markierten Knöpfe
                clickedButtons = []; 
                json.nodes.forEach(function(d, i) {
                    if (d.properties.observation != undefined) {
                        d.properties.states.forEach(function(ds, is) {
                            if (ds.name == d.properties.observation.name) {
                                highlightButton(d.name + "radioButtons," + is, true);
                            }
                        })
                    }
                })

                //erstellt Tortendiagramme
                showInference(id);
            

            
                // -----------------
                // Hilfsfunktionen
                // -----------------
                function getNodeHeight(json, nodeInd) {
                    if (json.nodes[nodeInd].properties.states.length == 1) {
                        return (json.nodes[nodeInd].properties.states.length + 1) * 20 + 27
                    }
                    return json.nodes[nodeInd].properties.states.length * 20 + 27
                }

                function getIndexByName(json, name) {
                    for (var i = 0; i < json.nodes.length; i++) {
                        if (json.nodes[i].name == name) {
                            return i;
                        }
                    }
                    return -1;
                }

                function getParentNodes(json, indexOfNode) {
                    var name = json.nodes[indexOfNode].name;
                    var parents = new Array(0);
                    for (i = 0; i < json.links.length; i++) {
                        if (json.links[i].target == indexOfNode) {

                            parents.push(json.links[i].source);
                        }
                    }
                    return parents;
                }

                function getChildNodes(json, indexOfNode) {
                    var name = json.nodes[indexOfNode].name;
                    var children = new Array(0);
                    for (i = 0; i < json.links.length; i++) {
                        if (json.links[i].source == indexOfNode) {

                            children.push(json.links[i].target);
                        }
                    }
                    return children;
                }
                
                    
                    
                //berechnet Layout     
                function computeLayout(json, turn = false) {
                    //Arrays mit Indexen der Nodes nach Typen sortiert, in therapyNodes sind auch die examinations drin
                    var symptomNodes = [],
                        therapyNodes = [],
                        diagnosisNodes = [];
                    for (i = 0; i < json.nodes.length; i++) {
                        if (json.nodes[i].properties.type == "symptom") {
                            symptomNodes.push(i);
                        }
                        if (json.nodes[i].properties.type == "diagnosis") {
                            diagnosisNodes.push(i);
                        }
                        if (json.nodes[i].properties.type == "therapy" || json.nodes[i].properties.type == "examination") {
                            therapyNodes.push(i);
                        }
                    }

                    var allArrays;
                    allArrays = [symptomNodes, diagnosisNodes, therapyNodes]

                    var nodeWidth = 200;
                    var XStart = 50;
                    var minSpace = 100; //Mindestabstand zwischen 2 Knoten in einer Zeile
                    var xPos = new Array(json.nodes.length),
                        yPos = new Array(json.nodes.length);
                    var YStart = 50, 
                        YSpace = 160, 
                        tmpYPos = YStart;

                    //berechnet maximale Knoten Anzahl in einer Zeile
                    var maxNodes = Math.round((lWidth - 2 * XStart + minSpace) / (nodeWidth + minSpace))
                    if (maxNodes < 1) {
                        throw error; // Nachricht anpassen
                    }

                    //berechnet wie viele Zeilen pro Gruppe gebraucht werden
                    var rows = new Array(allArrays.length); //Array mit Liste von rows für jede Gruppe
                    for (var r = 0; r < rows.length; r++) {
                        rows[r] = [];
                    }

                    //computeRows
                    allArrays.forEach(function(a, noOfArray) {
                        var len = a.length;
                        if (len == 0) {
                            rows.splice(noOfArray, 1)
                        } 
                        while (len != 0) {
                            if (len <= maxNodes) { //nur wenn es erste Stelle gibt
                                if ((rows[noOfArray][0] + len) % 2 == 1) { // verhindert, dass gerade auf ungerade trifft
                                    rows[noOfArray].unshift(len);
                                } else {
                                    rows[noOfArray].push(len);
                                }
                                break;
                            } else
                            if ((len / (2 * maxNodes - 1)) < 1) { 
                                rows[noOfArray].push(maxNodes);
                                len -= maxNodes;
                            } else {
                                rows[noOfArray].push(maxNodes);
                                rows[noOfArray].push(maxNodes - 1);
                                len -= 2 * maxNodes - 1;
                            }

                        }
                    })

                    //berechnet die Zeilen die das Netz insgesamt hat
                    var yCounter = 0;
                    rows.forEach(function(r, rNo) {
                        yCounter += r.length;
                    })
                    
                    //vertikaler Platz zwischen zwei Gruppen
                    var groupSpace = Math.max((window.innerHeight - yCounter * YSpace - YStart * 2 - 20) / (allArrays.length - 1), 100);

                    //berechnet die Positionen für jeden Knoten 
                    //computePos
                    rows.forEach(function(a, aNo) {
                        var noOfNode = 0;
                        a.forEach(function(r, rNo) {
                            for (var i = 1; i <= r; i++) {
                                if (r == 1) { // in Mitte
                                    xPos[allArrays[aNo][noOfNode]] = lWidth / 2 - nodeWidth / 2;
                                } else if (r <= maxNodes - 1) { //eingerückt weil es der zweite Teil der Gruppe ist und 2 wird immer eingerückt
                                    xPos[allArrays[aNo][i - 1 + noOfNode]] = XStart + (lWidth - 2 * XStart - nodeWidth - nodeWidth) / (r - 1) * (i - 1) + 0.5 * nodeWidth;
                                } else { // alle anderen werden gleichmäßig auf die Zeile verteilt
                                    xPos[allArrays[aNo][i - 1 + noOfNode]] = XStart + (lWidth - 2 * XStart - nodeWidth) / (r - 1) * (i - 1);
                                }

                                yPos[allArrays[aNo][i - 1 + noOfNode]] = tmpYPos;

                            }
                            noOfNode += r;
                            tmpYPos += YSpace;
                        })
                        tmpYPos += groupSpace;
                    })

                    //letzte unsichtbare Zeile
                    if (tmpYPos > window.innerHeight - 20) {
                        tmpYPos -= groupSpace;
                    }
                    return [xPos, yPos, Math.max(window.innerHeight - 20, tmpYPos)];
                }
                    
                //berechnet Kanten in einer Ebene
                function curvedLink(json, yPos, sX, tX, sourceId, targetId, childNo) {
                    c1 = 60;
                    cs = getNodeHeight(json, sourceId);
                    ct = getNodeHeight(json, targetId);

                    var lineData = [{
                            "x": sX,
                            "y": yPos + cs
                        }, {
                            "x": Math.min(sX, tX) + (Math.abs(sX - tX) / 2),
                            "y": yPos + c1 + Math.max(cs, ct)
                        },
                        {
                            "x": tX,
                            "y": yPos + ct
                        }
                    ];

                    var lineFunction = d3.svg.line()
                        .x(function(d) {
                            return d.x;
                        })
                        .y(function(d) {
                            return d.y;
                        })
                        .interpolate("basis");

                    var newPath = graph.append("path").attr("d", lineFunction(lineData)).attr("fill", "none").style("marker-end", "url(#lowArrow)").style("marker-start", "url(#lowDot)").attr("id", "link").style("stroke", "lightblue")

                    document.getElementById("graph").insertBefore(newPath.node(), document.getElementById("graph").childNodes[childNo]); //fügt den path an die stelle der richtigen line ein
                }

            
                // erstellt Tabelle
                function calculateTableContent(json, IndexOfNode, id) {

                    var parents = [];
                    for (c = 0; c < getParentNodes(json, IndexOfNode).length; c++) {
                        parents.push(getIndexByName(json, json.nodes[IndexOfNode].properties.cpt.probabilities[0].conditions[c].entityName));
                    }

                    parents.push(IndexOfNode)
                    var parentSize = parents.length - 2;

                    // Spaltenköpfe: Eltern
                    var columns = new Array(0);
                    parents.forEach(function(element, Id, array) {
                        columns.push(json.nodes[element].name)
                    })
                    
                    // Zustände dieses Knotens in letzter Spalte
                    json.nodes.forEach(function(d, i) {
                        if (d.name == columns[columns.length - 1]) {
                            if (d.properties.states.length == 0) { //Knoten hat keine Zustände
                                columns.split(columns.length - 1, 1);
                            } else { 
                                columns[columns.length - 1] = d.properties.states[0].name;
                                for (i = 0; i < d.properties.states.length - 1; i++) {
                                    columns.push(d.properties.states[i + 1].name);
                                }
                            }
                        }
                    })
                    
                    var rows = [];

                    var countRows = 1;
                    for (p = 0; p < parents.length - 1; p++) {
                        countRows *= json.nodes[parents[p]].properties.states.length;
                    }

                    // Zustandsnamen
                    // #columns - #states of this node
                    var stateRow = new Array(columns.length - json.nodes[parents[parents.length - 1]].properties.states.length)
                    var probRow = new Array(json.nodes[parents[parents.length - 1]].properties.states.length + 1)
                    for (j = 0; j < countRows; j++) {
                        for (i = 0; i < (columns.length - json.nodes[parents[parents.length - 1]].properties.states.length); i++) {
                            stateRow[i] = json.nodes[parents[parents.length - 1]].properties.cpt.probabilities[j * json.nodes[parents[parents.length - 1]].properties.states.length].conditions[i].name;
                        }
                        for (h = 0; h < json.nodes[parents[parents.length - 1]].properties.states.length; h++) {
                            probRow[h] = json.nodes[parents[parents.length - 1]].properties.cpt.probabilities[j * json.nodes[parents[parents.length - 1]].properties.states.length + h].probability;
                        }
                        var allRows = stateRow.concat(probRow)
                        allRows.push("1")
                        rows.push(allRows)
                    }

                    columns.push("∑")
                    
                    return tabulate(rows, columns, parentSize, IndexOfNode, id)
                }

                function tabulate(rows, columns, parentSize, nodeIndex, name) {

                    var tableGroup = leftContainer.append("g").attr("id", "tableGroup")
                    var tabRect = tableGroup.append("rect").attr("width", rWidth - 25).style("fill", "white").style("stroke", contentColor).style("stroke-width", "5").attr("x", 10 + lWidth).attr("y", menuHeight + 25).attr("id", "tableRect")

                    var tablePartHeight = height - menuHeight - 40;
                    tabRect.attr("height", tablePartHeight);

                    var tableHeading = tableGroup.append("text") 
                        .style("fill", "#111")
                        .attr("x", lWidth + rWidth / 2)
                        .attr("y", 180)
                        .attr("font-size", "25px")
                        .attr("text-anchor", "middle").text(id.slice(2, -1).toUpperCase() + ": " + name);


                    var x0 = 25; //x offset
                    var y0 = 220; //y offset

                    var table = tableGroup.append("foreignObject")
                        .attr("y", y0)
                        .attr("x", lWidth + x0)
                        .attr("width", rWidth - 50) // widthRight)
                        .attr("height", height - menuHeight - 190 + "px")
                        .append("xhtml:body")
                        .append("div")
                        .attr("id", "table-div")
                        .style("max-width", rWidth - 50 + "px")
                        .style("max-height", height - menuHeight - 190 + "px")
                        .style("overflow-y", "auto")
                        .style("overflow-x", "auto")
                        .append("table") 
                        .attr("width", rWidth - 50 + "px")
                        .attr("height", "70%")
                        .attr("id", "table")


                    ths = d3.select("table").append("thead")
                        .append("tr")
                        .attr("class", "head")
                        .selectAll("th")
                        .data(columns)
                        .enter()
                        .append("th")
                        .html(function(d) {
                            return d;
                        });

                    tfs = d3.select("table").append("tfoot")
                        .append("tr")
                        .attr("class", "head")
                        .selectAll("th")
                        .data(columns)
                        .enter()
                        .append("th")
                        .html(function(d) {
                            return d;
                        });

                    //Trennung zwischen Eltern und Zuständen
                    ths.style("border-right", function(d, i) {
                        if (i == parentSize || i == columns.length - 2) {
                            return "solid " + contentColor;
                        }
                    })


                    d3.select("table").append("tbody")
                        .selectAll("tr.data")
                        .data(rows).enter()
                        .append("tr")
                        .attr("class", "data");

                    var tds = d3.selectAll("tr")
                        .selectAll("td")
                        .data(function(d) {
                            return d3.entries(d)
                        })
                        .enter()
                        .append("td").each(function(d) {
                            if (typeof(d.value) == "string") {
                                d3.select(this).html(d.value)
                            } else {
                                d3.select(this).append("input").attr("type", "text").attr("value", Math.round(d.value * 100) / 100)
                                    .attr("size", "5px")
                            }
                        })
                        .on("keydown", function() {
                            if (d3.event.keyCode == 13) {
                                //überprüft Summe in jeder Zeile
                                var changed = checkSum();

                                var body = document.getElementById("table").childNodes[2];
                                changed.forEach(function(l, i) {
                                    //überprüft ob es ein input field ist
                                    if (body.childNodes[l.line].childNodes[l.cell].childNodes[0].value != undefined) {

                                        var conditionStates = "[";
                                        //wenn da influencing concepts sind
                                        for (var v = 0; v < document.getElementById("table").firstChild.firstChild.childNodes.length - (json.nodes[getIndexByName(json, name)].properties.states.length + 1); v++) {
                                            conditionStates += "{%22entityName%22:%20%22" + document.getElementById("table").firstChild.firstChild.childNodes[v].innerHTML + "%22,%22name%22:%20%22" + document.getElementById("table").childNodes[2].childNodes[l.line].childNodes[v].innerHTML + "%22},"
                                        }
                                        conditionStates = conditionStates.slice(0, -1);
                                        conditionStates += "]";

                                        //Sendet alle veränderten Zellen an Datenbank
/*                                      var spinner = container.append("svg:foreignObject") //laden Animation
                                            .attr("width", 2000)
                                            .attr("height", 2000)
                                            .attr("y", window.innerHeight * 0.5 - 100 + "px")
                                            .attr("x", window.innerWidth * 0.5 - 100 + "px")
                                        spinner.append("xhtml:span").style("fill", "purple")
                                            .attr("class", "fa fa-spinner fa-pulse fa-5x");
                                        setTimeout(function() {
                                            d3.xml("http://10.200.1.75:8012/bn/probability?name=" + id + "&id=" + json.nodes[getIndexByName(json, name)].properties.id + "&probability=" + parseFloat(body.childNodes[l.line].childNodes[l.cell].childNodes[0].value) + "&influenced-state=" + body.parentNode.firstChild.firstChild.childNodes[l.cell].innerHTML + "&condition-states=" + conditionStates, function(error, empty) {
                                                if (error) throw error;
                                                spinner.remove;
                                            })
                                        }, 100);*/
                                    }
                                })
                            }
                        });

                    //Trennung zwischen Eltern und Zuständen
                    tds.style("border-right", function(d, i) {
                        if (i == parentSize || i == columns.length - 2) {
                            return "solid " + contentColor;
                        }
                    })

                    // entnommen aus https://datatables.net/examples/api/multi_filter.html
                    $(document).ready(function() {
                        // Setup - add a text input to each footer cell
                        $('#table tfoot th').slice(0, parentSize + 1).each(function(d, no) {

                            var title = $(this).text();
                            $(this).html('<input type="text" placeholder="Search ' + title + " states" + '" />');

                        });

                        // DataTable
                        var table = $('#table').DataTable();

                        // Apply the search
                        table.columns().every(function() {
                            var that = this;

                            $('input', this.footer()).on('keyup change', function() {
                                if (that.search() !== this.value) {
                                    that
                                        .search(this.value)
                                        .draw();
                                }
                            });
                        });
                    });

                    var yPos = document.getElementById("table-div").offsetHeight

                    //Children and ParentNodes
                    var adjacents = d3.select(document.getElementById("table-div")).append("g")

                    var ks = getChildNodes(json, nodeIndex)
                    var kinderBox = 0;
                    if (ks.length > 0) {
                        var kinderText = json.nodes[ks[0]].name
                        ks.forEach(function(d, i) {
                            if (i == 0) {} else {
                                kinderText += ", " + json.nodes[ks[i]].name
                            }
                        })
                        var kinderdiv = adjacents.append("div").style("margin", "7em 1em 1em")


                        kinderdiv.append("div")
                            .style("float", "left")
                            .style("clear", "both")
                            .style("width", "12em")
                            .append("text").html("Dependent Concepts: ")
                            .style("font-size", "19px")
                            .style("color", "#111");

                        kinderdiv.append("div") 
                            .style("margin-left", "12em").style("clear", "right")
                            .append("text").html(kinderText)
                            .style("font-size", "18px")
                            .style("color", contentColor);
                    }


                    var ps = getParentNodes(json, nodeIndex)
                    if (ps.length > 0) {
                        var elternText = json.nodes[ps[0]].name
                        ps.forEach(function(d, i) {
                            if (i == 0) {} else {
                                elternText += ", " + json.nodes[ps[i]].name;

                            }
                        })
                        var elterndiv = adjacents.append("div").style("margin", "4em 1em 1em")

                        elterndiv.append("div")
                            .style("float", "left")
                            .style("clear", "both")
                            .style("width", "12em")
                            .append("text").html("Influencing Concepts: ")
                            .style("font-size", "19px")
                            .style("color", "#111")

                        elterndiv.append("div") //.style("width", "25em")
                            .style("margin-left", "12em").style("clear", "right")
                            .append("text").html(elternText)
                            .style("font-size", "18px")
                            .style("color", contentColor)
                    }
                }
                
                // überprüft Summe in Tabelle
                function checkSum() {
                    var body = document.getElementById("table").childNodes[2];
                    var changed = [];
                    
                    //alle Zeilen
                    for (var p = 0; p < body.childNodes.length; p++) {
                        var lineSum = 0.0;
                        //alle Zellen
                        for (var c = 0; c < body.childNodes[p].childNodes.length; c++) {
                            //überprüft ob es ein input field ist
                            if (body.childNodes[p].childNodes[c].childNodes[0].value != undefined) {
                                lineSum += parseFloat(body.childNodes[p].childNodes[c].childNodes[0].value);
                            }
                        }

                        if (lineSum != 1) {
                            //falsche Summe in rot geschrieben
                            d3.select(body.childNodes[p].lastChild).style("color", "red").text(Math.round(lineSum * 100) / 100);
                        } else {
                            //richtig in lila
                            d3.select(body.childNodes[p].lastChild).style("color", "purple").text(Math.round(lineSum * 100) / 100);
                            //überprüft welche Zellen verändert wurden und gibt sie zurück 
                            for (var c = 0; c < body.childNodes[p].childNodes.length; c++) {
                                if (body.childNodes[p].childNodes[c].childNodes[0].value != undefined) {
                                    if (body.childNodes[p].childNodes[c].childNodes[0].value != body.childNodes[p].childNodes[c].childNodes[0].getAttribute("value")) {
                                        changed.push({
                                            "line": p,
                                            "cell": c
                                        })
                                    }
                                }
                            }
                        }
                    }
                    return changed;
                }

                    
                // markiert Knoten
                function highlightNode(json, id, ac = false, parents) {

                    for (i = 0; i < json.nodes.length; i++) {
                        if (id == json.nodes[i].name) {
                            if (!activeNodes[i]) { //dieser wurde vorher gehighlightet
                                for (var j = 0; j < activeNodes.length; ++j) {
                                    if (activeNodes[j]) { //ein anderer wurde vorher gehighlightet
                                        //rect
                                        d3.select(document.getElementById(json.nodes[j].name).firstChild).style("stroke-width", 4);
                                        //table
                                        tableGroup.remove();
                                        //links
                                        for (l = 0; l < json.links.length; l++) {
                                            d3.select(document.getElementById("graph").childNodes[l]).style("stroke", "lightblue").style("marker-end", "url(#lowArrow)").style("marker-start", "url(#lowDot)").style("stroke-width", 4);
                                        }
                                    }
                                    activeNodes[j] = false;
                                };
                                //highlighte diesen Knoten
                                //links
                                for (k = 0; k < parents.length; k++) {
                                    for (l = 0; l < json.links.length; l++) {
                                        if (parents[k] == json.links[l].source && json.links[l].target == i) {
                                            d3.select(document.getElementById("graph").childNodes[l]).style("stroke", "steelblue").style("marker-end", "url(#highArrow)").style("marker-start", "url(#highDot)").style("stroke-width", 6);
                                        }
                                    }
                                }
                                //nodeRect
                                d3.select(document.getElementById(id).childNodes[0]).style("stroke-width", 8);
                                activeNodes[i] = true;
                                //table
                                var yTemp = calculateTableContent(json, i, id);
                                break;

                            }
                        }
                    }

                }

                //markiert Zustände
                function highlightButton(stateID, begin = false) {

                    var nodeName = stateID.split(",")[0].replace("radioButtons", "");
                    var stateNo = stateID.split(",")[1];
                    stateID = nodeName + "radioButtons," + stateNo;
                    var dbID = json.nodes[getIndexByName(json, nodeName)].properties.id;
                    var stateName = json.nodes[getIndexByName(json, nodeName)].properties.states[stateNo].name;

                    var p = getParentNodes(json, getIndexByName(json, nodeName));
                    highlightNode(json, getIndexByName(json, nodeName), true, p);
                    active = false;
                    //tauscht Text, wenn er schon gehighlightet wurde
                    if (clickedButtons.indexOf(stateID) != -1) {
                        d3.select(document.getElementById(stateID)).attr("class", "fa fa-circle-o");
                        clickedButtons.splice(clickedButtons.indexOf(stateID), 1);
                        active = false;
                        stateName = "";
                    } else { // button wurde noch nicht angeklickt
                        //überprüft ob es anderen angeklicken button gibt
                        for (i = 0; i < clickedButtons.length; i++) {
                            if (document.getElementById(stateID).parentElement.parentElement.parentElement.id == clickedButtons[i].split(",")[0]) {
                                active = true;
                                break;
                            }
                        }
                        //wenn nicht, tausche text und füge in Liste ein
                        if (active == false) {
                            d3.select(document.getElementById(stateID)).attr("class", "fa fa-check-circle-o");
                            clickedButtons.push(stateID);

                        } else { // sonst tausche text von altem und pushe neuen in Liste
                            //alter Button
                            for (i = 0; i < clickedButtons.length; i++) {
                                if (document.getElementById(stateID).parentElement.parentElement.parentElement.id == clickedButtons[i].split(",")[0]) {
                                    d3.select(document.getElementById(clickedButtons[i])).attr("class", "fa fa-circle-o");
                                    oldButtonI = clickedButtons.indexOf(clickedButtons[i]);
                                    clickedButtons.splice(oldButtonI, 1); //removes oldButtons Id
                                    clickedButtons.push(stateID);
                                }
                            }
                            //neuer Button
                            d3.select(document.getElementById(stateID)).attr("class", "fa fa-check-circle-o");
                        }
                    }

                    //aktualisiere Datenbank mit observation
                    if (!begin) {
                        showInference(id, true, dbID, stateName);
                    }
                }
                
                //erstellt Pie Charts
                function showInference(id, obs = false, dbID, stateName) {
                    setTimeout(function() {
                        if (obs) {
                            var spinner = leftContainer.append("svg:foreignObject") //laden Animation
                                .attr("width", 2000)
                                .attr("height", 2000)
                                .attr("y", lWidth * 0.5 + "px")
                                .attr("x", lWidth * 0.5 + "px")
                            spinner.append("xhtml:span")
                                .attr("class", "fa fa-spinner fa-pulse fa-5x");

                            setTimeout(function() {
                                d3.json("http://10.200.1.75:8012/bn/edit/vertex/" + dbID + "?name=" + id + "&observation=" + stateName, function(error, newInf) {
                                    if (error) throw error;
                                    spinner.remove();
                                    node.selectAll(".inf").remove();
                                })
                            }, 300);
                            return true;
                        }
                    }, 10);

                    setTimeout(function() {
                        //aktualisiere PieCharts 
                        d3.json("http://10.200.1.75:8012/bn/inference?name=" + id, function(error, inf) {
                            inf.nodes.forEach(function(d, i, a) {

                                var w = 60;
                                var h = 60;
                                var r = Math.min(w, h) / 2;

                                var svg = d3.select(document.getElementById(inf.nodes[i].name))
                                    .append('svg').attr("class", "inf")
                                    .attr("x", 125)
                                    .attr("y", 4) 
                                    .attr('width', w)
                                    .attr('height', h)
                                    .append('g')
                                    .attr('transform', 'translate(' + (w / 2) +
                                        ',' + (h / 2) + ')');

                                var arc = d3.svg.arc()
                                    .innerRadius(0)
                                    .outerRadius(r);

                                var pie = d3.layout.pie()
                                    .value(function(d0) {
                                        return d0;
                                    })
                                    .sort(null);

                                var beliefArray = [];
                                for (var key in d.properties.beliefs) {
                                    var bPos = 0;
                                    for (f = 0; f < d.properties.states.length; f++) {
                                        if (key.split("\"")[7] == d.properties.states[f].name) {
                                            bPos = f;
                                        }
                                    }
                                    beliefArray[bPos] = (Math.round(d.properties.beliefs[key] * 100) / 100);
                                }

                                var jsonI = getIndexByName(json, inf.nodes[i].name);
                                var path = svg.selectAll('path')
                                    .data(pie(beliefArray))
                                    .enter()
                                    .append('path')
                                    .attr('d', arc)
                                    .attr('fill', function(d1, i1) {
                                        return d3.rgb(eval(json.nodes[jsonI].properties.type + "Color")).darker(0.8).brighter(i1);
                                    })
                            })
                        })

                    }, 1200);
                }
            
            })
    }, 100);
}