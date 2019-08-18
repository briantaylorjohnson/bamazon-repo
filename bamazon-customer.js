// Node Package Dependencis
var http = require("http");
var fs = require("fs");
var inquirer = require("inquirer");
var Table = require("cli-table");
var mysql = require("mysql");

var table = new Table(
{
    head: ["Product ID", "Product Name", "Department", "Price", "Avail Qty"],
    colWidths: [15, 50, 50, 15, 15]
});

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
    console.log("Retrieving all products from Bamazon...\n");

    connection.query("SELECT * FROM products", function(err, res)
    {
        // If an error is encountered, then the error is displayed to the customer
        if (err) throw err;

        var product = [];
        var productList = [];
        // Loops through MySQL query results and displays each product
        for (i = 0; i < res.length; i++)
        {
            product.push(res[i].item_id);
            product.push(res[i].product_name);
            product.push(res[i].department_name);
            product.push(res[i].price);
            product.push(res[i].stock_qty);

            table.push(product);

            product = [];
        }

        console.log(table.toString());
        //console.log(productList);
    });
}

connection.connect(function(err)
{
    if (err) throw err;
    
    console.log("You are connected as: " + connection.threadId + "\n");
    listProducts();
});
