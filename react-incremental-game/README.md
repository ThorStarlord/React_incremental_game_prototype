# React Incremental Game

This project is a prototype for a React-based incremental game. It features various gameplay mechanics, including traits, NPC interactions, combat, inventory management, player stats, essence generation, minion management, faction dynamics, questing, and an expansive game world.

## Project Structure

The project is organized into the following main directories:

- **public/**: Contains static files such as the main HTML file, manifest, and robots.txt.
- **src/**: The source code for the application, including components, hooks, styles, and features.
  - **features/**: Core features of the game, organized into subdirectories for traits, NPCs, combat, inventory, player, essence, minions, factions, quests, and world.
  - **shared/**: Reusable utilities and components.
  - **context/**: Global state management files, including actions and reducers.
  - **layout/**: Layout components for the application.
  - **pages/**: Top-level pages for the application.
  - **config/**: Configuration constants for the game.
  - **services/**: Placeholder for API or external services.
  - **tests/**: Centralized tests for the application.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd react-incremental-game
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Features

- **Traits**: Customize your character with various traits that affect gameplay.
- **NPCs**: Interact with non-player characters to engage in quests and build relationships.
- **Combat**: Engage in battles with enemies using a dynamic combat system.
- **Inventory**: Manage items and resources collected throughout the game.
- **Player Stats**: Track and improve your character's stats and abilities.
- **Essence Generation**: Collect and utilize essence for various game mechanics.
- **Minions**: Recruit and manage minions to assist you in your journey.
- **Factions**: Join or create factions to gain unique benefits and engage in faction-based gameplay.
- **Quests**: Complete quests to earn rewards and progress through the game.
- **World Exploration**: Explore a vast game world filled with towns, dungeons, and regions.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.