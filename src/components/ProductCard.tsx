import React, { useState } from 'react';
import { IonButton, IonRippleEffect, IonIcon } from '@ionic/react';
import { imageOutline } from 'ionicons/icons';
import { Product } from '../data/products';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product, quantity: number) => void;
  onAddToCart: (product: Product, quantity: number, size?: string, price?: number, sizeId?: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  const [imgError, setImgError] = useState(false);
  const hasImage = product.image && !imgError;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Open modal to select size instead of adding directly
    onClick(product, 1);
  };

  return (
    <div className="product-card ion-activatable" onClick={() => onClick(product, 1)}>
      <IonRippleEffect />
      <div className="image-container">
        <span className="category-badge">{product.category}</span>
        {hasImage ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-image" 
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="fallback-image-wrapper">
            <IonIcon icon={imageOutline} className="fallback-icon" />
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <div className="card-actions">
          <IonButton className="add-btn" expand="block" onClick={handleAddToCart}>
            ADD CART
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
