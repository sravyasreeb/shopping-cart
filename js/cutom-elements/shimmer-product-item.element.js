// Define the product-item custom element
class ShimmerProductItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="../styles/shimmer.css" />
            <style>

            shimmer-product-item  {
                width: 319px;
                background-color: #FFF;
            }

            .img {
                width: 319px;
                height: 382px;
            }

            .product-name {
                overflow: hidden;
                height: 23px;
                margin-top: 11px;
                font: normal normal bold 18px/20px Mulish;
                color: #172026;
            }

            .product-price {
                height: 20px;
            }

            </style>
            
            <div class="shimmer-product-item">
                <div class="shimmer-background img">
                    
                </div>
            </div>
        `;
    }
}

// Register the custom element for product-item
customElements.define('shimmer-product-item', ShimmerProductItem);