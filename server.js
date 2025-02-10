const express = require('express');
const bodyParser = require('body-parser');
const ld = require('@launchdarkly/node-server-sdk');

const app = express();
const port = 4004;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const client = ld.init('sdk-5bb8da0f-8861-4d67-a2f4-c257055c2335');


const context = {
    "kind": 'user',
    "key": 'user-key-123abc',
    "name": 'Sandy'
};

client
  .waitForInitialization()
  .then(() => {
    console.log('*** SDK successfully initialized!');
    guardianRunner()
  })
  .catch((error) => {
    console.log(`*** SDK failed to initialize: ${error}`);
    process.exit(1);
  });


function randomKeyGenerator() {
    const characters = 'ABCDEFG';
    let randomValue = '';
    for (let i = 0; i < characters.length; i++) {
        randomValue += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    randomKey = randomValue;
    return randomValue;
}

console.log('this is ' + randomKeyGenerator());


function guardianRunner() {
    console.log(randomKey);
    //checks to see if the guarded release flag is active
        let i = 1;
        function loop() {
            if (i < 100000) {
                const newKey = randomKeyGenerator();
                const newContext = {
                    kind: "user",
                    key: newKey
                };
                console.log(newContext);
                const test = client.variation('release-new-product-api', newContext, false)
                client.track('error-count', newContext);
                i++;
                setTimeout(loop, 5);
            }
        }
        loop();
}


// Endpoint to handle chatbot requests
app.post('/api/chatbot', async (req, res) => {
    const { message } = req.body;
    const response = await askGPT(message);
    res.json({ response });
});

// Application code to show the feature
const menu = [
    { id: 1, temp: 'hot', name: 'Espresso', price: 2.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Espresso_Single.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 2, temp: 'hot', name: 'Cappuccino', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Cappuccino.jpg?impolicy=1by1_wide_topcrop_630" },
    { id: 3, temp: 'hot', name: 'Latte', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeLatte.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 4, temp: 'hot', name: 'Americano', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeAmericano.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 5, temp: 'cold', name: 'Iced Coffee', price: 2.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190422_IcedVanillaLatte.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 6, temp: 'cold', name: 'Matcha Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20181127_IcedMatchaGreenTeaLatte.jpg?impolicy=1by1_wide_topcrop_630" },
    { id: 8, temp: 'cold', name: 'Berry Refresher', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20221206_MangoDragonfruitRefreshers.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 9, temp: 'cold', name: 'Iced Tea', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190531_IcedBlackTea.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 10, temp: 'holiday', name: 'Chestnut Praline Latte', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190716_ChestnutPralineCreme.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 11, temp: 'holiday', name: 'Peppermint Mocha', price: 2.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4613_PeppermintMochaFrappuccino-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 12, temp: 'holiday', name: 'Caramel Brulee Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/CaramelBruleeFrappuccino.jpg?impolicy=1by1_wide_topcrop_630" },
    { id: 13, temp: 'holiday', name: 'Gingerbread Chai', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_7785_IcedPeppermintMocha-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630' },
    { id: 14, temp: 'food', name: 'Bacon, Sausage & Egg Wrap', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20191018_BaconSausageCageFreeEggWrap.jpg?impolicy=1by1_medium_630' },
    { id: 15, temp: 'food', name: 'Butter Croissant ', price: 2.50, img: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20210915_Croissant-onGreen.jpg?impolicy=1by1_medium_630' },
    { id: 16, temp: 'food', name: 'Blueberry Scone', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/food/SBX20181219_BlueberryScone.jpg?impolicy=1by1_medium_630" },
    { id: 17, temp: 'food', name: 'Coffee Cake', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/food/SBX20180511_ClassicCoffeeCake.jpg?impolicy=1by1_medium_630" },
];

app.get('/api/products', (req, res) => {
    res.json(menu);
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

app.listen(process.env.PORT || port, () => {
    console.log(`Server running at http://localhost:${port}`);
});