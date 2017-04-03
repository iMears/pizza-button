const dominos = require('dominos');
const fs      = require('fs');
const twilio  = require('twilio');

require('dotenv').config();

module.exports.findNearbyStore = findNearbyStore;
module.exports.getMenu         = getMenu;
module.exports.trackOrder      = trackOrder;

function findNearbyStore() {
  const address = new dominos.Address({
    Street: process.env.STREET,
    City: process.env.CITY,
    Region: process.env.REGION,
    PostalCode: parseInt(process.env.POSTAL_CODE)
  });

  const type = 'Delivery';

  dominos.Util.findNearbyStores(address, type, (storeData) => {
    console.log(storeData.result['Stores'][0]);
  });
}

function getMenu(storeId) {
  const myStore = new dominos.Store({ ID: storeId });

  myStore.getFriendlyNames((storeData) => {
    fs.writeFile('menu.json', JSON.stringify(storeData), 'utf8', (err, data) => {
      if (err) console.error(err);

      console.log('Success! Saved menu to menu.json');
    });
  });
}

function trackOrder() {
  dominos.Track.byPhone(process.env.PHONE, (pizzaData) => {
    const client = new twilio.RestClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    const textMsg = {
      body: JSON.stringify(pizzaData),
      to: `+1${process.env.PHONE}`,
      from: `+${process.env.TWILIO_PHONE}`
    };

    client.messages.create(textMsg, (err, msg) => {
      if (err) console.warn(err);

      console.log('success', msg);
    });
  });
}