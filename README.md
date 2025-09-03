# T-Rex Runner Game

A fun and engaging T-Rex Runner game built with React and TypeScript, inspired by Chrome's offline dinosaur game!

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

## 🎯 How to Play

- **Start**: Click the "Start Game" button or press any key
- **Jump**: Press the **SPACEBAR** or **CLICK** to make the dinosaur jump
- **Objective**: Avoid obstacles (cacti and birds) for as long as possible
- **Scoring**: Your score increases the longer you survive
- **Difficulty**: Game speed increases every 500 points

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

## 🎮 Game Mechanics

### Dinosaur Movement
- The dinosaur automatically runs forward
- Jump height and distance are optimized for smooth gameplay
- Running animation with leg and arm movement

### Obstacle Generation
- **Cacti**: Ground obstacles that appear randomly
- **Birds**: Flying obstacles at varying heights
- Obstacle frequency increases with game speed

### Collision Detection
- Precise hitbox detection for fair gameplay
- Game over when dinosaur hits any obstacle

### Progressive Difficulty
- Base speed: 5 units per frame
- Speed increases by 0.5 every 500 points
- Maximum speed capped at 15 units per frame

## 🔧 Customization

You can easily customize the game by modifying:

- **Game Speed**: Adjust the `gameSpeed` state in `Game.tsx`
- **Jump Height**: Modify the jump animation in the `jump` function
- **Obstacle Frequency**: Change timing values in `generateObstacle`
- **Visual Styling**: Update CSS files for different themes

## 🚀 Performance Features

- **Optimized Game Loop**: Uses `requestAnimationFrame` for smooth 60fps
- **Efficient Rendering**: Only updates necessary components
- **Memory Management**: Proper cleanup of intervals and event listeners
- **Responsive Design**: Adapts to different screen sizes

## 🎯 Future Enhancements

- [ ] Sound effects and background music
- [ ] Power-ups and special abilities
- [ ] Multiple dinosaur characters
- [ ] High score persistence
- [ ] Mobile touch controls
- [ ] Night mode theme
- [ ] Particle effects

## 🤝 Contributing

Feel free to contribute to this project by:

1. Forking the repository
2. Creating a feature branch
3. Making your changes
4. Submitting a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎮 Have Fun!

Enjoy playing the T-Rex Runner game! Try to beat your high score and challenge your friends. The game gets progressively harder, so stay focused and keep jumping!

---

**Happy Gaming! 🦖🏃‍♂️**
