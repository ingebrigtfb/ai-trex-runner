# DINO DASH 🦖💨

**Et Episk Dinosaur Løperspill** bygget med React og TypeScript, inspirert av Chromes offline dinosaur-spill!

## 🎮 Game Features

- **Smooth Gameplay**: Responsive controls with spacebar jumping
- **Progressive Difficulty**: Game speed increases as you score higher
- **Multiple Obstacles**: Avoid both cacti and flying birds
- **Visual Effects**: Beautiful pixel art styling and smooth animations
- **Score Tracking**: Real-time score display and speed indicator
- **Responsive Design**: Works on all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-trex-runner
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 Slik Spiller Du

- **Start**: Klikk "Start Spill"-knappen eller trykk en hvilken som helst tast
- **Hopp**: Trykk **MELLOMROM** eller **KLIKK** for å få dinosauren til å hoppe
- **Mål**: Unngå hindringer (kaktus og fugler) så lenge som mulig
- **Poengsum**: Poengsummen din øker jo lenger du overlever
- **Vanskelighetsgrad**: Spillhastigheten øker hver 500. poeng

## 🏗️ Project Structure

```
src/
├── components/          # Game components
│   ├── Game.tsx        # Main game logic
│   ├── Dinosaur.tsx    # Player character
│   ├── Obstacle.tsx    # Game obstacles
│   └── Cloud.tsx       # Background clouds
├── hooks/              # Custom React hooks
│   ├── useGameLoop.ts  # Game loop management
│   └── useInputHandler.ts # Input handling
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling and animations
- **HTML5 Canvas** - Game rendering

## 🎮 Spillmekanikk

### Dinosaur Bevegelse
- Dinosauren løper automatisk fremover
- Hoppehøyde og avstand er optimalisert for flytende spillopplevelse
- Løpeanimasjon med bein- og armbevegelse

### Hindringsgenerering
- **Kaktus**: Bakkehindringer som dukker opp tilfeldig
- **Fugler**: Flygende hindringer i varierende høyder
- Hindringsfrekvensen øker med spillhastigheten

### Kollisjonsdeteksjon
- Presis hitbox-deteksjon for rettferdig spill
- Spill slutt når dinosauren treffer en hindring

### Progressiv vanskelighetsgrad
- Grunnhastighet: 5 enheter per ramme
- Hastigheten øker med 0,5 hver 500. poeng
- Maksimal hastighet begrenset til 15 enheter per ramme

## 🔧 Tilpasning

Du kan enkelt tilpasse spillet ved å endre:

- **Spillhastighet**: Juster `gameSpeed`-tilstanden i `Game.tsx`
- **Hoppehøyde**: Endre hoppeanimasjonen i `jump`-funksjonen
- **Hindringsfrekvens**: Endre tidsverdier i `generateObstacle`
- **Visuell Styling**: Oppdater CSS-filer for forskjellige temaer

## 🚀 Ytelsesfunksjoner

- **Optimalisert Spillløkke**: Bruker `requestAnimationFrame` for flytende 60fps
- **Effektiv Rendering**: Oppdaterer kun nødvendige komponenter
- **Minnehåndtering**: Riktig opprydding av intervaller og hendelseslyttere
- **Responsivt Design**: Tilpasser seg forskjellige skjermstørrelser

## 🎯 Fremtidige Forbedringer

- [ ] Lydeffekter og bakgrunnsmusikk
- [ ] Power-ups og spesielle evner
- [ ] Flere dinosaur-karakterer
- [ ] Høyeste poengsum vedvarende
- [ ] Mobil berøringskontroller
- [ ] Nattmodus-tema
- [ ] Partikkeleffekter

## 🤝 Bidrag

Du kan gjerne bidra til dette prosjektet ved å:

1. Forke repositoryet
2. Opprette en funksjonsgren
3. Gjøre endringene dine
4. Sende inn en pull request

## 📄 Lisens

Dette prosjektet er lisensiert under MIT-lisensen - se LICENSE-filen for detaljer.

## 🎮 Kos Deg!

Kos deg med å spille DINO DASH! Prøv å slå din høyeste poengsum og utfordre vennene dine. Spillet blir gradvis vanskeligere, så hold fokus og fortsett å løpe gjennom det førhistoriske landskapet!

---

**God Løping! 🦖💨🏃‍♂️**
