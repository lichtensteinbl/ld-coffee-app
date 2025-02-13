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

const context = {
  kind: 'user',
  key: 'user-key-123abc',
  name: 'Sandy'
};

// Endpoint to trigger sadContext


app.post('/api/sad-context', async (req, res) => {
  try {
      // Update context
      
      context.mood = 'sad';
     // console.log('Context:', context);

      // Evaluate the flag (assuming client.variation is asynchronous)
      const ldBot = await client.variation('coffee-bot', context, false);
      console.log('Flag Value:', ldBot);
      const botMessage =  ldBot.messages[0].content


      // Send response
      res.json({ message: 'sad context triggered', ldBot });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while evaluating the flag' });
      
  }


  
});






app.post('/api/happy-context', async (req, res) => {
  try {
      // Update context
      
      context.mood = 'happy';
     // console.log('Context:', context);
      // Evaluate the flag (assuming client.variation is asynchronous)
      const ldBot = await client.variation('coffee-bot', context, false);
      console.log('Flag Value:', ldBot);
      const botMessage =  ldBot.messages[0].content


      // Send response
      res.json({ message: 'Happy context triggered', ldBot });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while evaluating the flag' });
      
  }
});



async function aiConfigs(req, res, ldmessage) {
  const { message } = req.body;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: ldmessage }], // Use the 'message' from the request body
        max_tokens: 500
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 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` // Replace with your actual API key
        }
    });

    const botMessage = response.data.choices[0].message.content.trim();
    console.log('this is the LD bot talking' + botMessage)
    res.json({ response: botMessage });
} catch (error) {
    console.error('Error:', error);
    res.json({ response: 'Sorry, I am having trouble understanding you right now.' });
}
}

app.post('/api/chatbot', async (req, res) => {

  console.log('is htis hitting?')
  const ldBot = await client.variation('coffee-bot', context, false);
  const ldPrompt =  await ldBot.messages[0].content

  await aiConfigs(req, res, ldPrompt); // Await the function and pass req and res
});

























// Endpoint to toggle feature flags
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

app.post('/api/toggle-experimentation-flag', async (req, res) => {
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

app.post('/api/toggle-experimentation-flag', async (req, res) => {
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

app.post('/api/toggle-bad-api', async (req, res) => {
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


// Initialize the LaunchDarkly SDK and start the guardian runner
async function initializeApp() {
    try {
        await client.waitForInitialization();
        console.log('*** SDK successfully initialized!');

        // Start the guardian runner
        await guardianRunner();

        // Test a feature flag
        const ldBot = await client.variation('coffee-bot', context, false);
        console.log(context)
        const botMessage =  ldBot.messages[0].content
        console.log('Feature flag value:', botMessage);
    } catch (error) {
        console.error(`*** SDK failed to initialize: ${error}`);
        process.exit(1);
    }
}







// Guardian runner function
async function guardianRunner() {
    let i = 1;

    async function loop() {
        if (i < 10) {
            const newKey = randomKeyGenerator();
            const newContext = {
                kind: "user",
                key: newKey
            };
            //console.log('New context:', newContext);

            try {
                const test = await client.variation('release-new-product-api', newContext, false);
                await client.track('error-count', newContext);
                //console.log('Variation result:', test);
            } catch (error) {
               // console.error('Error in guardianRunner:', error);
            }

            i++;
            setTimeout(loop, 1000); // Increase delay to 1 second
        }
    }

    loop();
}

// Helper function to generate random keys
function randomKeyGenerator() {
    const characters = 'ABCDEFG';
    let randomValue = '';
    for (let i = 0; i < characters.length; i++) {
        randomValue += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomValue;
}

// Endpoint to handle chatbot requests

// Reset Cart on Page Reload
app.get('/api/reset-cart', (req, res) => {
    cart = [];
    res.status(200).json({ message: 'Cart reset' });
});

// Serve support page
app.get('/support.html', (req, res) => {
    res.sendFile(__dirname + '/public/support.html');
});

// Start the server
app.listen(process.env.PORT || port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Initialize the app
initializeApp();