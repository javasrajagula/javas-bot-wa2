# Weather Dashboard Guide

## Introduction
This guide provides comprehensive documentation for the Weather Dashboard. It includes the features, commands, examples, and setup instructions.

## Features
- Displays current weather information.
- Provides forecasts for upcoming days.
- Supports multiple locations.
- User-friendly interface.

## Commands
- `/weather [location]`: Get current weather information for the specified location.
- `/forecast [location]`: Get weather forecast for the specified location.
- `/setlocation [location]`: Set a default location for weather queries.

## Examples
- To get current weather: 
  - Command: `/weather New York`
  - Output: `Current weather in New York: 22°C, Clear Sky`

- To set a default location: 
  - Command: `/setlocation Los Angeles`
  - Output: `Default location set to Los Angeles`

## Setup Instructions
1. **Clone the Repository**
   ```
   git clone https://github.com/javasrajagula/javas-bot-wa2.git
   cd javas-bot-wa2
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Configure Environment**
   - Create a `.env` file based on the provided `.env.example`.
   - Set your API keys and other necessary configuration.

4. **Run the Dashboard**
   ```
   npm start
   ```

5. **Access the Dashboard**
   - Open your browser and navigate to `http://localhost:3000`.

## Conclusion
This Weather Dashboard is designed to provide users with accurate and timely weather information. Follow the instructions in this guide to set up and use the dashboard effectively.