// Node Package Dependencis
var inquirer = require("inquirer");
var Table = require("cli-table");
var mysql = require("mysql");
var colors = require("colors");

// Creates MySQL Connection
var connection = mysql.createConnection(
{
    // Connection Limit
    connectionLimit: 100,
    
    // Host
    host: "localhost",

    // Port
    port: 3306,

    // User
    user: "root",
    //Password
    password: "abcd1234",

    // Database
    database: "bamazon"
});

// This is a function that is call to list all of the products on Bamazon
function listProducts()
{
    // Status to customer that the products are being retrieved
    console.log("\nRetrieving all products from Bamazon...\n");

    // MySQL query to retrieve all rows from the products table
    connection.query("SELECT * FROM products", function(err, res)
    {
        // If an error is encountered, then the error is displayed to the customer
        if (err) throw err;

        // Initializes a new table uses cli-table package and formats it with the column names and widths, along with formatting using colors package
        var productsTable = new Table(
            {
                head: ["Product ID".red, "Product Name".blue, "Department".white, "Price".red, "Avail Qty".blue],
                colWidths: [15, 50, 50, 15, 15]
            });

        // Initializes product array to grab the data in each row of the MySQL products table for formatting into command line table
        var product = [];

        // For loop which populates the product array with the values in each row of the MySQL products table
        for (i = 0; i < res.length; i++)
        {
            product.push(res[i].item_id);
            product.push(res[i].product_name);
            product.push(res[i].department_name);
            product.push(res[i].price);
            product.push(res[i].stock_qty);

            // Pushes the product array into the productsTable array to build the command line table displayed to customer
            productsTable.push(product);

            // Resets the product array so that it is cleared for each iteration of the for loop
            product = [];
        }

        // Outputs the completed table of products using the cli-table package
        console.log(productsTable.toString()+ "\n");

        // Invokes the pickTask() function to prompt the customer to choose his next task
        pickTask();
    });
}

// This is a function which prompts the customer to pick the task he wishes to complete
function pickTask()
{
    // Instantiates the task variable used to capture the customer's chosen task
    var task;
    
    // Prompts the customer to choose his next task using the inquirer package
    inquirer.prompt(
    [
        {
            type: "list",
            name: "task",
            message: "What would you like to do?",
            choices:
            [
                "Make a Purchase",
                "List Products",
                "Quit Bamazon"
            ]
        }
    ]).then(function(response)
    {
        // Sets the local task variable to the task chosen by the customer
        task = response.task;

        // Switch that invokes the function associated with the task the customer wishes to perform
        switch(task)
        {
            // Invokes the buyProduct function
            case "Make a Purchase":
                buyProduct();
                break;

            // Invokes the buyProduct function
            case "List Products":
                listProducts();
                break;

            // Quits Bamazon
            case "Quit Bamazon":
                console.log("\nThank you for shopping at " + colors.america("Bamazon") + "! Have a nice day and come again!\n")
                process.exit();
                break;
        }
    });
}

// This is a function which allows the customer to purchase a product by entering the Product ID and quantity to purchase
function buyProduct()
{
    // Local variables to capture the Product ID and quantity to purchase
    var purchaeId;
    var purchaseQty;

    console.log("\n");

    // Prompts the customer to enter the Product ID of the product he wishes to purchase
    inquirer.prompt(
    [
        {
            name: "productId",
            message: "What is the Product ID of the item you want to purchase?",
            validate: function(value)
            {
                // Validates the customer's input to allow only positive integers and no empty string using a regular expression
                var onlyNum = new RegExp('^[0-9]+$');

                if (value == "")
                {
                    return false;
                }

                // Calls the test function and regular expression to ensure customer input is only positive integers
                else if (onlyNum.test(value) == true)
                {
                    return true;
                }

                else
                {
                    return false;
                }
            }
        }

    ]).then(function(response)
    {
        // Sets the local variable purchaseId to the Product ID entered by the customer
        purchaseId = response.productId;
        
        console.log("\n");

        // Prompts the customer to enter the desired quantity to purchase
        inquirer.prompt(
        [
            {
                name: "productQty",
                message: "How many would you like to buy?",

                // Validates the customer's input to allow only positive integers and no empty string using a regular expression
                validate: function(value)
                {
                    var onlyNum = new RegExp('^[0-9]+$');

                    if (value == "")
                    {
                        return false;
                    }

                    // Calls the test function and regular expression to ensure customer input is only positive integers
                    else if (onlyNum.test(value) == true)
                    {
                        return true;
                    }

                    else
                    {
                        return false;
                    }
                }
            }
        ]).then(function(response)
        {
            // Sets the local variable purchaseQty to the purchase quantity entered by the customer
            purchaseQty = response.productQty;

            // Calls the checkSupply() function and passes the purchaseId and purchaseQty values as arguments
            checkSupply(purchaseId, purchaseQty);
        });
    });
}

// This is a function which checks to see if a product is in stock given a Product ID and quanity to purchase entered by the customer
function checkSupply(id, qty)
{
    // Local variables needed to successfully invoke function; purchaseId and purchaseQty are set from the function's arguments
    var purchaseId = id;
    var purchaseQty = qty;
    var purchasePrice;

    // Status to customer that a product's stock is being checked
    console.log("\nChecking to see if the product is in stock...\n");

    // MySQL query to return all values in the item_id column from the products table
    // This will be used to validate that the customer entered a valid Product ID
    connection.query("SELECT item_id FROM bamazon.products;", function(err, res)
    {
        if (err) throw err;
        
        // Instantiates the productIdArray where all Product IDs in the products table will be stored
        var productIdArray = [];

        // For loop which pushes all Product IDs in the products table to the productIdArray
        for (i = 0; i < res.length; i++)
        {
            productIdArray.push(res[i].item_id);
        }

        // Conditional statement which checks to see if the Product ID the customer entered for the purchase is in the productIdArray
        if (productIdArray.includes(parseInt(id)) == true)
        {
            // MySQL query which is run to retrieve quantity in stock and price of the product the customer wishes to purchase
            connection.query("SELECT * FROM bamazon.products WHERE item_id = " + purchaseId + ";", function(err, res)
            {
                // If an error is encountered, then the error is displayed to the customer
                if (err) throw err;
                
                // Conditional statement which checks to see if there are enough products in stock for the customer's purchase
                if (res[0].stock_qty >= purchaseQty)
                {
                    // Sets the local variable purchase price to the price of the product returned in the MySQL query
                    purchasePrice = res[0].price;
                    
                    // Status to customer indicating that the product is in stock and is now being fulfilled
                    console.log(colors.green("We have your product in stock. Fulfilling order...\n"));

                    // Invokes the fullOrder() function
                    // Passes the Product ID, purchase quantity, quantity in stock, and purchase price as arguments
                    fillOrder(id, qty, res[0].stock_qty, purchasePrice);
                }

                // Conditional statement which checks to see if there are not enough products in stock for the customer's purchase
                // This could be an else statement
                else if (res[0].stock_qty < purchaseQty)
                {
                    // Notifies the customer that the product is not in stock
                    console.log(colors.red("We do not have your product in stock. Please try again later.\n"));

                    // Invokes the pickTask() function so the customer can choose the task he wishes to do next
                    pickTask();
                }
            });
        }

        // Conditional statement that is executed if the customer enters an invalid Product ID to purchase
        else
        {
            // Notifies the customer the Product ID he entered is invalid
            console.log(colors.red("You entered an invalid Product ID. Please try again.\n"));
        
            // Invokes the pickTask() function so the customer can choose the task he wishes to do next
            pickTask();
        }
    });

}

// This is a function that fulfills a customer order by calculating the purchase price and updates the in stock quantity
function fillOrder(id, purchaseQty, availQty, price)
{
    // Calculates the  new in stock quantity by subtracting the purchase quanity from the current in stock quantity
    availQty -= purchaseQty;

    // Calculates the total cost for customer by multiplying the purchase price of the product by the quantity to be purchased
    var total = price * purchaseQty;

    // Sets the MySQL query string to a variable for cleaner code
    var query = "UPDATE bamazon.products SET stock_qty = " + availQty + " WHERE item_id = " + id + ";";
    
    // Runs the MySQL query statement which will update the in stock quantity for the product purchased
    connection.query(query, function(err, res)
    {
        // If an error is encountered, then the error is displayed to the customer
        if (err) throw err;

        // Notifies the customer that the order has been fulfilled along with the total purchase cost
        console.log("Your order has been fulfilled!\n")
        console.log(colors.green("Total Cost: $" + total + "\n"));

        // Invokes the pickTask() function so the customer can choose the task he wishes to do next
        pickTask();
    });
}

// Performs the initial connection to the Bamazon database and displays welcome messaging to the customer
connection.connect(function(err)
{
    // If an error is encountered, then the error is displayed to the customer
    if (err) throw err;
    
    console.log(colors.green("\n\n<----- Customer Mode ----->"));

    console.log("\nYou are connected as: Customer " + connection.threadId + "\n");

    console.log("Welcome to " + colors.america("Bamazon!") + " Please take a look at all we have to sell. Happy shopping, 'Murica!\n");

    console.log("                                 o");
    console.log("                                /\\ ");
    console.log("                               /::\\ ");
    console.log("                              /::::\\ ");
    console.log("               ,a_a          /\\::::/\\ ");
    console.log("               {/ ''\\_      /\\ \\::/\\ \\ ");
    console.log("               {\\ ,_oo)    /\\ \\ \\\/\\ \\ \\ ");
    console.log("               {/  (_^____/  \\ \\ \\ \\ \\ \\ ");
    console.log("     .=.      {/ \\___)))*)    \\ \\ \\ \\ \\\/ ");
    console.log("   (.=.`\\   {/    /=;  ~/      \\ \\ \\ \\\/ ");
    console.log("       \\ `\\{/(    \\/\\  /        \\ \\ \\\/ ");
    console.log("         \\  `. `\\  ) )           \\ \\\/ ");
    console.log("     jgs  \\    // /_/_            \\\/ ");
    console.log("           '==''---))))");
    console.log("     Bam Bam: Offical Mascot of " + colors.america("Bamazon")+ "\n");
    
    // ASCII art credit to JGS from asciiart.website

    // Invokes the pickTask() function so the customer can choose the task he wishes to do next
    listProducts();
});
