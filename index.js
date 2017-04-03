const dominos  = require('dominos');
const inquirer = require('inquirer');

require('dotenv').config();


const customer = new dominos.Customer({
  firstName: process.env.FIRST_NAME,
  lastName: process.env.LAST_NAME,
  address: address,
  email: process.env.EMAIL,
  phone: parseInt(process.env.PHONE)
});

const order = new dominos.Order({
  customer: customer,
  storeID: 8158,
  deliveryMethod: 'Delivery'
});

const pizza = new dominos.Item({
  code: '12SCPFEAST', // Medium (12") Hand Tossed Ultimate Pepperoni
  options: [],
  quantity: 1
});

order.addItem(pizza);

// order.price((price) => {
//   console.log('====PRICE====')
//   console.log(price.result['Order'])
//   console.log('====END PRICE====')
// });

const cardInfo = new order.PaymentObject({
  Account: order.Amounts.Customer,
  Number: process.env.CARD_NUMBER,
  CardType: order.validateCC(process.env.CARD_NUMBER),
  Expiration: process.env.EXPIRATION, //  01/15 just the numbers "01/15".replace(/\D/g,'');
  SecurityCode: process.env.SECURITY_CODE,
  PostalCode: process.env.POSTAL_CODE,
});

order.Payments.push(cardInfo);

order.validate((result) => {
  console.log('====VALIDATE====')
  console.log(result.result['Order'])
  console.log('====END VALIDATE====')
});

inquirer.prompt([{type: 'confirm', name: 'confirm', message: 'place order?'}]).then(
  (answer) => {
    if (!answer.confirm) return;

    console.log('almost placed order!')
    // order.place((result) => {
    //   console.log("Order placed!", result);
    // });
  }
);

