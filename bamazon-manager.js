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

    listProducts();
});