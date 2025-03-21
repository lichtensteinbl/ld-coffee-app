const express = require("express")
const bodyParser = require("body-parser")
const ld = require("@launchdarkly/node-server-sdk")
const { initAi } = require("@launchdarkly/server-sdk-ai")
const axios = require("axios")
const { default: OpenAI } = require("openai")
const SDK_Key = "sdk-7dd12d51-99e0-457d-852f-51404a3d7378"
const API_Auth = "api-bcd8e385-c2db-4e16-9a03-3f85e0eabcb9"
const OPENAI_API_KEY = `Bearer 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` // Replace with your actual OpenAI API key
const ENVIROMENTS_ID = `/environments/production/on`;

const app = express()
const port = 4004

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

const client = ld.init("sdk-7dd12d51-99e0-457d-852f-51404a3d7378")

const context = {
  kind: "user",
  key: "user-key-123abc",
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
    res.json({ message: "chatbot-context-triggered", context })
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({ error: "An error occurred while evaluating the flag" })
  }
})

async function aiConfigs(req, res, ldmessage) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: ldmessage }],
        max_tokens: 300,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: OPENAI_API_KEY,
        },
      }
    )

    const botMessage = response.data.choices[0].message.content.trim()
    console.log("OpenAI response:", botMessage)
    res.json({ response: botMessage })
  } catch (error) {
    console.error("OpenAI API Error:", error.response?.data || error.message)
    res.status(500).json({ 
      response: "Sorry, I am having trouble connecting to the AI service.",
      error: error.response?.data || error.message 
    })
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
  console.log(`Received request to toggle feature flag: ${featureFlagKey} to ${value}`)
  try {
    const url = `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`
    const response = await axios.patch(
      url,
      [
        {
          op: "replace",
          path: ENVIROMENTS_ID,
          value: value,
        },
      ],
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "api-bcd8e385-c2db-4e16-9a03-3f85e0eabcb9",
        },
      },
    )

    res.json({ message: "Feature flag toggled successfully", data: response.data })
  } catch (error) {
    console.error("Error while toggling feature flag:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })
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
          path: ENVIROMENTS_ID,
          value: value,
        },
      ],
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "api-bcd8e385-c2db-4e16-9a03-3f85e0eabcb9",
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
  console.log(`Received request to toggle membership flag: ${featureFlagKey} to ${value}`)
  try {
    const url = `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`
    const response = await axios.patch(
      url,
      [
        {
          op: "replace",
          path: ENVIROMENTS_ID,
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
    console.error("Error while toggling membership flag:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    })
    res.status(500).json({ message: "Failed to toggle membership flag" })
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
          path: ENVIROMENTS_ID,
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
          path: ENVIROMENTS_ID,
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

// Add a simple GET endpoint to verify the server is running
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running" })
})

// Start the server
app.listen(process.env.PORT || port, () => {
  console.log(`Server running at http://localhost:${port}`)
})

// Initialize the app
initializeApp()

