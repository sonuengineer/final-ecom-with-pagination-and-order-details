const cart_items = document.querySelector('#cart .cart-items');
const musicContent = document.querySelector("#music-content");
const paginationDiv = document.querySelector("#pagination");
const paginationCart = document.querySelector("#paginationcart");
const cartNumber = document.querySelector("#cart-number");
const orderContent = document.querySelector("#orders-content");
const orderSection = document.querySelector("#orders");

const productLimit = 2;
const cartLimit = 2;

let pathnameArr = window.location.pathname.split("/");

if(pathnameArr[2] == "dynamicstore.html"){
    let total_cart_price = document.querySelector('#total-value').innerText;

    const parentContainer = document.getElementById('EcommerceContainer');
    parentContainer.addEventListener('click', async (e)=>{

        if (e.target.className=='shop-item-button'){
            const _id = e.target.id;
            const id = e.target.parentNode.parentNode.id;
            const name = document.querySelector(`#${id} h3`).innerText;
            let response = await axios.post(`http://localhost:4000/cart/${_id}`);
            console.log(response);
            if(response.data.success==true){
                let cartResult = await axios.get(`http://localhost:4000/cart/count`);
                getCartPrice();
                let cartCount = cartResult.data;
                cartNumber.innerText = cartCount;
                //document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1;
                const container = document.getElementById('container');
                // container.style.backgroundColor = "cyan";
                const notification = document.createElement('div');
                notification.classList.add('notification');
                // notification.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
                notification.innerHTML = `<h4> Your Product added to the cart Successfully <h4>`;
                container.appendChild(notification);
                setTimeout(()=>{
                    notification.remove();
                },2500);
            }else{
                const container = document.getElementById('container');
                container.style.backgroundColor = "cyan";
                const notification = document.createElement('div');
                notification.classList.add('notification');
                notification.innerHTML = `<h4 style="color : Red">ERROR ! : Your Product : <span>${name}</span> cannot be added to the cart<h4>`;
                container.appendChild(notification);
                setTimeout(()=>{
                    notification.remove();
                },2500)
            }
        }
        if (e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder'){

            let currentPageNumber = 1;
            let result = await axios.get(`http://localhost:4000/cart/?page=${currentPageNumber}`);
            getCartPrice();
            let cartItems = result.data;
            console.log(cartItems);
            cart_items.innerHTML = "";
            for(let i=0;i<cartItems.length;i++){
                let cartItem = cartItems[i];
                console.log(cartItem);
                const _id = cartItem.id;
                const id = cartItem.albumId;
                const name = cartItem.title;
                const img_src = cartItem.imageUrl;
                const price = cartItem.price;
                const quantity = cartItem.cartItem.quantity;
                const cart_item = document.createElement('div');
                cart_item.classList.add('cart-row');
                cart_item.setAttribute('id',`in-cart-${id}`);
                total_cart_price = parseFloat(total_cart_price) + parseFloat(price);
                total_cart_price = total_cart_price.toFixed(2);
                document.querySelector('#total-value').innerText = `${total_cart_price}`;
                cart_item.innerHTML = `
                <span class='cart-item cart-column'>
                <img class='cart-img' src="${img_src}" alt="">
                    <span>${name}</span>
                </span>
                <span class='cart-price cart-column'>${price}</span>
                <span class='cart-quantity cart-column'>
                    <input type="text" value="${quantity}">
                    <button id=${_id}>REMOVE</button>
                </span>`
                cart_items.appendChild(cart_item);
            }

            document.querySelector('#cart').style = "display:block;";
        }
        if (e.target.className=='cancel'){
            cart_items.innerHTML = "";
            document.querySelector('#cart').style = "display:none;"
        }
        if (e.target.className=='purchase-btn'){
            if (parseInt(document.querySelector('.cart-number').innerText) === 0){
                alert('You have Nothing in Cart , Add some products to purchase !');
                return
            }
            let response = await axios.post(`http://localhost:4000/orders/addOrder`);
            if(response.data.success == true){
                alert('Thanks for the purchase')
                cart_items.innerHTML = "";
                document.querySelector('.cart-number').innerText = 0;
                document.querySelector('#total-value').innerText = `0`;
                const container = document.getElementById('container');
                // container.style.backgroundColor = "rebeccapurple";
                const notification = document.createElement('div');
                notification.classList.add('notification');
                notification.innerHTML = `<h4> SUCCESS ! : Your Order [ OrderId: ${response.data.orderId} ] has been placed successfully! <h4>`;
                container.appendChild(notification);
                setTimeout(()=>{
                    notification.remove();
                },5000)
            }else{
                const container = document.getElementById('container');
                container.style.backgroundColor = "rebeccapurple";
                const notification = document.createElement('div');
                notification.classList.add('notification');
                notification.innerHTML = `<h4 style="color : Orange;">ERROR ! : Your Order cannot be placed! Please Try Again<h4>`;
                container.appendChild(notification);
                setTimeout(()=>{
                    notification.remove();
                },5000)
            }
        }

        if (e.target.innerText=='REMOVE'){
            let _id = e.target.id;
            console.log(_id);
            let response = await axios.delete(`http://localhost:4000/cart/${_id}`);
            console.log(response);
            if(response.data.success==true){
                let total_cart_price = document.querySelector('#total-value').innerText;
                total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2) ;
                //needs to remove quantity instead of -1 
                cartNumber.innerText = parseInt(cartNumber.innerText)-1
                document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
                e.target.parentNode.parentNode.remove();
            }
        }

        if(e.target.className=="paginationBtn"){
            console.log(e.target.innerText);
            let currentPageNumber = parseInt(e.target.innerText);
            let result = await axios.get(`http://localhost:4000/products/?page=${currentPageNumber}`);
            let products = result.data;
            console.log(products);
            let htmlMuscText = "";
            for(let i=0;i<products.length;i++){
                htmlMuscText +=`<div id='${products[i].albumId}'>
                                    <h3>${products[i].title}</h3>
                                    <div class="image-container">
                                        <img class="prod-images" src="${products[i].imageUrl}" alt="">
                                    </div>
                                                    <div class="prod-details">
                                        <span>$<span>${products[i].price}</span></span>
                                        <button id="${products[i].id}" class="shop-item-button" type='button'>ADD TO CART</button>
                                    </div>
                                </div>`
            }
            musicContent.innerHTML = htmlMuscText;

            let resultCount = await axios.get(`http://localhost:4000/products/count`);

            let productsCount = resultCount.data;
            paginationDiv.innerHTML = "";
            if(currentPageNumber!=1 && (currentPageNumber)*productLimit<productsCount){
                paginationDiv.innerHTML =  `<button class="paginationBtn">${currentPageNumber-1}</button>
                                    <button class="current-page paginationBtn">${currentPageNumber}</button>
                                    <button class="paginationBtn">${currentPageNumber+1}</button>`;
            }else if(currentPageNumber==1){
                paginationDiv.innerHTML =  `<button class="current-page paginationBtn">${currentPageNumber}</button>
                                    <button class="paginationBtn">${currentPageNumber+1}</button>
                                    <button class="paginationBtn">${currentPageNumber+2}</button>`;
            }
            if((currentPageNumber)*productLimit>=productsCount){
                paginationDiv.innerHTML =  `<button class="paginationBtn">${currentPageNumber-2}</button>
                                    <button class="paginationBtn">${currentPageNumber-1}</button>
                                    <button class="current-page paginationBtn">${currentPageNumber}</button>`;
            }  
        }

        if(e.target.className == "paginationCartBtn"){

            console.log(e.target.innerText);
            let currentPageNumber = parseInt(e.target.innerText);
            let result = await axios.get(`http://localhost:4000/cart/?page=${currentPageNumber}`);
            getCartPrice();
            let cartItems = result.data;
            console.log(cartItems);
            cart_items.innerHTML = "";
            for(let i=0;i<cartItems.length;i++){
                let cartItem = cartItems[i];
                console.log(cartItem);
                const _id = cartItem.id;
                const id = cartItem.albumId;
                const name = cartItem.title;
                const img_src = cartItem.imageUrl;
                const price = cartItem.price;
                const quantity = cartItem.cartItem.quantity;
                const cart_item = document.createElement('div');
                cart_item.classList.add('cart-row');
                cart_item.setAttribute('id',`in-cart-${id}`);
                total_cart_price = parseFloat(total_cart_price) + parseFloat(price);
                total_cart_price = total_cart_price.toFixed(2);
                document.querySelector('#total-value').innerText = `${total_cart_price}`;
                cart_item.innerHTML = `
                <span class='cart-item cart-column'>
                <img class='cart-img' src="${img_src}" alt="">
                    <span>${name}</span>
                </span>
                <span class='cart-price cart-column'>${price}</span>
                <span class='cart-quantity cart-column'>
                    <input type="text" value="${quantity}">
                    <button id=${_id}>REMOVE</button>
                </span>`
                cart_items.appendChild(cart_item);
            }

            let resultCount = await axios.get(`http://localhost:4000/products/count`);

            let cartCount = resultCount.data;
            console.log(cartCount);
            if(currentPageNumber!=1 && (currentPageNumber)*cartLimit<cartCount){
                paginationCart.innerHTML = `<button class="paginationCartBtn">${currentPageNumber-1}</button>
                                    <button class="current-page paginationCartBtn">${currentPageNumber}</button>
                                    <button class="paginationCartBtn">${currentPageNumber+1}</button>`;
            }else if(currentPageNumber==1){
                paginationCart.innerHTML = `<button class="current-page paginationCartBtn">${currentPageNumber}</button>
                                    <button class="paginationCartBtn">${currentPageNumber+1}</button>
                                    <button class="paginationCartBtn">${currentPageNumber+2}</button>`;
            }
            if((currentPageNumber)*cartLimit>=cartCount){
                paginationCart.innerHTML = `<button class="paginationCartBtn">${currentPageNumber-2}</button>
                                    <button class="paginationCartBtn">${currentPageNumber-1}</button>
                                    <button class="current-page paginationCartBtn">${currentPageNumber}</button>`;
            }  
        }
    });

}else if(pathnameArr[2] == "orders.html"){
    orderSection.addEventListener('click', async (e)=>{
        if(e.target.className=="paginationBtn"){
            console.log(e.target.innerText);
            let currentPageNumber = parseInt(e.target.innerText);

        }

        if(e.target.className == "cancel-order-button-btn"){
            let orderId = e.target.parentNode.id;
            console.log(e.target.parentNode.id);
            let response = await axios.delete(`http://localhost:4000/orders/${orderId}`);
            if(response.data.success==true){
                e.target.parentNode.parentNode.remove();
            }
        }

    });    
}

let getCartPrice = async () => {

    let result = await axios.get("http://localhost:4000/cart/totalprice");
    total_cart_price = result.data.toFixed(2);
    console.log(total_cart_price);
    document.querySelector('#total-value').innerText = `${total_cart_price}`;

}

let loadProducts = async () => {

    if(pathnameArr[2] == "dynamicstore.html"){
        paginationDiv.innerHTML =  `<button class="current-page paginationBtn">1</button>
                                    <button class="paginationBtn">2</button>
                                    <button class="paginationBtn">3</button>`;

        let cartResult = await axios.get(`http://localhost:4000/cart/count`);
        let cartCount = cartResult.data;
        cartNumber.innerText = cartCount;
        getCartPrice();

        let result = await axios.get("http://localhost:4000/products/?page=1");
        let products = result.data;
        let htmlMuscText = "";
        for(let i=0;i<products.length;i++){
        htmlMuscText +=`<div id='${products[i].albumId}'>
            <h3>${products[i].title}</h3>
            <div class="image-container">
                <img class="prod-images" src="${products[i].imageUrl}" alt="">
            </div>
                            <div class="prod-details">
                <span>$<span>${products[i].price}</span></span>
                <button id="${products[i].id}" class="shop-item-button" type='button'>ADD TO CART</button>
            </div>
        </div>`
        }
        musicContent.innerHTML = htmlMuscText;
    }
    else if(pathnameArr[2] == "orders.html"){
        
        // paginationDiv.innerHTML =  `<button class="current-page paginationBtn">1</button>
        // <button class="paginationBtn">2</button>
        // <button class="paginationBtn">3</button>`;
        orderContent.innerHTML = "";
        let result = await axios.get("http://localhost:4000/orders");
        // console.log(result);
        let orders = result.data.data;
        //console.log(orders);
        for(let j=0;j<orders.length;j++){
            let productsPerOrder = orders[j];
            //console.log(productsPerOrder.length);
            let orderDiv = document.createElement("div");
            let orderNo = document.createElement("h2");
            let productsText = "";
            for(let k=0;k<productsPerOrder.length;k++){
                let productDetails = productsPerOrder[k];
                //console.log(productDetails);
                orderNo.innerText = `Order Id: ${productDetails[0].orderId}`;
                orderDiv.appendChild(orderNo);
                let product = productDetails[1];
                //console.log(product);
                let orderItem = productDetails[0];
                productsText +=`<div id='${product.albumId}'>
                <h3>${product.title}</h3>
                <div class="image-container">
                    <img class="prod-images" src="${product.imageUrl}" alt="">
                </div>
                                <div class="prod-details">
                    <span>$<span>${product.price}</span></span>
                    <button class="shop-item-button" type='button'>Quantity: ${orderItem.quantity}</button>
                    </div>
                </div>`;
    
            }
            orderDiv.innerHTML += productsText;
            let cancelOrderDiv = document.createElement("div");
            cancelOrderDiv.className = "cancel-order-button";
            cancelOrderDiv.id = orders[0][0][0].orderId;
            
            // cancelOrderDiv.innerHTML = `<button class="cancel-order-button-btn" type='button'>Cancel Order</button>`;
            orderDiv.appendChild(cancelOrderDiv);
            orderContent.appendChild(orderDiv);
        }

    }
}




window.addEventListener("DOMContentLoaded", loadProducts);

if(autoText){
    let index=0;
    let text=autoText.innerText;
    
    function writeText(){
        autoText.innerText=text.slice(0,index);
    
        index++;
        if(index>text.length)
            index=0;
    }
    
    setInterval(writeText,100);
}

