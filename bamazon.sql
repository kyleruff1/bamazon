DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT(4) NOT NULL,
	product_name VARCHAR(45) NOT NULL,
	department_name VARCHAR(45) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INT(20) NOT NULL,
	PRIMARY KEY (item_id)
);

Select * FROM products;
    
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES  (1001, "strings", "guitar", 10.99, 100),
(1002, "sticks", "drums", 20.99, 200),
(1003, "picks", "guitar", 1.99, 500),
(1004, "cables", "guitar", 5.99, 100),
(1005, "tuner", "guitar", 10.99, 50),
(1006, "heads", "drums", 20.99, 100),
(1007, "cymbals", "drums", 200.99, 100),
(1008, "stands", "guitar", 10.99, 100),
(1009, "brushes", "drums", 25.99, 100),
(1010, "cowbells", "drums", 15.99, 50),
(1011, "pickups", "guitar", 70.99, 50)
