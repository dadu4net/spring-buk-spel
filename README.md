# 🎀 Spring- en Buk-spel: Barbie & Leeuwenkoning Safari Run 🦁

Een kleurrijke, interactieve **HTML5 Canvas Endless Runner** geïnspireerd op de offline Dino Run en Edge Surf games, met twee speelbare werelden en wisselbare personages.

---

## 🌟 Twee Speelwerelden

### 1. 💖 Barbie Malibu Run
* **Personages:** Barbie (met wapperende paardenstaart) of Ken (met beach-swoosh).
* **Wereld:** Malibu Beach boulevard, pastelkleurige zonsondergang, Dreamhouse mansions en palmbomen.
* **Interactie:**
  * 💄 **Make-up Tassen openbeuken (+100m bonus!)**: Knal tegen make-up tassen aan om ze met rondvliegende lippenstiften en glitters open te breken!
  * 🦩 **Springen over:** Flamingo zwembanden, beachballen en slalom-kegels.
  * ⛱️ **Bukken/Sliden onder:** Vliegende strandparasols, meeuwen en ballonnen.
  * 💖 **Verzamel:** Hartjes (+15m), Glam Diamanten (+25m) en de Glitter Ster voor een onkwetsbaar **Sparkle Shield**.

---

### 2. 🦁 De Leeuwenkoning (Savanne Safari)
* **Personages:** Simba (jonge leeuwenwelp) of Nala met vloeiende viervoetige gallop- en tijger-animaties.
* **Wereld:** Afrikaanse savanne met zonsondergang, de Koningsrots (Pride Rock), Kilimanjaro en acaciabomen.
* **Interactie:**
  * 💥 **Hyena's wegbeuken (+100m bonus!)**: Beuk hyena's die op de loer liggen de lucht in met een komische salto en duizelige X-ogen!
  * 🪵 **Springen over:** Omgevallen savanne boomstammen en stekelige struiken.
  * 🐦 **Bukken/Tijgeren onder:** Vliegende Zazu, duikende gieren en jungle lianen.
  * 🐛 **Verzamel (*"Hakuna Matata!"*):** Sappige rupsen (+15m), gouden pootafdrukken (+25m) en het Leeuwenkoning Zon-Embleem voor het **Roar of the Elders** brul-schild!

---

## 🎮 Besturing

| Actie | Toetsenbord | Touchscreen / Muis |
| :--- | :--- | :--- |
| **Springen** | `Spatiebalk` of `⬆️ Pijl Omhoog` / `W` | Tik bovenste schermhelft / Swipe Omhoog / Knop ⬆️ |
| **Bukken / Tijgeren** | `⬇️ Pijl Omlaag` / `S` | Tik onderste schermhelft / Swipe Omlaag / Knop ⬇️ |
| **Pauzeren** | `P` of `Escape` | Pauzeerknop `⏸️` rechtsboven |
| **Thema Wisselen** | - | Wisselknop `🦁/🎀` rechtsboven |

---

## 🚀 Lokaal Spelen & Web Hosting

1. **Lokaal spelen:**
   Open simpelweg `index.html` in Microsoft Edge, Google Chrome of Safari. Er is geen installatie of backend vereist.

2. **Web Hosting (GitHub Pages / Netlify / Vercel):**
   * Dit project gebruikt pure web-standaarden (HTML5, CSS3, ES6 JavaScript) en een ingebouwde Web Audio API synthesizer.
   * Activeer **GitHub Pages** via *Settings -> Pages -> Deploy from main branch* om het direct als live webapp te spelen!

---

## 📁 Bestandsstructuur

```
├── index.html            # Hoofd HTML met speelveld, HUD en modals
├── README.md             # Documentatie en instructies
├── css/
│   └── style.css         # Barbie & Leeuwenkoning responsive styling
└── js/
    ├── audio.js          # Web Audio synthesizer (retro chimes & marimba SFX)
    ├── background.js     # Parallax Malibu & Afrikaanse Savanne werelden
    ├── collectibles.js   # Hartjes, diamanten, rupsen, pootjes & powerups
    ├── controls.js       # Toetsenbord-, swipe-, en touchbediening
    ├── obstacles.js      # Obstakels en beukbare Hyena's & Make-up tassen
    ├── player.js         # Animaties voor Barbie, Ken, Simba en Nala
    └── game.js           # Multi-theme game loop, score en state management
```
