const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

const startMarker = '/* ===== PREMIUM HOMEPAGE STYLES ===== */';
const endMarker = '/* ===== NEO ROOT VARIABLES ===== */';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const flipkartStyles = `/* ===== FLIPKART STYLE HOMEPAGE ===== */
.fk-home-bg {
  background-color: #f1f3f6;
  color: #212121;
  font-family: Roboto, Arial, sans-serif;
  min-height: 100vh;
  padding-bottom: 20px;
}

/* Categories Strip */
.fk-categories-strip {
  background-color: #fff;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,.16);
  margin-bottom: 10px;
  overflow-x: auto;
}

.fk-cat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  text-decoration: none;
  min-width: 80px;
}

.fk-cat-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.fk-cat-text {
  font-size: 14px;
  font-weight: 500;
  color: #212121;
}

.fk-cat-item:hover .fk-cat-text {
  color: #2874f0;
}

/* Carousel */
.fk-carousel-section {
  padding: 0 10px;
  margin-bottom: 10px;
}

.fk-carousel-container {
  background: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,.16);
}

.fk-carousel-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}

/* Promo Banners */
.fk-promo-strip {
  padding: 0 10px;
  margin-bottom: 10px;
}

.fk-promo-container {
  background: #fff;
  display: flex;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,.16);
  padding: 10px;
  justify-content: center;
}

.fk-promo-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

/* Product Section */
.fk-section {
  margin: 0 10px 10px;
  background: #fff;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,.16);
}

.fk-section-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.fk-section-title {
  font-size: 22px;
  font-weight: 500;
  color: #000;
  margin: 0;
}

.fk-btn-view-all {
  background-color: #2874f0;
  color: #fff;
  border: none;
  border-radius: 2px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.2);
}

.fk-section-content {
  padding: 15px;
  display: flex;
  gap: 15px;
  overflow-x: auto;
  background-color: #fff;
}

/* Specific Section Backgrounds */
.fk-section.suggested {
  background-color: #fff;
}
.fk-section.suggested .fk-section-content {
  background-image: url('https://rukminim1.flixcart.com/fk-p-flap/278/278/image/7593e7b6d406131e.jpg?q=90');
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
}

.fk-section.brands {
  background-color: #fff;
}
.fk-section.brands .fk-section-content {
  background-color: #f1f3f6;
}

/* Product Card */
.fk-product-card {
  min-width: 200px;
  max-width: 220px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 15px;
  text-align: center;
  text-decoration: none;
  transition: box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
}

.fk-product-card:hover {
  box-shadow: 0 3px 16px 0 rgba(0,0,0,.11);
}

.fk-product-image-wrap {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.fk-product-image {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

.fk-product-title {
  font-size: 14px;
  font-weight: 500;
  color: #212121;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fk-product-rating {
  display: inline-flex;
  align-items: center;
  background-color: #388e3c;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
  margin-bottom: 8px;
  align-self: center;
}

.fk-product-rating i {
  font-size: 10px;
  margin-left: 2px;
}

.fk-product-price-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.fk-product-price {
  font-size: 16px;
  font-weight: 500;
  color: #212121;
}

.fk-product-old-price {
  font-size: 14px;
  color: #878787;
  text-decoration: line-through;
}

.fk-product-discount {
  font-size: 13px;
  font-weight: 500;
  color: #388e3c;
}

@media (max-width: 768px) {
  .fk-categories-strip {
    padding: 10px;
    gap: 15px;
  }
  .fk-carousel-image {
    height: 150px;
  }
  .fk-section-title {
    font-size: 18px;
  }
}
`;
  
  content = content.substring(0, startIndex) + flipkartStyles + '\n' + content.substring(endIndex);
  fs.writeFileSync('src/index.css', content);
  console.log('Successfully replaced PREMIUM block with FLIPKART block.');
} else {
  console.log('Could not find markers', { startIndex, endIndex });
}
