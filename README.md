# BayesNetze
- Layout
	- Ebenen (oben ohne eingehende Kanten, unten ohne ausgehende), bereits vorhandener Code?
	- dynamische YPos + scroll ÜBERARBEITEN RESTKNOTEN
		- (von links nach rechts)
		- (planare Graphen)
		- pro Ebene: die mit meisten Kanten nach außen
	- große Gruppen werden in 3 + 2 aufgeteilt und Rest wird neuer Zeile drangehängt ANPASSEN
		- ab 8er Gruppen in 5er aufteilen
	- Symptome oben wenn viele Links davon abgehen


- Links
	- Links die ankommen zeigen nicht auf gleichen Punkt
	- highlightLinks zu highlightNode ÜBERARBEITEN: unhighlight
	- Links gleicher Ebenen werden waagerecht angezeigt CURVED
		- todo: was passiert wenn ein Node dazwischen liegt?, es mehrere in einer Ebene gibt? LAYOUT?
		- (curvedlinks)
	
- Nodes
	- HighlightNode: wenn angeklickt wird Node eingefärbt, hinführende Links gehighlighted und Tabelle öffnet sich
	- Tortendiagramm zeigt die Wkeit ANIMATION
		- todo: Node Wkeit ausrechnen DB
		- todo: Namen positionieren, Nodes länger machen?
	- Radio Buttons
	
- Tabellen
	- Anzahl der Zeilen
	- scroll bei großen Tabellen (feste Größe)
	- states mit richtiger Wkeit
		- todo: Suchfunktion
		- todo: aktualisierte Tabelle

- Menü
	- 4 Buttons HIGHLIGHT ANIMATION
		- todo: Aktualisier-Knopf bei Anpassungen der W'keiten	
	- am Anfang seht man nur Menü und kann sich alle Netze laden
		- Animationen 
		- speichern?
		- (erweitern?)
		- Login?

- todo: Säulendiagramm mit genauen Wkeiten auf rechter Seite
- todo: Tabelle mit potenziellen Infos über Knoten

- Legende + Info Button 
	- ausklappbar
		- todo: Legende mit Click ausblenden
		- todo: Animation

	
- (Zusatzfunktionalitäten)
	- (Überlegung: Paper zu Ergebis verlinken -> woher die Daten, wie aktuell)
	- Überlegung: Mit welchem zusätzlichen Symptom (Test) würde die W'keit zu einem Ergebnis am meisten steigen -> Empfehlung zu nächstem Test -> kann Kosten/Zeit abschätzen

- ansonsten
	- Welche Art von Anfragen?
	- verschiedene Browser: Chrome? Awesome fonts?
	- d3 oder d3.min, d3.v4 oder d3.v3 oder d4
