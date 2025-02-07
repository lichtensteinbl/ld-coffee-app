const express = require('express');
const bodyParser = require('body-parser');
const ld = require('@launchdarkly/node-server-sdk');


const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let cart = [];

//Construct User Context

let planType = ['standard', 'gold'];
let cities = ["New York", "Chicago"];
let deviceType = ["mobile", "desktop"];


plan = planType[Math.floor(Math.random() * planType.length)];
city = planType[Math.floor(Math.random() * cities.length)];
device = cities[Math.floor(Math.random() * deviceType.length)];


const context = {
    kind: 'user',
    key: 'context-key-123abc',
    plan: plan,
    city: city,
    device:  device,
    privateAttributes: ['device'],
  };

  


  const client = ld.init('sdk-5bb8da0f-8861-4d67-a2f4-c257055c2335', {
    streaming: true, // Enable streaming
  });


let coffeeProducts = []

client.on('ready', () => {
    console.log(context)
    
    client.variation('release-holiday-drinks', context, true,
      (err, showFeature) => {
    if (err) {
        console.error('Error fetching feature flag:', err);
        return;
    }

    if (showFeature) {
          // application code to show the feature
          coffeeProducts = [
            { id: 1, temp: 'hot', name: 'Espresso', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Espresso_Single.jpg?impolicy=1by1_wide_topcrop_630'},
            { id: 2, temp: 'hot', name: 'Cappuccino', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Cappuccino.jpg?impolicy=1by1_wide_topcrop_630"},
            { id: 3, temp: 'hot', name: 'Latte', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeLatte.jpg?impolicy=1by1_wide_topcrop_630'},
            { id: 4, temp: 'hot', name: 'Americano', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeAmericano.jpg?impolicy=1by1_wide_topcrop_630' },
            { id: 5, temp: 'cold',name: 'Iced Coffee', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190422_IcedVanillaLatte.jpg?impolicy=1by1_wide_topcrop_630'},
            { id: 6, temp: 'cold',name: 'Matcha Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20181127_IcedMatchaGreenTeaLatte.jpg?impolicy=1by1_wide_topcrop_630"},
            { id: 8, temp: 'cold', name: 'Rasberry Refresher', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20221206_MangoDragonfruitRefreshers.jpg?impolicy=1by1_wide_topcrop_630' },
            { id: 11, temp: 'holiday', name: 'Chestnut Praline Latte', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190716_ChestnutPralineCreme.jpg?impolicy=1by1_wide_topcrop_630'},
            { id: 9, temp: 'holiday', name: 'Peppermint Mocha', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4613_PeppermintMochaFrappuccino-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630'},
            { id: 10, temp: 'holiday', name: 'Caramel Brulee Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/CaramelBruleeFrappuccino.jpg?impolicy=1by1_wide_topcrop_630"},
            { id: 12, temp: 'cold', name: 'Iced Gingerbread Chai', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4846_IcedGingerbreadOatmilkChai-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630term' },
 
        ];
        } 
        else {
            coffeeProducts = [
                { id: 1, temp: 'hot', name: 'Espresso', price: 2.50, img:'https://www.caffesociety.co.uk/assets/recipe-images/espresso-small.jpg'},
                { id: 2, temp: 'hot', name: 'Cappuccino', price: 3.00, img: "https://www.caffesociety.co.uk/assets/recipe-images/cappuccino-small.jpg"},
                { id: 3, temp: 'hot', name: 'Latte', price: 3.50, img: 'https://www.caffesociety.co.uk/assets/recipe-images/latte-small.jpg'},
                { id: 4, temp: 'hot', name: 'Americano', price: 2.00, img: 'https://www.caffesociety.co.uk/assets/recipe-images/americano-small.jpg' },
                { id: 5, name: 'Iced Coffee', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190422_IcedVanillaLatte.jpg?impolicy=1by1_wide_topcrop_630'},
                { id: 6, name: 'Matcha Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20181127_IcedMatchaGreenTeaLatte.jpg?impolicy=1by1_wide_topcrop_630"},
                { id: 7, name: 'Cortado', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/Cortado.jpg?impolicy=1by1_wide_topcrop_630'},
                { id: 8, name: 'Rasberry Refresher', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20221206_MangoDragonfruitRefreshers.jpg?impolicy=1by1_wide_topcrop_630' },
              
            ];
          console.log('flag is off')
        }
      });
  });

  console.log(coffeeProducts)
 


app.get('/api/products', (req, res) => {
    res.json(coffeeProducts);
});

app.post('/api/cart', (req, res) => {
    const product = coffeeProducts.find(p => p.id === req.body.productId);
    if (product) {
        cart.push(product);
        res.json({ success: true, cart });
    } else {
        res.status(404).json({ success: false, message: 'Product not found' });
    }
});

app.get('/api/cart', (req, res) => {
    res.json(cart);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${port}`);
});