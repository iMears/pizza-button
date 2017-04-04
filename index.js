const dominos  = require('dominos');
const inquirer = require('inquirer');

require('dotenv').config();

const address = new dominos.Address({
  Type: 'Business',
  Street: process.env.STREET,
  City: process.env.CITY,
  Region: process.env.REGION,
  PostalCode: process.env.ADDRESS_POSTAL_CODE
});

const customer = new dominos.Customer({
  firstName: process.env.FIRST_NAME,
  lastName: process.env.LAST_NAME,
  address: address,
  email: process.env.EMAIL,
  phone: process.env.PHONE
});

const order = new dominos.Order({
  customer: customer,
  storeID: process.env.STORE_ID,
  deliveryMethod: 'Delivery'
});

const pizza = new dominos.Item({
  code: '14SCPFEAST', // Large (14") Hand Tossed Ultimate Pepperoni
  options: [],
  quantity: 1
});

order.addItem(pizza);

// order.validate((result) => {
//   console.log('====VALIDATE====')
//   console.log(result.result['Order'])
//   console.log('====END VALIDATE====')
// });


order.price((data) => {
  const amount = data.result['Order'].Amounts.Customer;

  const cardInfo = new order.PaymentObject();
  cardInfo.Amount = String(amount);
  cardInfo.Number = process.env.CARD_NUMBER;
  cardInfo.CardType = order.validateCC(process.env.CARD_NUMBER);
  cardInfo.Expiration = process.env.EXPIRATION;
  cardInfo.SecurityCode =  process.env.SECURITY_CODE;
  cardInfo.PostalCode = process.env.POSTAL_CODE;

  order.Payments.push(cardInfo);

  order.validate((result) => {
    console.log('====VALIDATE====')
    console.log(result.result.Order.StatusItems)
    console.log('====END VALIDATE====')
  });

});

// console.log('order.Amounts', order.Amounts)



// inquirer.prompt([{type: 'confirm', name: 'confirm', message: 'place order?'}]).then(
//   (answer) => {
//     if (!answer.confirm) return;

//     console.log('almost placed order!')
//     // order.place((result) => {
//     //   console.log("Order placed!", result);
//     // });
//   }
// );

