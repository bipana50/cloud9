var faker = require('faker');



for(var i=0; i<10; i++){
    var Name = faker.commerce.productName(); 
var Price = faker.commerce.price();
    console.log(Name +"-"+ Price);
}