// targeted the shop by the ID and assigned it to the variable shop
let shop = document.getElementById('shop');

//we are creating an array for the basket
//we want to push the basket in to local storage
//we have data inside the local storage but what if we don't have any data
//then it would throw an error and break the app, so the or statement will give the empty array
let basket = JSON.parse(localStorage.getItem("data")) || [];
basket = basket.map(item => {
    if (item.id !== undefined && item.id !== null) {
        item.id = item.id.toString();
    }
    return item;
});


//es6 arrow function, define the function here
let generateShop = () => {
    //back ticks are used to create template literals
    //the map function will run the same amount of times as the size of the array,
    //by writing x we target one object at a time
    return (shop.innerHTML = shopItemsData.map((x)=>{
        //this is destructuring the array in to individual items so we can use them to populate the HTML
        //In the HTML we use ${} << with the name of the object item inside the brackets
        let{id,name,price,desc,img}=x;
        //search function will search for the id and item, if the id exists then just get the item and put it in the quantity
        //if we find something then store it in search if not then empty array
        let search = basket.find((item) => item.id === id) || {};
        let quantity = search.item || 0;
        //we have put the id in the parent
        return `<div id=product-id-${id} class="item">
            <img width="220" src=${img} />
            <div class="details">
                <h3>${name}</h3>
                <p>${desc}</p>
                <div class="price-quantity">
                    <h2>$ ${price}</h2>
                    <div class="buttons">
                        <i onclick="decrement('${id}')" class="bi bi-dash-lg"></i>
                        <!--everytime we increment we are going to target the ID -->
                        <div id=${id} class="quantity">${quantity}</div>
                        <!-- onlick increment will call our function on the button click-->
                        <i onclick="increment('${id}')" class="bi bi-plus-lg"></i>
                    </div>
                </div>
            </div>
        </div>`;
    }).join(""));
};
//use the function here
generateShop()

//we pass in the ID so that we only increment or decrement that selected items quantity
let increment = (id) =>{
    let selectedItem = id;
    let search = basket.find((x)=> x.id === id)
    //if we dont find the thing we are trying to search then we push tpo the basket
    if (search) {
        // Product exists, increment its quantity
        search.item += 1;
    } else {
        // Product does not exist, add it to the basket
        basket.push({
            id: id.toString(),
            item: 1,
        });
    }
    update(id);
    // Update local storage
    localStorage.setItem("data", JSON.stringify(basket));

}
let decrement = (id) => {
    let search = basket.find((x) => x.id === id.toString());
    if (!search) {
        //Item doesn't exist in basket, so there's nothing to decrement so a return is sufficient to stop the error
        return;
    }
    if (search.item === 0) {
        //if item count is 0, you can't decrement it further.
        return;
    } else {
        search.item -= 1;

        if (search.item === 0) {
            //If the count has reached 0, you might decide to remove it from the basket array.
            basket = basket.filter(item => item.id !== id.toString());
        }
    }
    update(id);
    localStorage.setItem("data", JSON.stringify(basket));

}

let update = (id) => {
    //this function will print to the console the amount of items the user selects
    let search = basket.find((x) => x.id === id.toString());
    if (!search) {
        //If the item doesn't exist in the basket, set its displayed quantity to 0.
        document.getElementById(id).innerHTML = 0;
        calculation();
        return;
    }

    document.getElementById(id).innerHTML = search.item;
    calculation();
}

let calculation = () => {
    //select the icon and store it within the variable cartIcon
    let cartIcon = document.getElementById("cartAmount");
    //we want to target only the item by using a map function
    //By using the reduce function with x,y. we us the 0 so that the calculation starts from 0
    cartIcon.innerHTML = basket.map((x) => (x.item)).reduce((x, y) => x + y, 0);
}
calculation();
