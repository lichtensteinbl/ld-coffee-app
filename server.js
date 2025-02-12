const express = require('express');
const bodyParser = require('body-parser');
const ld = require('@launchdarkly/node-server-sdk');
const { initAi } = require('@launchdarkly/server-sdk-ai');
const axios = require('axios');

const app = express();
const port = 4004;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const client = ld.init('sdk-5bb8da0f-8861-4d67-a2f4-c257055c2335');
const aiClient = initAi(client);

const context = { 
    "kind": 'user',
    "key": 'user-key-123abc',
    "name": 'Sandy'
};

const aiConfig = aiClient.config(
  'coffee-bot',
  context,
  {
    model: {
      name: 'gpt-4',
    },
  },
  { myVariable: 'My User Defined Variable' },
);

const tracker = aiConfig.tracker;
console.log('this is ' + tracker);

async function getCompletion() {
  try {
    const completion = await tracker.trackOpenAIMetrics(async () => {
      return client.chat.completions.create({
        messages: aiConfig.messages || [],
        model: aiConfig.model && aiConfig.model.name ? aiConfig.model.name : 'gpt-4',
        temperature: aiConfig.model && aiConfig.model.parameters && aiConfig.model.parameters.temperature ? aiConfig.model.parameters.temperature : 0.5,
        max_tokens: aiConfig.model && aiConfig.model.parameters && aiConfig.model.parameters.maxTokens ? aiConfig.model.parameters.maxTokens : 4096,
      });
    });
    return completion;
  } catch (error) {
    console.error('Error getting completion:', error);
  }
}

app.post('/api/toggle-feature-flag', async (req, res) => {
  const { projectKey, featureFlagKey, value } = req.body;

  try {
      const url = `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${featureFlagKey}`;
      const response = await axios.patch(
          url,
          [
              {
                  op: 'replace',
                  path: `/environments/production/on`,
                  value: value,
              },
          ],
          {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'api-78c8185b-3e24-4e42-850b-fce3db6ecd1d',
              },
          }
      );

      res.json({ message: 'Feature flag toggled successfully', data: response.data });
  } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Failed to toggle feature flag' });
  }
});

client
  .waitForInitialization()
  .then(() => {
    console.log('*** SDK successfully initialized!');
    guardianRunner();
  })
  .catch((error) => {
    console.log(`*** SDK failed to initialize: ${error}`);
    process.exit(1);
  });

function guardianRunner() {
  
  let i = 1;
  function loop() {
      if (i < 10) {
          const newKey = randomKeyGenerator();
          const newContext = {
              kind: "user",
              key: newKey
          };
          console.log(newContext);
          const test = client.variation('release-new-product-api', newContext, false);
          client.track('error-count', newContext);
          i++;
          setTimeout(loop, 5);
      }
  }
  loop();
}

function randomKeyGenerator() {
    const characters = 'ABCDEFG';
    let randomValue = '';
    for (let i = 0; i < characters.length; i++) {
        randomValue += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomValue;
}

app.listen(process.env.PORT || port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// Endpoint to handle chatbot requests


const prompts = {
  orderManagement: `
    The user has asked about their order. The possible inquiries could include:
    - Order status tracking
    - Issues with order confirmation
    - Modifying or canceling an order
    - Delivery or pickup issues

    Provide clear, helpful responses based on the context.
    For example:
    - 'I just placed an order but didn’t receive a confirmation email. Can you help?'
    - 'How can I modify or cancel an order I just placed?'
    - 'Can you help me track my order? The app says it's in progress, but I haven't received any updates.'
  `,
  paymentBilling: `
    The user is having trouble with their payment or billing. The possible inquiries could include:
    - Payment issues or failed transactions
    - Double charges
    - Adding or updating payment methods
    - Redeeming loyalty points

    Provide assistance based on the scenario, guiding them on how to resolve the issue.
    For example:
    - 'I was charged twice for my last order. Can you assist with a refund?'
    - 'Why is my payment not going through on the app?'
    - 'Can I use loyalty points to pay for my order? How do I redeem them?'
  `,
  accountIssues: `
    The user is having trouble with their account. Possible issues could be:
    - Login issues
    - Password recovery
    - Account details updates

    Guide the user on how to solve their account-related problems.
    For example:
    - 'I forgot my password. Can you help me reset it?'
    - 'I’m having trouble logging into my coffee shop account. Could you assist me?'
    - 'How can I update my account details, such as my address or phone number?'
  `,
  rewardsPromotions: `
    The user wants information about the rewards program or current promotions. Possible scenarios include:
    - Earning loyalty points
    - Redeeming rewards
    - Current discounts or offers

    Provide helpful and clear information on the program and promotions.
    For example:
    - 'I want to know more about the loyalty program. How can I earn points?'
    - 'Can you tell me if there are any current promotions or discounts available?'
  `,
  productQueries: `
    The user has questions about the coffee products or menu. Possible inquiries could be:
    - Ingredients or customization options
    - Dietary restrictions (e.g., dairy-free, nut-free)
    - Product availability

    Respond with accurate and detailed information about the products offered.
    For example:
    - 'What’s in your signature coffee blend? I’d love to try it.'
    - 'Do you offer dairy-free or plant-based milk options?'
    - 'I’m allergic to nuts. Can you help me with a list of nut-free drinks and pastries?'
  `,
  appNavigation: `
    The user needs help navigating the app or using certain features. Common issues could include:
    - Reordering favorite drinks
    - Finding nearby locations
    - Using delivery features
    - Leaving feedback

    Assist with clear instructions or solutions to make the app experience easier.
    For example:
    - 'How do I reorder my favorite coffee from previous purchases?'
    - 'How do I leave feedback for my recent coffee order or delivery experience?'
  `,
  feedbackComplaints: `
    The user wants to leave feedback or file a complaint. Address their issue respectfully and offer solutions. Possible inquiries could include:
    - Submitting feedback on an order or service
    - Expressing dissatisfaction

    Provide appropriate steps to address the complaint and improve the customer experience.
    For example:
    - 'I had a bad experience with my last order, can I submit a complaint or feedback through the app?'
    - 'I was unhappy with the quality of the coffee I received. What can I do?'
  `,
  generalInfo: `
    The user needs general information about the coffee shop. This could include:
    - Hours of operation
    - Gift card availability
    - Group orders or event pre-orders

    Provide basic, helpful info on how to access services.
    For example:
    - 'What are your hours of operation?'
    - 'Do you offer gift cards through the app?'
    - 'Can I place a group order or pre-order for an event through the app?'
  `
};


app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;
  let prompt;

  if (message.includes("order")) {
      prompt = prompts.orderManagement;
  } else if (message.includes("payment")) {
      prompt = prompts.paymentBilling;
  } else if (message.includes("account")) {
      prompt = prompts.accountIssues;
  } else if (message.includes("rewards") || message.includes("promotion")) {
      prompt = prompts.rewardsPromotions;
  } else if (message.includes("coffee") || message.includes("menu")) {
      prompt = prompts.productQueries;
  } else if (message.includes("navigate") || message.includes("feature")) {
      prompt = prompts.appNavigation;
  } else if (message.includes("feedback") || message.includes("complaint")) {
      prompt = prompts.feedbackComplaints;
  } else {
      prompt = prompts.generalInfo;
  }

  try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500
      }, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer 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` // Replace with your actual API key
          }
      });

      const botMessage = response.data.choices[0].message.content.trim();
      res.json({ response: botMessage });
  } catch (error) {
      console.error('Error:', error);
      res.json({ response: 'Sorry, I am having trouble understanding you right now.' });
  }
});

let cart = [];

app.post('/api/cart', (req, res) => {
  const { id } = req.body;
  const item = menu.find(product => product.id === id);
  if (item) {
      cart.push(item);
      res.status(200).json({ message: 'Item added to cart', cart });
  } else {
      res.status(404).json({ message: 'Item not found' });
  }
});

// Reset Cart on Page Reload
app.get('/api/reset-cart', (req, res) => {
  cart = [];
  res.status(200).json({ message: 'Cart reset' });
});

app.get('/support.html', (req, res) => {
  res.sendFile(__dirname + '/public/support.html');
});

