# BayesNetze
- Edges
	- links über force directed graph
	- Überlegung: curvededges (in tick)
		- todo: hinter Marker weiß, verschwinden hinter Zustand, getStateHeight
	
- Nodes
	- BoundingBox im leftContainer
		- todo: BBox valueGroup
	- HighlightNode: wenn angeklickt wird Node eingefärbt und Tabelle öffnet sich
		- todo: Balken für W'keit
		- todo: Radio Buttons
	
- Tabellen
	- Anzahl der Zeilen -> alle Kombinationen der values aus Knoten und Elternknoten
		- todo: getParents??
		- todo: scroll bei großen Tabellen
		- todo: Spalten+values von Hauptnode, Zeilen - #values von Hauptnode
	
- Layout
	- Überlegung: sigma.js
	- Überlegung: force layout + Rechtsklick fest + linkNodes
		- kann man auch force layout mit festen Punkten am Anfang machen?
	- Überlegung: Ebenen (oben ohne eingehende Kanten, unten ohne ausgehende), bereits vorhandener Code?
	- Überlegung: unsichtbare Links zwischen alle Zuständen -> sedgeDist
	
- Zusatzfunktionalitäten
	- Überlegung: Paper zu Ergebis verlinken -> woher die Daten, wie aktuell
	- Überlegung: Mit welchem zusätzlichen Symptom (Test) würde die W'keit zu einem Ergebnis am meisten steigen -> Empfehlung zu nächstem Test -> kann Kosten/Zeit abschätzen
	- Welche Art von Anfragen?
