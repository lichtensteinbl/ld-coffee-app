# Coffee Shop Project

Welcome to the Coffee Shop project! This repository contains a web application with several pages:
- **index.html** – The main landing page.
- **support.html** – A dedicated support chat page.
- **viewer.html & viewer-support.html** – Pages that run independent login and cart functionality for viewer experiences.
- **app.js, support.js, viewer.js** – JavaScript files handling global features, support chat, and viewer-specific logic.
- **styles.css** – Global styling.

## Table of Contents
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Feature Flags](#feature-flags)
- [Troubleshooting](#troubleshooting)

## Installation

1. **Prerequisites:**  
   - Node.js (version 16.20.2 recommended)
   - npm (version 8.19.4 recommended)

2. **Clone the repository:**
   ```bash
   git clone <YOUR_REPO_URL>
   cd coffee-shop
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Running the Server:**
   ```bash
   npm start
   ```

## Project Structure

## Usage

- Visit [http://localhost:4004](http://localhost:4004) to use the regular site.
- Visit [http://localhost:4004/viewer.html](http://localhost:4004/viewer.html) for the viewer mode.

## Configuration

- The server uses feature flags managed by LaunchDarkly.
- Modify the API and client keys in the code as needed.

## Environment Variables

Before starting the application, create a `.env` file in the root directory of the project with the following variables:

```
LD_CLIENT_SIDE_KEY=your_client_side_key_here
LD_API_FLAG=your_api_flag_here
LD_MEMBERSHIP_FLAG=your_membership_flag_here
LD_EXPERIMENT_FLAG=your_experiment_flag_here
LD_BANNER_FLAG=your_banner_flag_here
LD_PROJECT_KEY=your_project_key_here
LD_SERVER_SDK_KEY=your_server_sdk_key_here
PORT=3000
```

Alternatively, set these variables in your hosting environment.

## GitHub Deployment

This repository includes a GitHub Actions workflow in the file:
.github/workflows/deploy.yml

When changes are pushed to the `main` branch, the workflow will:
- Check out the repository
- Set up Node.js (version 16.x)
- Install dependencies using `npm install`
- Run tests (if available)
- Start the application using `npm start`

Customize the deployment step as needed for your hosting environment.

## License

ISC
