```markdown
# PWA Weather App

A Progressive Web Application (PWA) that allows users to check the weather forecast for different cities and receive push notifications.

## Features
- Check the weather for a selected city.
- Subscribe to push notifications.
- Ability to install the app as a PWA.
- Send push notifications with current weather information.

## Project Structure
- **`index.html`** — The main HTML file with the template.
- **`weather.js`** — Logic for fetching weather and user interaction.
- **`serviceWorker.js`** — Logic for Service Worker and push notifications.
- **`manifest.json`** — Manifest for PWA.

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/OlinykFS/WeatherPWA
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open the app in your browser at `http://localhost:3000`.

## Technologies
- **HTML/CSS** (using Tailwind CSS)
- **JavaScript** (for weather logic and push notifications)
- **Service Workers** for offline support and push notifications.
- **Push API** for sending notifications.

## Notes
- Make sure your browser supports Service Workers and Push API for push notifications to work properly.
- To send push notifications, you need to configure a server to send notifications (e.g., using the `web-push` library).
