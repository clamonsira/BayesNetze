# BayesNetze
- Layout
	- Ebenen (oben ohne eingehende Kanten, unten ohne ausgehende), bereits vorhandener Code?
		- todo: dynamische YPos
		- von links nach rechts?
		- planare Graphen
		- pro Ebene: die mit meisten Kanten nach außen
		- gerade anz pro Ebene: von außen nach innen plazieren
		- 1:mitte, 2: außen, 3: mitte,  2 + 3, 4 + 2,   aufteilen


- Links
	-lightblue
		- todo: curvedlinks
		- todo: hinter Marker weiß, verschwinden hinter Zustand, getStateHeight
	- Links die ankommen zeigen nicht auf gleichen Punkt
		- todo: Links von oben nach unten sollen oben am target Node zu sehen sein
	- highlightLinks zu highlightNode ÜBERARBEITEN: getParentsIndex??
	
- Nodes
	- HighlightNode: wenn angeklickt wird Node eingefärbt und Tabelle öffnet sich
		- todo: Balken für W'keit
	- Radio Buttons ÜBERARBEITEN
	
- Tabellen
	- Anzahl der Zeilen -> alle Kombinationen der states aus Knoten und Elternknoten
	- scroll bei großen Tabellen (feste Größe)
	- states mit richtiger Wkeit
		-todo: Spalten slice?

- Menü
	- 4 Buttons
		- todo: Aktualisier Knopf bei Anpassungen der W'keiten	
		- Animationen beim Laden, verändern...
		- speichern?
		- erweitern?

	
- Zusatzfunktionalitäten
	- Überlegung: Paper zu Ergebis verlinken -> woher die Daten, wie aktuell
	- Überlegung: Mit welchem zusätzlichen Symptom (Test) würde die W'keit zu einem Ergebnis am meisten steigen -> Empfehlung zu nächstem Test -> kann Kosten/Zeit abschätzen

- ansonsten
	- Welche Art von Anfragen?
	- verschiedene Browser: Chrome? Awesome fonts?
	- d3 oder d3.min, d3.v4 oder d3.v3 oder d4
