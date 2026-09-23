# Contao MATE Smooth Slider

[English](README.md) | Deutsch

Updatesichere Erweiterung für den Contao-MATE-News-Slider.

Das Bundle ergänzt weiche Bild- und Textübergänge, ohne MATE-Vendor-Dateien
zu verändern oder den nativen MATE-Slider zu ersetzen.

## Funktionen

- Echter Bild-Crossfade, ohne dass der Slider-Hintergrund sichtbar wird
- Unabhängiges Aus- und Einblenden des News-Textes
- Stabiler MATE-Caption-Hintergrund während der Übergänge
- Volle Lesezeit zwischen automatischen Übergängen
- Responsives Bild-Overlay folgt dem nativen Bildbereich von MATE
- Verwendet die vom Browser tatsächlich ausgewählte Bildressource (`currentSrc`)
- Arbeitet mit dem bestehenden MATE-News-Slider-Markup
- Keine Änderungen an MATE-Vendor-Dateien

## Standard-Timing

Die aktuelle Version verwendet:

- Bild-Crossfade: 1200 ms
- Text ausblenden: 1200 ms
- Text einblenden: 1200 ms
- Haltezeit: 10000 ms

Die Timing-Konstanten sind in `public/js/mate-smooth-slider.js` definiert.

## Funktionsweise

MATE bleibt für die Slider-Struktur und das responsive Layout verantwortlich.

Das Bundle:

1. pausiert den automatischen Slider-Timer von MATE,
2. lässt das aktuelle Bild vollständig sichtbar,
3. blendet das nächste Bild darüber ein,
4. blendet `.caption .layout_latest` unabhängig aus,
5. führt den eigentlichen MATE-Slide-Wechsel aus,
6. blendet den neuen Text ein,
7. startet anschließend eine neue Haltezeit.

Es wird nur ein Scheduler verwendet. Dadurch bleibt jeder Slide nach Abschluss
seines Übergangs für die volle konfigurierte Haltezeit sichtbar.

### Responsive Bildgeometrie

Das Bild-Overlay enthält keine fest hinterlegten MATE-Breakpoints oder
Desktop-Abmessungen.

Position und Größe werden aus dem nativen `.img`-Element des aktiven
MATE-Slides ermittelt und bei einer Änderung der Viewport-Größe aktualisiert.

Damit verbleiben Entscheidungen zum responsiven Layout bei MATE bzw. beim
projektspezifischen Theme, anstatt sie in diesem Bundle zu duplizieren.

## Umfang

Dieses Bundle steuert ausschließlich das Übergangsverhalten.

Es definiert bewusst keine:

- Typografie für Überschrift oder Teaser,
- Abmessungen oder Innenabstände der Caption,
- projektspezifischen responsiven Breakpoints,
- Teaser-Kürzungen,
- Call-to-Action-Gestaltung.

Diese Bereiche bleiben Aufgabe von MATE und dem jeweiligen Theme bzw. dessen CSS.

## Kompatibilität

Getestete Umgebungen:

- Contao 4.13.58 mit MATE 2.21.4
- Contao 5.3.51 mit MATE 3.6.4
- Contao 5.7.13 mit MATE 3.6.4

Composer-Anforderungen:

- PHP `>=8.1 <8.5`
- Contao `^4.13 || ^5.3`
- MATE `^2.21.4 || >=3.5.4 <4.0`

## Nativer MATE-Slider

Das Bundle arbeitet auf Basis des bestehenden Materialize-Sliders von MATE.

Die native Slider-Instanz und ihre aktuellen Optionen können in der
Browser-Konsole geprüft werden mit:

`document.querySelector('.slider.mod_newslist')?.M_Slider?.options`

MATE-Versionen und einzelne Installationen können unterschiedliche native
Werte für `duration` und `interval` verwenden.

Es müssen keine MATE-Vendor-Dateien verändert werden.

## Manuelle Navigation

Automatische Übergänge verwenden die weichen Bild- und Textübergänge dieses
Bundles.

In der aktuellen Version behalten die bestehenden Zurück-/Weiter-Steuerelemente
von MATE ihr natives unmittelbares Verhalten. Eine manuelle Navigation startet
den automatischen Halte-Timer des Bundles nicht neu.

Beim nächsten automatischen Übergang werden Bild und Text wieder synchronisiert.

## Status

Die Übergangsimplementierung wurde mit MATE 2.x und MATE 3.x unter
Contao 4.13, 5.3 und 5.7 getestet.

Es werden keine MATE-Vendor-Dateien verändert.

## Lizenz

Contao MATE Smooth Slider steht unter der MIT-Lizenz.

Contao MATE Smooth Slider ist eine unabhängige Erweiterung für das MATE Theme.
MATE selbst ist ein separates Produkt und unterliegt seinen eigenen
Lizenzbedingungen. Das MATE Theme ist nicht Bestandteil dieses Pakets.
