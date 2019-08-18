// Node Package Dependencis
var inquirer = require("inquirer");
var Table = require("cli-table");
var mysql = require("mysql");
var colors = require("colors");

// Creates MySQL Connection
var connection = mysql.createConnection(
{
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
                head: ["Product ID".america, "Product Name".america, "Department".america, "Price".america, "Avail Qty".america],
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
                process.exit();
                break;
        }
    });
}

function buyProduct()
{
    console.log("\nLet's buy something!\n")
    pickTask();
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
    console.log("     Bam Bam: Offical Mascot of Bamazon\n")

    listProducts();
});
