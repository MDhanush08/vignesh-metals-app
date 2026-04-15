import React, { useState } from 'react';
import { IonButton, IonIcon, IonRippleEffect } from '@ionic/react';
import { addOutline, removeOutline } from 'ionicons/icons';
import { Product } from '../data/products';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  const increment = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const decrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
  };

  return (
    <div className="product-card ion-activatable" onClick={() => onClick(product)}>
      <IonRippleEffect />
      <div className="image-container">
        <span className="category-badge">{product.category}</span>
        <img src={product.image} alt={product.name} className="product-image" />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <div className="price-container">
          <p className="product-price">₹{product.basePrice.toFixed(2)}</p>
          {product.sizeOptions && product.sizeOptions.length > 1 && (
            <span className="variants-badge">+{product.sizeOptions.length} Sizes Available</span>
          )}
        </div>

        <p className="pack-size">{product.packSize}</p>

        <div className="card-actions">
          <div className="quantity-toggle">
            <IonButton className="qty-btn" onClick={decrement} fill="clear">
              <IonIcon icon={removeOutline} />
            </IonButton>
            <span className="qty-value">{quantity}</span>
            <IonButton className="qty-btn" onClick={increment} fill="clear">
              <IonIcon icon={addOutline} />
            </IonButton>
          </div>

          <IonButton className="add-btn" expand="block" onClick={handleAddToCart}>
            ADD CART
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
