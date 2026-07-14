import React, { useState, useEffect } from 'react';
import { IonModal, IonButton, IonIcon, IonRippleEffect } from '@ionic/react';
import { closeOutline, addOutline, removeOutline, checkmarkCircleOutline, imageOutline } from 'ionicons/icons';
import { Product, SizeOption } from '../data/products';
import './ProductModal.css';

interface ProductModalProps {
  product: Product | null;
  initialQuantity?: number;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size: string, price: number, sizeId?: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, initialQuantity = 1, isOpen, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(initialQuantity);
      setImgError(false);
      if (product.sizeOptions && product.sizeOptions.length > 0) {
        setSelectedSize(product.sizeOptions[0]);
      } else {
        setSelectedSize(null);
      }
    }
  }, [product, isOpen, initialQuantity]);

  if (!product) return null;

  const currentPrice = selectedSize ? selectedSize.price : product.basePrice;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize?.label || 'Standard', currentPrice, selectedSize?.id);
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
        {/* Top bar with close icon */}
        <div className="modal-header-bar">
          <IonButton className="modal-close-trigger" fill="clear" onClick={onClose} mode="md">
            <IonIcon icon={closeOutline} slot="icon-only" size="large" />
          </IonButton>
        </div>

        <div className="modal-hero">
          {(product.image && !imgError) ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="hero-img" 
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="fallback-hero-image">
              <IonIcon icon={imageOutline} className="fallback-hero-icon" />
            </div>
          )}
        </div>

        {/* Scrollable Context Area */}
        <div className="premium-modal-body">
          <div className="product-intro">
            <span className="cat-label">{product.category}</span>
            <h2 className="product-title">{product.name}</h2>
          </div>

          <div className="selection-zone">
            {product.sizeOptions && product.sizeOptions.length > 0 && (
              <div className="variant-configurator">
                <div className="section-header">
                  <h3>Select Available Size</h3>
                  {selectedSize && <span className="selection-pill">{selectedSize.label} size</span>}
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
                      </div>
                      <div className="select-indicator">
                        <IonIcon icon={checkmarkCircleOutline} />
                      </div>
                      <IonRippleEffect />
                    </div>
                  ))}
                </div>

                {selectedSize && (selectedSize.HT || selectedSize.BT || selectedSize.WT) && (
                  <div className="size-specs-belt">
                    {selectedSize.HT && (
                      <div className="mini-spec">
                        <span className="m-label">Height</span>
                        <span className="m-val">{selectedSize.HT} in</span>
                      </div>
                    )}
                    {selectedSize.BT && (
                      <div className="mini-spec">
                        <span className="m-label">Breadth</span>
                        <span className="m-val">{selectedSize.BT} in</span>
                      </div>
                    )}
                    {selectedSize.WT && (
                      <div className="mini-spec">
                        <span className="m-label">Width</span>
                        <span className="m-val">{selectedSize.WT} in</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="description-premium">
              <h3>Product Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="specs-grid-premium">
              <div className="spec-item-premium">
                <span className="spec-key">Status</span>
                <span className="spec-val" style={{ color: 'var(--ion-color-success)' }}>In Stock</span>
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
