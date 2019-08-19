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
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Quit Bamazon Manager Tool"
            ]
        }
    ]).then(function(response)
    {
        task = response.task;

        // Switch that invokes the function associated with the task the user wishes to perform
        switch(task)
        {
            // Invokes the listProducts() function
            case "View Products for Sale":
                listProducts();
                break;

            // Invokes the viewLowInventory() function
            case "View Low Inventory":
                viewLowInventory();
                break;

            // Invokes the addInventory() function
            case "Add to Inventory":
                addInventory();
                break;

            // Invokes the addProduct() function
            case "Add New Product":
                addProduct();
                break;

            // Quits Bamazon
            case "Quit Bamazon Manager Tool":
                console.log("\nThank you for using the " + colors.america("Bamazon") + " Manager tool!\n")
                process.exit();
                break;
        }
    });
}

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

function viewLowInventory()
{
    console.log("\nRetrieving products with " + colors.red.underline("low") + " inventory (less than 5 items in stock)...\n");

    connection.query("SELECT * FROM products WHERE stock_qty < 5;", function(err, res)
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

function addInventory()
{
    
    var addStockId;
    var addStockQty;

    console.log("\n");

    inquirer.prompt(
    [
        {
            name: "productId",
            message: "What is the Product ID of the item you want to add inventory for?",
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
        addStockId = response.productId;
        
        console.log("\n");

        inquirer.prompt(
        [
            {
                name: "productQty",
                message: "How many items would you like to add to the inventory?",
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
            addStockQty = response.productQty;

            addStockQty = parseInt(addStockQty);

            connection.query("SELECT item_id FROM bamazon.products;", function(err, res)
            {
                if (err) throw err;
    
                var productIdArray = [];
                

                for (i = 0; i < res.length; i++)
                {
                    productIdArray.push(res[i].item_id);
                }

                if (productIdArray.includes(parseInt(addStockId)) == true)
                {
                    connection.query("SELECT * FROM bamazon.products WHERE item_id = " + addStockId + ";", function(err, res)
                    {
                        addStockQty += parseInt(res[0].stock_qty);

                        connection.query("UPDATE bamazon.products SET stock_qty = " + addStockQty + " WHERE item_id = " + addStockId + ";", function(err, res)
                        {
                            if (err) throw err;

                            console.log(colors.green("\nInventory has been updated.\n"));

                            pickTask();
                        });
                    });
                }

                else
                {
                    console.log(colors.red("You entered an invalid Product ID. Please try again.\n"));
    
                    pickTask();
                }
            });
        });
    });
}

function addProduct()
{
    var newProdId;
    var newProdName;
    var newProdDept;
    var newProdPrice;
    var newProdQty;

    console.log("\n");

    inquirer.prompt(
    [
        {
            name: "productQty",
            message: "How many of the new product would you like to add to inventory?",
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
        newProdQty = response.productQty;

        console.log("\n");

        inquirer.prompt(
        [
            {
                name: "productName",
                message: "What is the name of the new product?",
                validate: function(value)
                {
                    if (value == "")
                    {
                        return false;
                    }

                    return true;
                }
            }
        ]).then(function(response)
        {
            newProdName = response.productName;

            console.log("\n");

            inquirer.prompt(
            [
                {
                    name: "productDept",
                    message: "What is the department of the new product?",
                    validate: function(value)
                    {
                        if (value == "")
                        {
                            return false;
                        }

                        return true;
                    }
                }
            ]).then(function(response)
            {
                newProdDept = response.productDept;

                console.log("\n");

                inquirer.prompt(
                [
                    {
                        name: "productPrice",
                        message: "What is the unit price of the new product?",
                        validate: function(value)
                        {
                            var onlyNum = new RegExp(/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/);

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
                    newProdPrice = response.productPrice;

                    var query = 'INSERT INTO bamazon.products (product_name, department_name, price, stock_qty) values ("' + newProdName + '", "' + newProdDept + '", ' + newProdPrice + ', ' + newProdQty + ');';
                        
                    connection.query(query, function(err, res)
                    {
                        if (err) throw err;

                        console.log(colors.green("\nNew product has been added to inventory.\n"));

                        pickTask();
                    });
                });                             
            });
        });
    });
}

connection.connect(function(err)
{
    if (err) throw err;
    
    console.log(colors.red("\n\n<----- Manager Mode ----->"));

    console.log(colors.red("\nYou are connected as: Manager " + connection.threadId + "\n"));

    console.log(colors.red("Welcome to " + colors.america("Bamazon!") + " Make a difference for a customer today!\n"));

    console.log(colors.red("                                 o"));
    console.log(colors.red("                                /\\ "));
    console.log(colors.red("                               /::\\ "));
    console.log(colors.red("                              /::::\\ "));
    console.log(colors.red("               ,a_a          /\\::::/\\ "));
    console.log(colors.red("               {/ ''\\_      /\\ \\::/\\ \\ "));
    console.log(colors.red("               {\\ ,_oo)    /\\ \\ \\\/\\ \\ \\ "));
    console.log(colors.red("               {/  (_^____/  \\ \\ \\ \\ \\ \\ "));
    console.log(colors.red("     .=.      {/ \\___)))*)    \\ \\ \\ \\ \\\/ "));
    console.log(colors.red("   (.=.`\\   {/    /=;  ~/      \\ \\ \\ \\\/ "));
    console.log(colors.red("       \\ `\\{/(    \\/\\  /        \\ \\ \\\/ "));
    console.log(colors.red("         \\  `. `\\  ) )           \\ \\\/ "));
    console.log(colors.red("          \\    // /_/_            \\\/ "));
    console.log(colors.red("           '==''---))))"));
    console.log(colors.red("     Bam Bam: Offical Mascot of " + colors.america("Bamazon")+ "\n"));

    pickTask();
});