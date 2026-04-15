import React, { useState, useEffect } from 'react';
import { IonModal, IonButton, IonIcon, IonRippleEffect } from '@ionic/react';
import { closeOutline, addOutline, removeOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { Product, SizeOption } from '../data/products';
import './ProductModal.css';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size: string, price: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      if (product.sizeOptions && product.sizeOptions.length > 0) {
        setSelectedSize(product.sizeOptions[0]);
      } else {
        setSelectedSize(null);
      }
    }
  }, [product, isOpen]);

  if (!product) return null;

  const currentPrice = selectedSize ? selectedSize.price : product.basePrice;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize?.label || 'Standard', currentPrice);
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

        {/* Scrollable Context Area */}
        <div className="premium-modal-body">
          <div className="product-intro">
            <span className="cat-label">{product.category}</span>
            <h2 className="product-title">{product.name}</h2>
            <div className="main-price-display">
              <span className="currency">₹</span>
              <span className="p-amount">{currentPrice.toFixed(0)}</span>
              <span className="p-unit">/ unit</span>
            </div>
          </div>

          <div className="selection-zone">
            {product.sizeOptions && product.sizeOptions.length > 0 && (
              <div className="variant-configurator">
                <div className="section-header">
                  <h3>Choose Variation</h3>
                  {selectedSize && <span className="selection-pill">{selectedSize.label} Selected</span>}
                </div>

                <div className="variation-selection-grid">
                  {product.sizeOptions.map((option) => (
                    <div
                      key={option.label}
                      className={`variant-card-premium ${selectedSize?.label === option.label ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(option)}
                    >
                      <div className="v-card-inner">
                        <span className="v-name">{option.label}</span>
                        <span className="v-price-val">₹{option.price}</span>
                      </div>
                      <IonRippleEffect />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="description-premium">
              <h3>About this Product</h3>
              <p>{product.description}</p>
            </div>

            <div className="specs-grid-premium">
              <div className="spec-item-premium">
                <span className="spec-key">Units</span>
                <span className="spec-val">{product.packSize}</span>
              </div>
              <div className="spec-item-premium">
                <span className="spec-key">Inventory</span>
                <span className="spec-val">Ready Stock</span>
              </div>
            </div>
          </div>

          <div className="bottom-buffer"></div>
        </div>

        {/* Floating Action Bar */}
        <div className="premium-action-bar">
          <div className="action-bar-content">
            <div className="premium-qty-selector">
              <button
                className="qty-action"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                <IonIcon icon={removeOutline} />
              </button>
              <span className="qty-count">{quantity}</span>
              <button className="qty-action" onClick={() => setQuantity(quantity + 1)}>
                <IonIcon icon={addOutline} />
              </button>
            </div>

            <button className="premium-cart-btn" onClick={handleAddToCart}>
              <div className="cart-btn-stack">
                <span className="main-action">ADD TO CART</span>
                <span className="total-value">Total ₹{(currentPrice * quantity).toFixed(0)}</span>
              </div>
              <IonRippleEffect />
            </button>
          </div>
        </div>
      </div>
    </IonModal>
  );
};

export default ProductModal;
