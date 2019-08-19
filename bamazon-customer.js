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
    console.log("\nRetrieving all products from Bamazon...\n");

    connection.query("SELECT * FROM products", function(err, res)
    {
        // If an error is encountered, then the error is displayed to the customer
        if (err) throw err;

        var productsTable = new Table(
            {
                head: ["Product ID".red, "Product Name".blue, "Department".white, "Price".red, "Avail Qty".blue],
                colWidths: [15, 50, 50, 15, 15]
            });

        var product = [];

        for (i = 0; i < res.length; i++)
        {
            product.push(res[i].item_id);
            product.push(res[i].product_name);
            product.push(res[i].department_name);
            product.push(res[i].price);
            product.push(res[i].stock_qty);

            productsTable.push(product);

            product = [];
        }

        console.log(productsTable.toString()+ "\n");

        pickTask();

    });
}

function pickTask()
{
    var task;
    
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
        task = response.task;

        // Switch that invokes the function associated with the task the user wishes to perform
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

function buyProduct()
{
    var purchaeId;
    var purchaseQty;

    console.log("\n");

    inquirer.prompt(
    [
        {
            name: "productId",
            message: "What is the Product ID of the item you want to purchase?",
            validate: function(value)
            {
                var onlyNum = new RegExp('^[0-9]+$');

                if (value == "")
                {
                    return false;
                }

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
        purchaseId = response.productId;
        
        console.log("\n");

        inquirer.prompt(
        [
            {
                name: "productQty",
                message: "How many would you like to buy?",
                validate: function(value)
                {
                    var onlyNum = new RegExp('^[0-9]+$');

                    if (value == "")
                    {
                        return false;
                    }

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
            purchaseQty = response.productQty;

            console.log("\nLet's buy something!\n")

            checkSupply(purchaseId, purchaseQty);
        });
    });
}

function checkSupply(id, qty)
{
    var purchaseId = id;
    var purchaseQty = qty;
    var purchasePrice;

    console.log("\nChecking to see if the product is in stock...\n");

    connection.query("SELECT item_id FROM bamazon.products;", function(err, res)
    {
        if (err) throw err;
        
        var productIdArray = [];

        for (i = 0; i < res.length; i++)
        {
            productIdArray.push(res[i].item_id);
        }

        if (productIdArray.includes(parseInt(id)) == true)
        {
            connection.query("SELECT * FROM bamazon.products WHERE item_id = " + purchaseId + ";", function(err, res)
            {
        
                if (res[0].stock_qty >= purchaseQty)
                {
                    purchasePrice = res[0].price;
                    
                    console.log(colors.green("We have your product in stock. Fulfilling order...\n"));

                    fillOrder(id, qty, res[0].stock_qty, purchasePrice);
                }

                else if (res[0].stock_qty < purchaseQty)
                {
                    console.log(colors.red("We do not have your product in stock. Please try again later.\n"));

                    pickTask();
                }
            });
        }

        else
        {
            console.log(colors.red("You entered an invalid Product ID. Please try again.\n"));
        
            pickTask();
        }
    });

}

function fillOrder(id, purchaseQty, availQty, price)
{
    availQty -= purchaseQty;

    var total = price * purchaseQty;

    var query = "UPDATE bamazon.products SET stock_qty = " + availQty + " WHERE item_id = " + id + ";";
    
    connection.query(query, function(err, res)
    {
        if (err) throw err;

        console.log("\nYour order has been fulfilled!\n")
        console.log("Total Cost: $" + total + "\n");

        pickTask();
    });
}

connection.connect(function(err)
{
    if (err) throw err;
    
    console.log("\nYou are connected as: User" + connection.threadId + "\n");

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
    console.log("          \\    // /_/_            \\\/ ");
    console.log("           '==''---))))");
    console.log("     Bam Bam: Offical Mascot of " + colors.america("Bamazon")+ "\n");

    listProducts();
});
