const express = require('express');
const bodyParser = require('body-parser');
const ld = require('@launchdarkly/node-server-sdk');


const app = express();
const port = 4004;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

//user context

const context = {
    kind: 'user',
    key: 'context-key-123abc'
  };



  const client = ld.init('sdk-5bb8da0f-8861-4d67-a2f4-c257055c2335', {
    streaming: true, // Enable streaming
  });


let menu = []

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
          menu = [
            { id: 1, temp: 'hot', name: 'Espresso', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Espresso_Single.jpg?impolicy=1by1_wide_topcrop_630'},
            { id: 2, temp: 'hot', name: 'Cappuccino', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Cappuccino.jpg?impolicy=1by1_wide_topcrop_630"},
            { id: 3, temp: 'hot', name: 'Latte', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeLatte.jpg?impolicy=1by1_wide_topcrop_630'},
            { id: 4, temp: 'hot', name: 'Americano', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeAmericano.jpg?impolicy=1by1_wide_topcrop_630' },
           
            { id: 5, temp: 'cold',name: 'Iced Coffee', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190422_IcedVanillaLatte.jpg?impolicy=1by1_wide_topcrop_630'},
            { id: 6, temp: 'cold',name: 'Matcha Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20181127_IcedMatchaGreenTeaLatte.jpg?impolicy=1by1_wide_topcrop_630"},
            { id: 8, temp: 'cold', name: 'Rasberry Refresher', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20221206_MangoDragonfruitRefreshers.jpg?impolicy=1by1_wide_topcrop_630' },
            { id: 9, temp: 'holiday', name: 'Chestnut Praline Latte', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190716_ChestnutPralineCreme.jpg?impolicy=1by1_wide_topcrop_630'},
            { id: 10, temp: 'holiday', name: 'Peppermint Mocha', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4613_PeppermintMochaFrappuccino-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630'},
            { id: 11, temp: 'holiday', name: 'Caramel Brulee Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/CaramelBruleeFrappuccino.jpg?impolicy=1by1_wide_topcrop_630"},
            { id: 12, temp: 'cold', name: 'Iced Gingerbread Chai', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4846_IcedGingerbreadOatmilkChai-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630term' },
           
            { id: 13, temp: 'food', name: 'Bacon, Sausage & Egg Wrap', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20191018_BaconSausageCageFreeEggWrap.jpg?impolicy=1by1_medium_630'},
            { id: 14, temp: 'food', name: 'Peppermint Mocha', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4613_PeppermintMochaFrappuccino-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630'},
            { id: 15, temp: 'food', name: 'Caramel Brulee Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/CaramelBruleeFrappuccino.jpg?impolicy=1by1_wide_topcrop_630"},
        ];
        } 
        else {
            menu = [
                { id: 1, temp: 'hot', name: 'Espresso', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Espresso_Single.jpg?impolicy=1by1_wide_topcrop_630'},
                { id: 2, temp: 'hot', name: 'Cappuccino', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_Cappuccino.jpg?impolicy=1by1_wide_topcrop_630"},
                { id: 3, temp: 'hot', name: 'Latte', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeLatte.jpg?impolicy=1by1_wide_topcrop_630'},
                { id: 4, temp: 'hot', name: 'Americano', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190617_CaffeAmericano.jpg?impolicy=1by1_wide_topcrop_630' },
               
                { id: 5, temp: 'cold',name: 'Iced Coffee', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190422_IcedVanillaLatte.jpg?impolicy=1by1_wide_topcrop_630'},
                { id: 6, temp: 'cold',name: 'Matcha Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/SBX20181127_IcedMatchaGreenTeaLatte.jpg?impolicy=1by1_wide_topcrop_630"},
                { id: 8, temp: 'cold', name: 'Rasberry Refresher', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20221206_MangoDragonfruitRefreshers.jpg?impolicy=1by1_wide_topcrop_630' },
                { id: 9, temp: 'holiday', name: 'Chestnut Praline Latte', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20190716_ChestnutPralineCreme.jpg?impolicy=1by1_wide_topcrop_630'},
                { id: 10, temp: 'holiday', name: 'Peppermint Mocha', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4613_PeppermintMochaFrappuccino-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630'},
                { id: 11, temp: 'holiday', name: 'Caramel Brulee Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/CaramelBruleeFrappuccino.jpg?impolicy=1by1_wide_topcrop_630"},
                { id: 12, temp: 'cold', name: 'Iced Gingerbread Chai', price: 2.00, img: 'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4846_IcedGingerbreadOatmilkChai-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630term' },
               
                { id: 13, temp: 'food', name: 'Bacon, Sausage & Egg Wrap', price: 3.50, img: 'https://globalassets.starbucks.com/digitalassets/products/food/SBX20191018_BaconSausageCageFreeEggWrap.jpg?impolicy=1by1_medium_630'},
                { id: 14, temp: 'food', name: 'Peppermint Mocha', price: 2.50, img:'https://globalassets.starbucks.com/digitalassets/products/bev/SBX20230612_4613_PeppermintMochaFrappuccino-onGreen-MOP_1800.jpg?impolicy=1by1_wide_topcrop_630'},
                { id: 15, temp: 'food', name: 'Caramel Brulee Latte', price: 3.00, img: "https://globalassets.starbucks.com/digitalassets/products/bev/CaramelBruleeFrappuccino.jpg?impolicy=1by1_wide_topcrop_630"},
            ];
          console.log('flag is off')
        }
      });
  });

  console.log(menu)
 


app.get('/api/products', (req, res) => {
    res.json(menu);
});



app.listen(process.env.PORT || port, () => {
    console.log(`Server running at http://localhost:${port}`);
});