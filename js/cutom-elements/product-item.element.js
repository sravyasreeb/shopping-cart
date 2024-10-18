// Define the product-item custom element
class ProductItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=favorite" />
            <style>

            .product-item {
                padding: 20px;
            }

            .product-item img {
                max-width: 100%;
                height: 382px;
            }

            .product-item .product-name {
                overflow: hidden;
                height: 23px;
                margin-top: 11px;
                font: normal normal bold 18px/20px Mulish;
                color: #172026;
            }

            .product-item .product-price {
                height: 20px;
            }

            </style>
            
            <div class="product-item">
                    <div>
                       <img src="" alt="">
                    </div>
                    <div class="product-info">
                        <div class="product-name"></div>
                        <div class="product-price"></div>
                        <span class="material-symbols-outlined">
                            favorite
                        </span>
                    </div>
            </div>
        `;
    }

   /**
    * Sets product data
    * @param {*} product 
    */
    setProductData(product) {
        this.shadowRoot.querySelector('img').src = product.image;
        this.shadowRoot.querySelector('img').alt = product.title;
        this.shadowRoot.querySelector('.product-name').textContent = product.title?.split('-')[0];
        this.shadowRoot.querySelector('.product-price').textContent = `$${product.price}`;
    }
}

// Register the custom element for product-item
customElements.define('product-item', ProductItem);