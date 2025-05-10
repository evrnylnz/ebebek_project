(() => {
  const config = {
    productApiUrl: 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json',
    carouselTitle: 'Beğenebileceğinizi düşündüklerimiz',
    storageKey: 'ebebekCarouselFavorites',
    insertAfterSelector: '.banner',
  };

  const init = () => {
    if (!isHomePage()) {
      console.log('wrong page');
    }

    console.log('Starting carousel initialization...');
    
    const insertAfterElement = findInsertionPoint();

    self.buildHTML(insertAfterElement);
    self.buildCSS();
    self.setEvents();
  };

  const findInsertionPoint = () => {
    const element = document.querySelector(config.insertAfterSelector);
    
    if (element) {
      return element;
    }
    return document.body;
  };

  const isHomePage = () => {
    const path = window.location.pathname;
    const isHome = path === '/';
    return isHome;
  };

  const buildHTML = (insertAfterElement) => {
    const html = `
      <div class="product-carousel-container" style="margin: 40px auto; max-width: 1200px; padding: 0 20px; font-family: Arial, sans-serif;">
        <div class="product-carousel-title" style="background-color: #FFF5E6; color: #333; padding: 15px 20px; margin: 0 0 15px 0; font-size: 18px; font-weight: 600; border-radius: 4px;">${config.carouselTitle}</div>
        <div class="product-carousel-wrapper" style="position: relative; display: flex; align-items: center;">
          <button class="carousel-nav-button prev-button" aria-label="Previous products" style="position: absolute; top: 50%; transform: translateY(-50%); left: -20px; width: 40px; height: 40px; border-radius: 50%; background-color: white; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); transition: background-color 0.3s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div class="product-carousel-items" style="display: flex; overflow-x: hidden; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory; gap: 15px; padding: 10px 0;"></div>
          <button class="carousel-nav-button next-button" aria-label="Next products" style="position: absolute; top: 50%; transform: translateY(-50%); right: -20px; width: 40px; height: 40px; border-radius: 50%; background-color: white; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); transition: background-color 0.3s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    if (insertAfterElement && insertAfterElement.parentNode) {
      
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = html.trim();
      
      const carouselElement = tempContainer.firstChild;
      
      try {
        insertAfterElement.parentNode.insertBefore(carouselElement, insertAfterElement.nextSibling);
        
        loadProducts();
      } catch (error) {
        console.error('Error inserting carousel element:', error);
      }
    } else {
      console.error('Invalid insertion point for carousel');
    }
  };

  //CSS
  const buildCSS = () => {
    const css = `
      .product-card {
        flex: 0 0 calc(25% - 12px);
        min-width: 240px;
        scroll-snap-align: start;
        background-color: #fff;
        border-radius: 8px;
        transition: transform 0.3s, box-shadow 0.3s;
        position: relative;
        display: flex;
        flex-direction: column;
        cursor: pointer;
        padding: 10px;
      }
      
      .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
      }
      
      .product-image-container {
        position: relative;
        padding-top: 10px;
        text-align: center;
        margin-bottom: 15px;
        height: 203px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .product-image {
        display: inline-block;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        transform: scale(1);
        opacity: 1;
        transition: all .6s;
        vertical-align: middle;
      }
      
      .favorite-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 2;
        outline: none;
      }
      
      .favorite-icon {
        width: 24px;
        height: 24px;
        fill: none;
        stroke: #ccc;
        stroke-width: 2;
        transition: all 0.2s;
      }
      
      .favorite-icon.active {
        fill: #FF8A00;
        stroke: #FF8A00;
      }
      
      .product-name {
        font-size: 14px;
        color: #333;
        margin: 0 0 10px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        height: 40px;
        line-height: 1.4;
      }
      
      .product-price-container {
        display: flex;
        flex-direction: column;
        margin-top: auto;
      }
      
      .original-price-container {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 5px;
      }
      
      .original-price {
        font-size: 14px;
        color: #777;
        text-decoration: line-through;
      }
      
      .discount-badge {
        background-color: #4CAF50;
        color: white;
        font-size: 14px;
        font-weight: bold;
        padding: 2px 6px;
        border-radius: 4px;
      }
      
      .current-price {
        display: block;
        width: 100%;
        font-size: 2.2rem;
        font-weight: 600;
        color: #333;
      }
      
      .current-price.discounted {
        color: #4CAF50;
      }
      
      .product-rating {
        display: flex;
        align-items: center;
        margin: 10px 0;
      }
      
      .rating-stars {
        display: flex;
        margin-right: 5px;
      }
      
      .star {
        color: #FFB900;
        font-size: 14px;
      }
      
      .empty-star {
        color: #DDD;
        font-size: 14px;
      }
      
      .rating-count {
        color: #999;
        font-size: 12px;
      }
      
      .add-to-cart-button {
        width: 100%;
        padding: 15px 20px;
        border-radius: 37.5px;
        background-color: #fff7ec;
        color: #f28e00;
        font-family: Poppins, Arial, sans-serif;
        font-size: 1.4rem;
        font-weight: 700;
        margin-top: 25px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
        text-align: center;
      }
      
      .add-to-cart-button:hover {
        background-color: #FFEBCC;
      }
      
      @media (max-width: 1024px) {
        .product-card {
          flex: 0 0 calc(33.33% - 12px);
        }
      }
      
      @media (max-width: 768px) {
        .product-card {
          flex: 0 0 calc(50% - 10px);
        }
      }
      
      @media (max-width: 576px) {
        .product-card {
          flex: 0 0 calc(100% - 8px);
        }
      }
    `;
    
    try {
      const styleElement = document.createElement('style');
      styleElement.textContent = css;
      document.head.appendChild(styleElement);
    } catch (error) {
      console.error('Error adding CSS styles:', error);
    }
  };

  const setEvents = () => {
    const container = document.querySelector('.product-carousel-container');
    if (!container) {
      return;
    }
    const carousel = container.querySelector('.product-carousel-items');
    const prevButton = container.querySelector('.prev-button');
    const nextButton = container.querySelector('.next-button');
    
    if (prevButton && carousel) {
      prevButton.addEventListener('click', () => {
        carousel.scrollBy({ left: -carousel.offsetWidth / 2, behavior: 'smooth' });
      });
    }
    
    if (nextButton && carousel) {
      nextButton.addEventListener('click', () => {
        carousel.scrollBy({ left: carousel.offsetWidth / 2, behavior: 'smooth' });
      });
    }
    
    container.addEventListener('click', (event) => {
      const favoriteButton = event.target.closest('.favorite-button');
      const productCard = event.target.closest('.product-card');
      const addToCartButton = event.target.closest('.add-to-cart-button');
      
      if (favoriteButton) {
        event.preventDefault();
        event.stopPropagation();
        
        const productId = favoriteButton.getAttribute('data-product-id');
        toggleFavorite(productId, favoriteButton);
      }
      else if (addToCartButton) {
        event.preventDefault();
        event.stopPropagation();
      }
      else if (productCard && !favoriteButton && !addToCartButton) {
        const productUrl = productCard.getAttribute('data-product-url');
        if (productUrl) {
          window.open(productUrl, '_blank');
        }
      }
    });
  };

  // Load products from API or local storage
  const loadProducts = () => {
    const favorites = getFavorites();
    const storedProducts = localStorage.getItem('ebebekCarouselProducts');
    
    if (storedProducts) {
      try {
        console.log('Products found in local storage');
        const products = JSON.parse(storedProducts);
        renderProducts(products, favorites);
      } catch (e) {
        fetchProducts();
      }
    } else {
      fetchProducts();
    }
  };

  // Fetch products from API
  const fetchProducts = () => {
    const favorites = getFavorites();
    
    fetch(config.productApiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(products => {
        console.log(`Fetched ${products.length} products from API`);
        localStorage.setItem('ebebekCarouselProducts', JSON.stringify(products));
        renderProducts(products, favorites);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  //random rating for demo
  const generateRandomRating = () => {
    const rating = (Math.random() * 2 + 3).toFixed(1);
    const count = Math.floor(Math.random() * 48) + 3;
    return { rating, count };
  };
  
  //star rating
  const createStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<span class="star">★</span>';
    }
    
    if (hasHalfStar) {
      starsHtml += '<span class="star">★</span>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<span class="empty-star">★</span>';
    }
    
    return starsHtml;
  };
  const renderProducts = (products, favorites) => {
    const productCarousel = document.querySelector('.product-carousel-items');
    if (!productCarousel) {
      return;
    }
    
    productCarousel.innerHTML = '';
    products.forEach(product => {
      const isDiscounted = product.price !== product.original_price;
      const isFavorite = favorites.includes(product.id.toString());
      const discountAmount = isDiscounted ? 
        Math.round((1 - (product.price / product.original_price)) * 100) : 0;
      
      const { rating, count } = generateRandomRating();
      
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.setAttribute('data-product-id', product.id);
      productCard.setAttribute('data-product-url', product.url);
      
      productCard.innerHTML = `
        <div class="product-image-container">
          <img src="${product.img}" alt="${product.name}" class="product-image">
          <button class="favorite-button" data-product-id="${product.id}" aria-label="Add to favorites">
            <svg class="favorite-icon ${isFavorite ? 'active' : ''}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
            </svg>
          </button>
        </div>
        <div class="product-name"><b>${product.brand} - </b> ${product.name}</div>
        <div class="product-rating">
          <div class="rating-stars">
            ${createStarRating(rating)}
          </div>
          <div class="rating-count">(${count})</div>
        </div>
        <div class="product-price-container">
          ${isDiscounted ? `
            <div class="original-price-container">
              <span class="original-price">${product.original_price.toFixed(2)} TL</span>
              <span class="discount-badge">%${discountAmount}</span>
            </div>
            <div class="current-price discounted">${product.price.toFixed(2)} TL</div>
          ` : `
            <div class="current-price">${product.price.toFixed(2)} TL</div>
          `}
        </div>
        <button class="add-to-cart-button">Sepete Ekle</button>
      `;
      
      productCarousel.appendChild(productCard);
    });
  };

  // Toggle favorite status
  const toggleFavorite = (productId, buttonElement) => {
    if (!productId || !buttonElement) return;
    
    console.log('Toggling favorite status for product:', productId);
    const favorites = getFavorites();
    const iconElement = buttonElement.querySelector('.favorite-icon');
    
    // Check if already favorite
    const index = favorites.indexOf(productId);
    
    if (index === -1) {
      // Add to favorites
      favorites.push(productId);
      iconElement.classList.add('active');
      iconElement.style.fill = '#FF8A00';
      iconElement.style.stroke = '#FF8A00';
      console.log('Product added to favorites');
    } else {
      // Remove from favorites
      favorites.splice(index, 1);
      iconElement.classList.remove('active');
      iconElement.style.fill = 'none';
      iconElement.style.stroke = '#ccc';
      console.log('Product removed from favorites');
    }
    
    // Save updated favorites
    localStorage.setItem(config.storageKey, JSON.stringify(favorites));
  };

  // Get favorites from local storage
  const getFavorites = () => {
    try {
      const storedFavorites = localStorage.getItem(config.storageKey);
      return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (e) {
      console.error('Error getting favorites from local storage:', e);
      return [];
    }
  };

  // Self-reference for internal calls
  const self = {
    buildHTML,
    buildCSS,
    setEvents
  };

  // Initialize the component and return a success message
  return init();
})();
