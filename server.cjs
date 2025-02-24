const express = require("express")
const bodyParser = require("body-parser")
const ld = require("@launchdarkly/node-server-sdk")
const { initAi } = require("@launchdarkly/server-sdk-ai")
const axios = require("axios")
const SDK_Key = "sdk-5bb8da0f-8861-4d67-a2f4-c257055c2335"
const API_Auth = "api-bcd8e385-c2db-4e16-9a03-3f85e0eabcb9"

const app = express()
const port = 4004

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

const client = ld.init(SDK_Key)

const context = {
  kind: "user",
  key: "user-key-123abc",
  name: "Sandy",
  temperature: "low",
}

// Endpoint to trigger chatbot context
app.post("/api/chatbot-context", async (req, res) => {
  try {
    // Log the request body to debug
    const { temperature, tokens } = req.body // Destructure temperature and tokens from the request body
    context.temperature = temperature.toLowerCase()
    context.language = tokens.toLowerCase()
    // Update context with the new temperature
    context.tokens = tokens // Update context with the new tokens value
    console.log(context)

    // Send response
    res.json({ message: "Happy context triggered", context })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ error: "An error occurred while evaluating the flag" })
  }
})

async function aiConfigs(req, res, ldmessage) {
  const { message } = req.body
  //const { tokens } = context.tokens;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: ldmessage }], // Use the 'message' from the request body
        max_tokens: 300,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`, // Replace with your actual API key
        },
      },
    )

    const botMessage = response.data.choices[0].message.content.trim()
    console.log("this is the LD bot talking" + botMessage)
    res.json({ response: botMessage })
  } catch (error) {
    console.error("Error:", error)
    res.json({ response: "Sorry, I am having trouble understanding you right now." })
  }
}

app.post("/api/chatbot", async (req, res) => {
  console.log("is htis hitting?")
  const ldBot = await client.variation("coffee-bot", context, false)
  const ldPrompt = await ldBot.messages[0].content

  await aiConfigs(req, res, ldPrompt) // Await the function and pass req and res
})

// Endpoint to toggle feature flags
app.post("/api/toggle-feature-flag", async (req, res) => {
  const { projectKey, featureFlagKey, value } = req.body
  console.log(`Toggling ${featureFlagKey} to ${value}`)
  try {
    // Ensure the environment id here matches your actual LaunchDarkly environment
    const environmentId = "production"
    const url = `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`
    const response = await axios.patch(
      url,
      [
        {
          op: "replace",
          path: `/environments/${environmentId}/on`,
          value: value,
        },
      ],
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: API_Auth,
        },
      },
    )

    res.json({ message: "Feature flag toggled successfully", data: response.data })
  } catch (error) {
    // Log full error details for debugging
    console.error("Error toggling feature flag:", error.response?.data || error.message)
    res.status(500).json({ message: "Failed to toggle feature flag" })
  }
})

app.post("/api/toggle-experimentation-flag", async (req, res) => {
  const { projectKey, featureFlagKey, value } = req.body

  try {
    const url = `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`
    const response = await axios.patch(
      url,
      [
        {
          op: "replace",
          path: `/environments/production/on`,
          value: value,
        },
      ],
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: API_Auth,
        },
      },
    )

    res.json({ message: "Feature flag toggled successfully", data: response.data })
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message)
    res.status(500).json({ message: "Failed to toggle feature flag" })
  }
})

app.post("/api/toggle-membership-flag", async (req, res) => {
  const { projectKey, featureFlagKey, value } = req.body

  try {
    const url = `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`
    const response = await axios.patch(
      url,
      [
        {
          op: "replace",
          path: `/environments/production/on`,
          value: value,
        },
      ],
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: API_Auth, // Updated from API_AUTH to API_Auth
        },
      },
    )

    res.json({ message: "Feature flag toggled successfully", data: response.data })
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message)
    res.status(500).json({ message: "Failed to toggle feature flag" })
  }
})

app.post("/api/toggle-experimentation-flag", async (req, res) => {
  const { projectKey, featureFlagKey, value } = req.body

  try {
    const url = `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`
    const response = await axios.patch(
      url,
      [
        {
          op: "replace",
          path: `/environments/production/on`,
          value: value,
        },
      ],
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: API_Auth,
        },
      },
    )

    res.json({ message: "Feature flag toggled successfully", data: response.data })
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message)
    res.status(500).json({ message: "Failed to toggle feature flag" })
  }
})

app.post("/api/toggle-bad-api", async (req, res) => {
  const { projectKey, featureFlagKey, value } = req.body

  try {
    const url = `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`
    const response = await axios.patch(
      url,
      [
        {
          op: "replace",
          path: `/environments/production/on`,
          value: value,
        },
      ],
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: API_Auth,
        },
      },
    )

    res.json({ message: "Feature flag toggled successfully", data: response.data })
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message)
    res.status(500).json({ message: "Failed to toggle feature flag" })
  }
})

// Initialize the LaunchDarkly SDK and start the guardian runner
async function initializeApp() {
  try {
    await client.waitForInitialization()
    console.log("*** SDK successfully initialized!")

    // Start the guardian runner
    await guardianRunner()

    // Test a feature flag
    const ldBot = await client.variation("coffee-bot", context, false)
    console.log(context)
    const botMessage = ldBot.messages[0].content
    //console.log('Feature flag value:', botMessage);
  } catch (error) {
    console.error(`*** SDK failed to initialize: ${error}`)
    process.exit(1)
  }
}

// Guardian runner function
async function guardianRunner() {
  let i = 1

  async function loop() {
    if (i < 10) {
      const newKey = randomKeyGenerator()
      const newContext = {
        kind: "user",
        key: newKey,
      }
      //console.log('New context:', newContext);

      try {
        const test = await client.variation("release-new-product-api", newContext, false)
        await client.track("error-count", newContext)
        //console.log('Variation result:', test);
      } catch (error) {
        // console.error('Error in guardianRunner:', error);
      }

      i++
      setTimeout(loop, 1000) // Increase delay to 1 second
    }
  }

  loop()
}

// Helper function to generate random keys
function randomKeyGenerator() {
  const characters = "ABCDEFG"
  let randomValue = ""
  for (let i = 0; i < characters.length; i++) {
    randomValue += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return randomValue
}

// Endpoint to handle chatbot requests

// Add this new endpoint for handling cart additions
let cart = []

app.post("/api/cart", (req, res) => {
  const { id } = req.body
  cart.push(id)
  res.json({ message: "Item added to cart", cart })
})

app.get("/api/cart", (req, res) => {
  res.json(cart)
})

// Reset Cart on Page Reload
app.get("/api/reset-cart", (req, res) => {
  cart = []
  res.status(200).json({ message: "Cart reset" })
})

// Serve support page
app.get("/support.html", (req, res) => {
  res.sendFile(__dirname + "/public/support.html")
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  console.log("Health check received")
  res.status(200).json({ message: "Server is running" })
})

// Start the server
const server = app.listen(process.env.PORT || port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
server.setTimeout(0) // Disables timeout or set a large number (in ms)

// Initialize the app
initializeApp()

