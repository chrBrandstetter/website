# Christoph Brandstetter – Persönliche Website

Persönliche Website von Christoph Brandstetter, AgeGroup-Triathlet.

Aktueller Fokus: Vorstellung als Person und Anlaufstelle für Sponsoring-Anfragen.
Ein Coaching-Bereich ist geplant und wird ergänzt, sobald die Trainerausbildung abgeschlossen ist.

## Struktur

```text
/
├── index.html      # Hauptseite (Start, Über mich, Erfolge, Sponsoring, Kontakt)
├── css/style.css   # Stylesheet (Responsive, Mobile-Nav)
├── js/main.js      # Interaktion (Menü, Formular-Validierung, Jahr)
└── favicon.svg     # Favicon
```

## Features

- Semantisches, responsives HTML5 (Desktop & Mobile)
- Mobile Navigation mit Toggle-Menü
- Kontaktformular mit clientseitiger Validierung
- Reine Standard-Web-Technologien (kein Build-Step, keine Abhängigkeiten)

## Lokal ansehen

Dateien einfach klonen und `index.html` im Browser öffnen:

```bash
git clone https://github.com/chrBrandstetter/website.git
cd website
# index.html im Browser öffnen (Doppelklick genügt)
```

Oder kurz per lokalem Server:

```bash
python3 -m http.server 8000
# dann http://localhost:8000 im Browser öffnen
```

## Längerfristige Erweiterungen (Ideen)

- echte Inhalte/Erfolge (Resultate, Fotos)
- echte Fotos für Hero und Galerie (`images/hero.jpg`, `images/foto-1.jpg`, …)
- eigene Preisanpassung der Logo-Zonen (`js/main.js`, Array `TRISUIT_ZONES`)
- **Coaching-Bereich** (nach Abschluss der Trainerausbildung)
- Blog/Bereich für Trainingsberichte
- Anbindung des Kontaktformulars an einen echten Mailversand
- Deployment via GitHub Pages

---

© Christoph Brandstetter · Triathlet & Coach in Ausbildung
