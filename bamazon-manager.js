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

// This is a function which prompts the manager to pick the task he wishes to complete
function pickTask()
{
    // Instantiates the task variable used to capture the manager's chosen task
    var task;
    
    // Prompts the manager to choose his next task using the inquirer package
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
        // Sets the local task variable to the task chosen by the manager
        task = response.task;

        // Switch that invokes the function associated with the manager the user wishes to perform
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

// This is a function that is call to list all of the products on Bamazon
function listProducts()
{
    // Status to manager that the products are being retrieved
    console.log("\nRetrieving all products from Bamazon...\n");

    // MySQL query to retrieve all rows from the products table
    connection.query("SELECT * FROM products", function(err, res)
    {
        // If an error is encountered, then the error is displayed to the manager
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

            // Pushes the product array into the productsTable array to build the command line table displayed to manager
            productsTable.push(product);

            // Resets the product array so that it is cleared for each iteration of the for loop
            product = [];
        }

        // Outputs the completed table of products using the cli-table package
        console.log(productsTable.toString()+ "\n");

        // Invokes the pickTask() function to prompt the manager to choose his next task
        pickTask();
    });
}

// This is a function that displays the products with low inventory to the customer (stock_qty less than five)
function viewLowInventory()
{
    // Status to manager that the products with low inventory are being retrieved
    console.log("\nRetrieving products with " + colors.red.underline("low") + " inventory (less than 5 items in stock)...\n");

    // MySQL query to retrieve all rows from the products table where stock_qty is less than five
    connection.query("SELECT * FROM products WHERE stock_qty < 5;", function(err, res)
    {
        // If an error is encountered, then the error is displayed to the manager
        if (err) throw err;

        // Initializes a new table uses cli-table package and formats it with the column names and widths, along with formatting using colors package
        var productsTable = new Table(
            {
                head: ["Product ID".red, "Product Name".blue, "Department".white, "Price".red, "Avail Qty".blue],
                colWidths: [15, 50, 50, 15, 15]
            });

        // Initializes product array to grab the data in each row of the MySQL products table query for formatting into command line table
        var product = [];

        // For loop which populates the product array with the values in each row of the MySQL products table query
        for (i = 0; i < res.length; i++)
        {
            product.push(res[i].item_id);
            product.push(res[i].product_name);
            product.push(res[i].department_name);
            product.push(res[i].price);
            product.push(res[i].stock_qty);

            // Pushes the product array into the productsTable array to build the command line table displayed to manager
            productsTable.push(product);

            // Resets the product array so that it is cleared for each iteration of the for loop
            product = [];
        }

        // Outputs the completed table of products using the cli-table package
        console.log(productsTable.toString()+ "\n");

        // Invokes the pickTask() function to prompt the manager to choose his next task
        pickTask();
    });
}

// This is a function that allows the manager to add inventory for a product
function addInventory()
{
    // Instantiates local variables for Product ID and quantity to add inventory
    var addStockId;
    var addStockQty;

    console.log("\n");

    // Prompts the manager to enter the Product ID for which he wishes to add inventory
    inquirer.prompt(
    [
        {
            name: "productId",
            message: "What is the Product ID of the item you want to add inventory for?",
            validate: function(value)
            {
                // Validates the manager's input to allow only positive integers and no empty string using a regular expression
                var onlyNum = new RegExp('^[0-9]+$');

                if (value == "")
                {
                    return false;
                }

                // Calls the test function and regular expression to ensure manager input is only positive integers
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
        // Sets the local variable addStockId to the Product ID entered by manager for increasing inventory
        addStockId = response.productId;
        
        console.log("\n");

        // Prompts the manager to enter the number of units that should be added the product's inventory
        inquirer.prompt(
        [
            {
                name: "productQty",
                message: "How many units would you like to add to the inventory?",
                validate: function(value)
                {
                    // Validates the manager's input to allow only positive integers and no empty string using a regular expression
                    var onlyNum = new RegExp('^[0-9]+$');

                    if (value == "")
                    {
                        return false;
                    }

                    // Calls the test function and regular expression to ensure manager input is only positive integers
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
            // Sets the local variable addStockQty to the quantity entered by manager 
            addStockQty = response.productQty;

            // Sets the addStockQty to an integer since it was stored as a string from inquirer
            addStockQty = parseInt(addStockQty);

            // MySQL query to rerieve all values from the item_id column in the the Bamazon database
            // This will be used to ensure the manager entered a valid Product ID
            connection.query("SELECT item_id FROM bamazon.products;", function(err, res)
            {
                // If an error is encountered, then the error is displayed to the manager
                if (err) throw err;
    
                // Instantiates the productIdArray where all Product IDs in the products table will be stored
                var productIdArray = [];
                
                // For loop which pushes all Product IDs in the products table to the productIdArray
                for (i = 0; i < res.length; i++)
                {
                    productIdArray.push(res[i].item_id);
                }

                // Conditional statement which checks to see if the Product ID the manager entered is in the productIdArray
                if (productIdArray.includes(parseInt(addStockId)) == true)
                {   
                    // MySQL query which is run to retrieve quantity in stock of the product the manager wishes to add inventory
                    connection.query("SELECT * FROM bamazon.products WHERE item_id = " + addStockId + ";", function(err, res)
                    {
                        // Calculates the new in stock quantity by adding the amount the manager wishes to add to the current in stock quantity
                        addStockQty += parseInt(res[0].stock_qty);

                        // MySQL query statement which will update the in stock quantity for the product which had inventory added
                        connection.query("UPDATE bamazon.products SET stock_qty = " + addStockQty + " WHERE item_id = " + addStockId + ";", function(err, res)
                        {
                            // If an error is encountered, then the error is displayed to the manager
                            if (err) throw err;

                            // Notifies the manager that the inventory was added and quantity updated
                            console.log(colors.green("\nInventory has been updated.\n"));

                            // Invokes the pickTask() function to prompt the manager to choose his next task
                            pickTask();
                        });
                    });
                }

                else
                {
                    // Notifies the manager that he entered an invalid Product ID
                    console.log(colors.red("You entered an invalid Product ID. Please try again.\n"));
    
                    // Invokes the pickTask() function to prompt the manager to choose his next task
                    pickTask();
                }
            });
        });
    });
}

// This is a function that allows a customer to add a new product to Bamazon
function addProduct()
{
    // Instantiates local variables needed to add a new product to the Bamazon database
    var newProdId;
    var newProdName;
    var newProdDept;
    var newProdPrice;
    var newProdQty;

    console.log("\n");

    // Prompts the manager to enter the quantity or starting inventory for the new product
    inquirer.prompt(
    [
        {
            name: "productQty",
            message: "How many of the new product would you like to add to inventory?",
            validate: function(value)
            {
                // Validates the manager's input to allow only positive integers and no empty string using a regular expression
                var onlyNum = new RegExp('^[0-9]+$');

                if (value == "")
                {
                    return false;
                }

                // Calls the test function and regular expression to ensure manager input is only positive integers
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
        // Sets the local variable newProdQty to the quantity entered by manager 
        newProdQty = response.productQty;

        console.log("\n");

        // Prompts the manager to enter the name for the new product
        inquirer.prompt(
        [
            {
                name: "productName",
                message: "What is the name of the new product?",
                validate: function(value)
                {
                    // Ensures that the manager enters a response to the prompt (not an empty string)
                    if (value == "")
                    {
                        return false;
                    }

                    return true;
                }
            }
        ]).then(function(response)
        {
            // Sets the local variable newProdName to the name entered by manager 
            newProdName = response.productName;

            console.log("\n");

            // Prompts the manager to enter the department for the new product
            inquirer.prompt(
            [
                {
                    name: "productDept",
                    message: "What is the department of the new product?",
                    validate: function(value)
                    {
                        // Ensures that the manager enters a response to the prompt (not an empty string)
                        if (value == "")
                        {
                            return false;
                        }

                        return true;
                    }
                }
            ]).then(function(response)
            {
                // Sets the local variable newProdDept to the department entered by manager 
                newProdDept = response.productDept;

                console.log("\n");

                // Prompts the manager to enter the price for the new product
                inquirer.prompt(
                [
                    {
                        name: "productPrice",
                        message: "What is the unit price of the new product?",
                        validate: function(value)
                        {
                            // Validates the manager's input to allow only positive integers and no empty string using a regular expression
                            var onlyNum = new RegExp(/^[+-]?((\d+(\.\d*)?)|(\.\d+))$/);

                            if (value == "")
                            {
                                return false;
                            }
                
                            // Calls the test function and regular expression to ensure manager input is only positive integers
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
                    // Sets the local variable newProdPrice to the price entered by manager 
                    newProdPrice = response.productPrice;

                    // MySQL query which adds a new row into the products table to create the new product in Bamazon using the inputs from the manager
                    var query = 'INSERT INTO bamazon.products (product_name, department_name, price, stock_qty) values ("' + newProdName + '", "' + newProdDept + '", ' + newProdPrice + ', ' + newProdQty + ');';
                    
                    // Executes the MySQL query using the connection to the Bamazon database
                    connection.query(query, function(err, res)
                    {
                        // If an error is encountered, then the error is displayed to the manager
                        if (err) throw err;

                        // Notifies the manager that the new product was successfully added 
                        console.log(colors.green("\nNew product has been added to inventory.\n"));

                        // Invokes the pickTask() function to prompt the manager to choose his next task
                        pickTask();
                    });
                });                             
            });
        });
    });
}

// Performs the initial connection to the Bamazon database and displays welcome messaging to the manager
connection.connect(function(err)
{
    // If an error is encountered, then the error is displayed to the manager
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
    console.log(colors.red("    jgs   \\    // /_/_            \\\/ "));
    console.log(colors.red("           '==''---))))"));
    console.log(colors.red("     Bam Bam: Offical Mascot of " + colors.america("Bamazon")+ "\n"));

    // ASCII art credit to JGS from asciiart.website

    // Invokes the pickTask() function so the customer can choose the task he wishes to do next
    pickTask();
});