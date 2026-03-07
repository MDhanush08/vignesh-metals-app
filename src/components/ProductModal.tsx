import React, { useState, useEffect } from 'react';
import { IonModal, IonButton, IonIcon, IonRippleEffect } from '@ionic/react';
import { closeOutline, addOutline, removeOutline } from 'ionicons/icons';
import { Product } from '../data/products';
import './ProductModal.css';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (product) {
      setQuantity(1);
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('');
      }
    }
  }, [product, isOpen]);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize);
    onClose();
  };

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onClose}
      className="product-modal"
      backdropDismiss={true}
      mode="ios"
    >
      <div className="modal-container">
        {/* Visual Hero Section */}
        <div className="modal-hero">
          <IonButton className="modal-close-trigger" fill="clear" onClick={onClose} mode="md">
            <IonIcon icon={closeOutline} slot="icon-only" size="large" />
          </IonButton>
          <img src={product.image} alt={product.name} className="hero-img" />
        </div>

        {/* Scrollable Details Area */}
        <div className="modal-details">
          <h2 className="detail-name">{product.name}</h2>

          <div className="detail-price-row">
            <span className="detail-price">₹{product.price.toFixed(2)}</span>
            <span className="detail-pack">{product.packSize}</span>
          </div>

          <h3 className="detail-desc-title">About this Product</h3>
          <p className="detail-desc-body">{product.description}</p>

          {product.sizes && product.sizes.length > 0 && (
            <>
              <h3 className="detail-size-title">Available Sizes</h3>
              <div className="size-grid">
                {product.sizes.map(size => (
                  <div
                    key={size}
                    className={`size-pill ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Fixed Footer Actions */}
        <div className="modal-footer">
          <div className="footer-actions-row">
            <div className="integrated-qty">
              <IonButton className="qty-action-btn" fill="clear" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
                <IonIcon icon={removeOutline} />
              </IonButton>
              <span className="qty-display">{quantity}</span>
              <IonButton className="qty-action-btn" fill="clear" onClick={() => setQuantity(quantity + 1)}>
                <IonIcon icon={addOutline} />
              </IonButton>
            </div>

            <IonButton className="detail-add-btn" onClick={handleAddToCart} mode="ios">
              ADD TO CART
            </IonButton>
          </div>
        </div>
      </div>
    </IonModal>
  );
};

export default ProductModal;
