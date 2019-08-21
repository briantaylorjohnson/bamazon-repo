# Homework 9: Bamazon
This is Taylor Johnson's Homework 8: LIRI Bot for the Georgia Tech Coding Boot Camp. LIRI Bot is similar to Apple's Siri except that it takes input requests through the terminal command line. Specifically, LIRI Bot can perform four tasks:


## Libraries/Packages Used
1. Vanilla JavaScript
2. Node.js
3. Inquirer - user command line input
4. MySQL - connecting and executing queries on MySQL databases
5. Colors - formatting of text in command line
6. CLI Table - formatting and displaying of tables in command line

## Methods
### Customer Mode
**1. Initial Connection to Database and Welcome Message**
    When the application initially loads, a connection is opened with the Bamazon database and the customer is presented a welcome message. The listProducts() function is immediately called to present all products for the customer.
    ![alt text](screenprints/Bamazon-Customer-Start1.png "Initial Connection and Message - Customer")

**2. pickTask()**
    This function allows the customer to pick the task he/she wants to complete. The customer can choose to perform three tasks: Make a Purchase, List Products, and Quit Bamazon.
    ![alt text](screenprints/Bamazon-Customer-Start2.png "Pick Task Function - Customer")
    ![alt text](screenprints/Bamazon-Customer-Quit.png "Quit Bamazon - Customer")

**3. listProducts()**
    This function allows the customer to view all products that Bamazon has to offer. It is also invoked when the application is initially started. The pickTask() function is called immediately after to allow the customer to pick his next task.
    ![alt text](screenprints/Bamazon-Customer-ListProducts.png "List Products - Customer")

**4. buyProduct()**
    This function allows the customer to enter the following data to make a purchase: Product ID and quanity. It does not check to see if the product is in stock or fulfill the order. The checkSupply() function is called immediately after.
    ![alt text](screenprints/Bamazon-Customer-Purchase1.png "Purchase 1 - Customer")
    ![alt text](screenprints/Bamazon-Customer-Purchase2.png "Purchase 2 - Customer")

**5. checkSupply()**
    This function receives the data input by the customer from the buyProduct() function and then checks to verify if the product is in stock. It also validates that the customer has entered a valid Product ID. If the customer entered a valid Product ID and the product is in stock, then the fillOrder() function is called.
    ![alt text](screenprints/Bamazon-Customer-Purchase4.png "Item Not In Stock - Customer")

**6. fulfillOrder()**
    This function receives the following data from the checkSupply() function in its arguments: Product ID, purchase quantity, current in stock quantity, and price. Using this data, it calculates the new in stock quanity by subtracting the quantity the customer is purchasing. It also calculates the total cost by multiplying the purchase quantity and price. The database is updated with the new in stock quantity and the total cost is output to the customer.
    ![alt text](screenprints/Bamazon-Customer-Purchase3.png "Order Fulfilled - Customer")


### Manager Mode
**1. loginUser()**
    This function allows the user to log in and enter his/her name for personalization. This also is the initial funciton that is invoked to
    ![alt text](md_images/login.png "User Log In Prompt")
**2. pickTask()**
    This function allows the user to pick the task he/she wants to complete. This is called recursively throughout the program by the
    ![alt text](md_images/login2.png "Pick Task")
