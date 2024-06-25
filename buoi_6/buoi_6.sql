--Cau 1

use sgroup_data;
select products.productID,sum(orders.quantity)as quantity from products 
join orders 
on products.productID = orders.ProductID
group by product.productname
order by quantity desc;

-- Cau 2
select customers.firstname from customers
join orders on customers.CustomerID = orders.CustomerID
group by customers.FirstName
having count(customers.FirstName) >1;

-- cau 3
select orders.orderID, products.ProductName, (orders.quantity * products.price) as orderPrice  from orders
join products on orders.ProductID = products.ProductID
order by OrderID asc;

-- cau 4
select customers.FirstName from customers
left join orders on customers.CustomerID = orders.CustomerID
where orders.CustomerID is NULL;

--Cau 5_v1
select products.ProductName, sum(bestSell) from(
    select products.ProductName, MAX(orders.quantity * products.price) as bestSell
    from products join orders on products.productID = orders.orderID
    group by products.ProductName
) group by  products.ProductName

-- Cau 5_v2
select products.ProductName, sum(products.price * orders.quantity)
as Total from products join orders on products.ProductID = orders.ProductID
group by products.ProductName
order by total desc
limit 1;
