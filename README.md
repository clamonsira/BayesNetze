# BayesNetze
- Layout
	- Ebenen (oben ohne eingehende Kanten, unten ohne ausgehende), bereits vorhandener Code?
		- todo: dynamische YPos + scroll
		- (von links nach rechts)
		- (planare Graphen)
		- pro Ebene: die mit meisten Kanten nach außen
	- 1:mitte, 2: außen, 3: mitte,  2 + 3, 4 + 2, usw
	- Symptome oben wenn viele Links davon abgehen


- Links
	- Links die ankommen zeigen nicht auf gleichen Punkt
		- todo: highlightLinks zu highlightNode ÜBERARBEITEN: unhighlight
	- Links gleicher Ebenen werden waagerecht angezeigt
		- todo: was passiert wenn ein Node dazwischen liegt?, es mehrere in einer Ebene gibt? LAYOUT
		- (curvedlinks)
	
- Nodes
	- HighlightNode: wenn angeklickt wird Node eingefärbt, hinführende Links gehigjlighted und Tabelle öffnet sich
	- Tortendiagramm zeigt die Wkeit ANIMATION
		- todo: Node Wkeit ausrechnen DB
		- todo: Namen positionieren, Nodes länger machen
	- Radio Buttons
	
- Tabellen
	- Anzahl der Zeilen
	- scroll bei großen Tabellen (feste Größe) ÜBERARBEITEN 200px
	- states mit richtiger Wkeit
		- todo: Suchfunktion
		- todo: aktualisierte Tabelle

- Menü
	- 4 Buttons HIGHLIGHT ANIMATION
		- todo: Aktualisier-Knopf bei Anpassungen der W'keiten	
		- Animationen beim Laden, verändern...
		- speichern?
		- (erweitern?)
		- Auswahlmöglichkeiten der Graphen am Anfang? Login?

- todo: Säulendiagramm mit genauen Wkeiten auf rechter Seite

- Legende + Info Button 
	- ausklappbar?


	
- Zusatzfunktionalitäten
	- Überlegung: Paper zu Ergebis verlinken -> woher die Daten, wie aktuell
	- Überlegung: Mit welchem zusätzlichen Symptom (Test) würde die W'keit zu einem Ergebnis am meisten steigen -> Empfehlung zu nächstem Test -> kann Kosten/Zeit abschätzen

- ansonsten
	- Welche Art von Anfragen?
	- verschiedene Browser: Chrome? Awesome fonts?
	- d3 oder d3.min, d3.v4 oder d3.v3 oder d4
