/**
 * Custom product list element
 */
class ProductList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.products = [];
    this.searchValue = "";
    this.selectedCategories = [
      "jewelery",
      "electronics",
      "men's clothing",
      "women's clothing",
    ];
    this.visibleProductsCount = 10;
    this.shadowRoot.innerHTML = `
            <style>
                .product-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                }

                .no-data-msg {
                    display: none;
                }

                /* Full-screen container to center the loader */
              .loading-container {
                  display: none;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
              }

              /* Loading spinner styling */
              .spinner {
                  width: 50px;
                  height: 50px;
                  border: 5px solid rgba(0, 0, 0, 0.1);
                  border-top: 5px solid #007bff;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
              }

              /* Keyframes for spinner animation */
              @keyframes spin {
                  0% {
                      transform: rotate(0deg);
                  }
                  100% {
                      transform: rotate(360deg);
                  }
              }
            </style>
            <div class="loading-container">
                  <div class="spinner"></div>
            </div>
            <div class="d-flex product-list-wrapper">
              
              <div class="product-list">
              
              </div>
              <div class="no-data-msg align-items-center justify-content-center">
                    No Products are available!
              </div>
            </div>

            
        `;
  }

  /**
   * Fetch products from the API when the element is added to the DOM
   * And add listeners to load more and price sort elements
   */
  connectedCallback() {
    this.createShimmerProducts();
    const categoriesElem = document.querySelector(".sort-by-category");
    const searchInput = document.getElementById("search-input");
    this.fetchProducts();
    document
      .getElementById("load-more-btn")
      .addEventListener("click", () => this.loadRestOfAllProducts());
    document
      .getElementById("price-sort")
      .addEventListener("change", (e) => this.sortProducts(e.target.value));

    categoriesElem.addEventListener("change", () => {
      this.showLoadingSpinner();
      this.selectedCategories = Array.from(
        categoriesElem.querySelectorAll("input[type=checkbox]:checked")
      ).map((checkbox) => checkbox.value);
      this.sortProductsByCategory();
    });

    // Add event listener to the search input with debounced handler
    searchInput.addEventListener(
      "input",
      this.debounce((event) => {
        this.handleSearch(event.target.value);
      }, 300)
    );
  }

  createShimmerProducts(){
    const productList = this.shadowRoot.querySelector(".product-list");
    productList.innerHTML = ``;
    Array(this.visibleProductsCount).fill('').forEach(() => {
      const productItem = document.createElement("shimmer-product-item");
      productList.appendChild(productItem);
    });
  }

  removeShimmerProducts(){
    const productList = this.shadowRoot.querySelector(".product-list");
    productList.innerHTML = ``;
  }

  async fetchProducts() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      this.products = (await response.json()) || [];
      this.removeShimmerProducts();
      this.displayProducts();
    } catch (error) {
      this.showNoDataState();
      console.warn("Error fetching products:", error);
    }
  }

  showNoDataState() {
    this.hideLoadingSpinner();
    this.toggleDisplayNoDataMsg();
    this.hideLoadMoreButton();
    this.hideProductList();
  }

  showLoadingSpinner() {
    this.hideLoadingSpinner();
    // this.hideProductList();
    // const loadSpinner = this.shadowRoot.querySelector(".loading-container");
    // loadSpinner.style.display = "flex";
  }

  hideLoadingSpinner() {
    const loadSpinner = this.shadowRoot.querySelector(".loading-container");
    loadSpinner.style.display = "none";
  }

  /**
   * Display the products using the product-item custom element
   *
   */
  displayProducts(
    clearContent = false,
    startIndex = 0,
    endIndex = this.visibleProductsCount,
    products = this.products
  ) {
    const productList = this.shadowRoot.querySelector(".product-list");

    if (clearContent) {
      productList.innerHTML = "";
    }

    if (products?.length > 0) {
      this.toggleDisplayNoDataMsg(false);
      const filteredProducts = products.slice(startIndex, endIndex);
      filteredProducts.forEach((product) => {
        const productItem = document.createElement("product-item");
        productItem.setProductData(product);
        productList.appendChild(productItem);
      });
      document.querySelector(".results").innerHTML =
        filteredProducts.length || "";
      this.showProductList();
      this.hideLoadingSpinner();
      if (this.visibleProductsCount === this.products.length) {
        this.hideLoadMoreButton();
      } else if (!this.searchValue) {
        this.showLoadMoreButton();
      }
    } else {
      this.showNoDataState();
      document.querySelector(".results").innerHTML = "0";
    }
  }

  /**
   * Display no products available message
   * @param {*} products
   */
  showNoDataMsg() {
    this.toggleDisplayNoDataMsg(false);
  }

  toggleDisplayNoDataMsg(show = true) {
    const noDataMsgElem = this.shadowRoot.querySelector(".no-data-msg");
    if (show) {
      noDataMsgElem.style.display = "flex";
    } else {
      noDataMsgElem.style.display = "none";
    }
  }

  /**
   * load all products
   */
  loadRestOfAllProducts() {
    this.showLoadingSpinner();
    if (
      this.products?.length &&
      this.products?.length > this.visibleProductsCount
    ) {
      this.displayProducts(
        false,
        this.visibleProductsCount,
        this.products?.length
      );
    }
    this.visibleProductsCount = this.products.length;
    this.hideLoadMoreButton();
  }

  hideLoadMoreButton() {
    const loadMoreContainerElem = document.querySelector(
      ".load-more-container"
    );
    loadMoreContainerElem.style.display = "none";
  }

  showLoadMoreButton() {
    const loadMoreContainerElem = document.querySelector(
      ".load-more-container"
    );
    loadMoreContainerElem.style.display = "flex";
  }

  sortProducts(order) {
    this.showLoadingSpinner();
    if (order === "low-to-high") {
      this.products.sort((a, b) => a.price - b.price);
    } else if (order === "high-to-low") {
      this.products.sort((a, b) => b.price - a.price);
    }
    this.sortProductsByCategory();
  }

  sortProductsByCategory() {
    const filteredProducts = this.products.filter((f) =>
      this.selectedCategories.includes(f.category)
    );
    this.displayProducts(true, 0, this.visibleProductsCount, filteredProducts);
  }

  // Debounce function to limit the frequency of function execution
  debounce(callback, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback.apply(this, args);
      }, delay);
    };
  }

  showProductList() {
    const productList = this.shadowRoot.querySelector(".product-list");
    productList.style.display = "grid";
  }

  hideProductList() {
    const productList = this.shadowRoot.querySelector(".product-list");
    productList.style.display = "none";
  }

  // Function to handle search input value change
  handleSearch(value) {
    this.hideLoadMoreButton();
    this.searchValue = value;
    const filteredProducts = this.products
      .filter((f) => this.selectedCategories.includes(f.category))
      .filter((s) => s.title.toLowerCase().includes(value));
    this.displayProducts(true, 0, this.visibleProductsCount, filteredProducts);
  }
}

// Register the custom element for product-list
customElements.define("product-list", ProductList);
