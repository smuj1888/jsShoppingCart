let label = document.getElementById('label');
let shoppingCart = document.getElementById('shopping-cart');


let basket = JSON.parse(localStorage.getItem("data")) || [];
if (basket.length > 0) {
    basket = basket.map(item => {
        if (item.id) {
            item.id = item.id.toString();
        }
        return item;
    });
}


let calculation = () => {
    //select the icon and store it within the variable cartIcon
    let cartIcon = document.getElementById("cartAmount");
    //we want to target only the item by using a map function
    //By using the reduce function with x,y. we us the 0 so that the calculation starts from 0
    cartIcon.innerHTML = basket.map((x) => (x.item)).reduce((x, y) => x + y, 0);
}
calculation();

let generateCartItems = () => {
    if (basket.length !== 0) {
        return (shoppingCart.innerHTML = basket
            .map((x) => {
                let { id, item } = x;
                let search = shopItemsData.find((y) => y.id === id) || [];
                return `
      <div class="cart-item">
        <img width="100" src=${search.img} alt="" />
        <div class="details">

          <div class="title-price-x">
              <h4 class="title-price">
                <p>${search.name}</p>
                <p class="cart-item-price">$ ${search.price}</p>
              </h4>
              <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
          </div>

          <div class="buttons">
              <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${item}</div>
              <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
          </div>

          <h3>$ ${item * search.price}</h3>
        </div>
      </div>
      `;
            })
            .join(""));
    } else {
        shoppingCart.innerHTML = ``;
        label.innerHTML = `
    <h2>Cart is Empty</h2>
    <a href="index.html">
      <button class="HomeBtn">Back to home</button>
    </a>
    `;
    }
};

generateCartItems();

let increment = (id) => {
    let search = basket.find((x) => x.id === id.toString());

    if (search === undefined) {
        basket.push({
            id: id.toString(),
            item: 1,
        });
    } else {
        search.item += 1;
    }

    generateCartItems();
    update(id.toString());
    localStorage.setItem("data", JSON.stringify(basket));
};

let decrement = (id) => {
    let search = basket.find((x) => x.id === id.toString());

    if (search === undefined) return;
    else if (search.item === 1) {
        //if the item count is 1, remove it from the basket
        basket = basket.filter((x) => x.id !== id.toString());
    } else {
        //if the item count is greater than 1, decrement it
        search.item -= 1;
    }

    update(id.toString());
    //Remove items with 0 count
    basket = basket.filter((x) => x.item !== 0);
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
    //this finds and updates the basket using the id
    let search = basket.find((x) => x.id === id);
    // console.log(search.item);
    document.getElementById(id).innerHTML = search.item;
    //call the calc and total functions
    calculation();
    TotalAmount();
};

let removeItem = (id) => {
    //filter out the item using the id from the basket array
    basket = basket.filter((x) => x.id !== id.toString());
    //call both functions
    generateCartItems();
    TotalAmount();
    //update all the local storage and sve the cyrrent state of the basket
    localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
    //this will set the basket array to empty
    basket = [];
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};

let TotalAmount = () => {
    //first check that the basket is not empty
    if (basket.length !== 0) {
        let amount = basket
            .map((x) => {
                //destructure the basket and get the item and id for each object
                let { item, id } = x;
                //this is used to search
                let search = shopItemsData.find((y) => y.id === id) || [];

                return item * search.price;
            })
            .reduce((x, y) => x + y, 0);
        // console.log(amount);
        label.innerHTML = `
    <h2>Total Bill : $ ${amount}</h2>
    <button class="checkout">Checkout</button>
    <button onclick="clearCart()" class="removeAll">Clear Cart</button>
    `;
    } else return;
};

TotalAmount();