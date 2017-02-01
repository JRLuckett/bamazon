# Bamazon
1. Initializing app with node logs a table with all values from database:
![image 1]
(./images/1.png)
```javascript
    var table = new cliTable({
        head: ['ID', 'Product Name', 'Department', 'Price', 'Stock'],
        colWidths: [5, 30, 15, 10, 10]
    });
    for (var i = 0; i < res.length; i++) {
        table.push(
            [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
        );
    }
      console.log(table.toString());
```
2. Prompted to choose item for purchase by ID and then the quantity of that item:
![image 2]
(./images/2.png)
```javascript
inquirer.prompt([{
        type: 'name',
        message: 'What is the ID of the product you want to buy?',
        name: 'itemNumber'
    },
    {
        type: 'name',
        message: 'How many units would you like to buy?',
        name: 'quantity'
    }
])
```
3. Printout of the quantity and name of the item(s) being purchased and the subtotal, which is the total cost of like-kind items.  A prompt is then printed that asks if the user would like to make any further purchases. If **YES**, the product table is printed and the the user is prompted like above to choose ID and quantity. If **NO**, a total of the complete cost of the purchase is printed, followed by a thank you:
![image 3]
(./images/3.png)
```javascript
inquirer.prompt([{
    type: 'list',
    message: 'Would you like to make another purchase?',
    choices: ["YES", "NO"],
    name: 'operation'
}]).then(function(operation) {
    if (operation.operation === "YES") {
        newTotal += total;
        console.log(newTotal);
        itemsToBuy();
    } else {
      newTotal += total;
        console.log('Total = $' + newTotal);
        console.log('Thank you!');
        process.exit();
    }
});
```
4. Initializing the app after a purchase is made prints the product table with new stock quantities based on the prior purchase because the database has been updated:
![image 4]
(./images/4.png)
```javascript
stock -= amount;
connection.query('UPDATE products SET stock_quantity =? WHERE id=?',[stock,itemNumber.itemNumber], function(err, res){
  if (err) throw err;
});
total = (res[0].price * amount);
console.log("Purchased", amount, res[0].product_name + "(s)");
console.log("Subtotal = $" + total);
```
5. If a user wants to purchase a greater quantity of goods than there is stock, they are prompted **Insufficient Quantity** and asked if they would like to make a different purchase:
![image 5]
(./images/5.png)
```javascript
console.log("Insufficient quantity!");
inquirer.prompt([{
    type: 'list',
    message: 'Would you like to make a different purchase?',
    choices: ["YES", "NO"],
    name: 'operation'
}]).then(function(operation) {
    if (operation.operation === "YES") {
        newTotal += total;
        itemsToBuy();
    } else {
        console.log('Thank you!');
    }
});
```
