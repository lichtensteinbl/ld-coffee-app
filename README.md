# Coffee Shop Project

Welcome to the Toggle App! This LaunchDarkly demo app contains a web application with several pages:
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
- [Deployment](#deployment)

## Installation

1. **Prerequisites:**  
   - Node.js
   - npm 

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
PORT = your_port_here
```

Alternatively, set these variables in your hosting environment.

## Deployment
This project is automatically deployed via GitHub Actions when changes are pushed to the main branch.

### Environment Variables
You'll need to set up the following secrets in your GitHub repository:
- `LD_CLIENT_SIDE_KEY`
- `LD_SERVER_SDK_KEY`
- `LD_API_AUTH`

### Manual Deployment
To deploy manually:
1. Clone the repository
2. Create a .env file with required variables
3. Run `npm install`
4. Run `npm start`

## License

ISC
# coffee-app
