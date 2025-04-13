# dev10x-mtg-deckbuilder

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-repo-url)
[![Version](https://img.shields.io/badge/version-0.0.0-blue)](https://github.com/your-repo-url)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## Table of Contents
- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description
**dev10x-mtg-deckbuilder** is a digital deck builder designed specifically for Magic: The Gathering players. This application provides an intuitive and dynamic interface to view, build, and manage your decks efficiently. Key features include:
- A comprehensive card library with filtering, sorting, and detailed card views.
- A dual-panel deck building interface enabling instant card addition, removal, and real-time validation.
- Deck management capabilities to save and review your deck lists along with vital statistics.

## Tech Stack
- **Frontend:** Angular 19, Angular Material, ag-grid  
- **Backend:** Spring Boot  
- **Database:** PostgreSQL or MongoDB  
- **Authentication:** Amazon Cognito  
- **CI/CD:** AWS services

## Getting Started Locally
To set up the project on your local machine, follow these instructions:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo-url/dev10x-mtg-deckbuilder.git
   cd dev10x-mtg-deckbuilder
   ```

2. **Install dependencies:**
   Ensure you have Node.js and npm installed. Then run:
   ```bash
   npm install
   ```

3. **Run the application:**
   Start the development server with:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:4200`.

4. **Additional commands:**
   - `npm run build` to build the project.
   - `npm run watch` for continuous building in development mode.
   - `npm run test` to run unit tests.
   - `npm run lint` to check code quality.

## Available Scripts
Below are the npm scripts available in this project:
- **ng:** Executes Angular CLI commands.
- **start:** Runs `ng serve` to start a local development server.
- **build:** Builds the application.
- **watch:** Builds the project in watch mode with development configuration.
- **test:** Runs the unit tests.
- **lint:** Checks the code for linting issues.

## Project Scope
This project delivers a Minimum Viable Product (MVP) for a Magic: The Gathering deck builder. The core functionalities include:
- Displaying a paginated card library with various filtering and sorting options.
- Allowing users to build decks by adding or removing cards in real-time.
- Validating the deck according to rules (minimum 60 cards, no more than 4 copies of non-land cards).
- Managing saved decks with detailed statistics and visual feedback.

Advanced features such as recommendation systems, picture integration, and full authentication are planned for future enhancement but are not part of the initial scope.

## Project Status
This project is currently in the initial development/MVP phase (version 0.0.0). Future iterations will focus on expanding features, refining UI/UX, and integrating backend services.

## License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

Feel free to contribute, raise issues, or suggest improvements to enhance the functionality and user experience of dev10x-mtg-deckbuilder.
