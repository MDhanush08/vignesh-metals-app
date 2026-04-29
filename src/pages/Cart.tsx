import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonText,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge
} from '@ionic/react';
import {
  notificationsOutline,
  trashOutline,
  addOutline,
  removeOutline,
  chevronForwardOutline,
  cartOutline,
  searchOutline,
  personOutline,
  closeOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { getClients, ApiClient } from '../services/clientService';
import { createOrder } from '../services/orderService';
import { useCart } from '../context/CartContext';
import { IonSearchbar, IonModal, IonSpinner, useIonToast, IonRippleEffect } from '@ionic/react';
import './Cart.css';

const Cart: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  const [clients, setClients] = useState<ApiClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<ApiClient[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderType, setOrderType] = useState<number>(1); // 1: General, 2: Emergency
  const [selectedClient, setSelectedClient] = useState<ApiClient | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  useEffect(() => {
    if (isClientModalOpen) {
      loadClients();
    }
  }, [isClientModalOpen]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      setFilteredClients(clients.filter(c =>
        c.name.toLowerCase().includes(lowerSearch) ||
        (c.client_code && c.client_code.toLowerCase().includes(lowerSearch))
      ));
    }
  }, [searchTerm, clients]);

  const loadClients = async () => {
    setLoadingClients(true);
    try {
      const response = await getClients(1, 100);
      setClients(response.response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      present({
        message: 'Failed to load client list',
        duration: 2000,
        color: 'danger'
      });
    } finally {
      setLoadingClients(false);
    }
  };

  const handlePlaceOrderClick = () => {
    if (items.length === 0) return;
    if (selectedClient) {
      submitOrder();
    } else {
      setIsClientModalOpen(true);
    }
  };

  const handleSelectClient = (client: ApiClient) => {
    setSelectedClient(client);
    setIsClientModalOpen(false);
    present({
      message: `Selected client: ${client.name}`,
      duration: 1500,
      color: 'success',
      position: 'bottom'
    });
  };

  const handleViewOrders = () => {
    setShowSuccess(false);
    history.push('/app/orders');
  };

  const submitOrder = async () => {
    if (!selectedClient) return;
    setIsPlacingOrder(true);
    try {
      const orderData = {
        client_id: selectedClient._id,
        items_list: items.map(item => ({
          product_id: item.sizeId || item.id,
          qty: item.quantity,
          size: item.size || "Standard"
        })),
        order_type: orderType
      };

      console.log('Final Order Payload:', JSON.stringify(orderData, null, 2));

      const result = await createOrder(orderData);
      const orderId = result.response?.order_number || result.response?._id?.substring(0, 8) || '...';
      setPlacedOrderId(orderId);

      clearCart();
      setShowSuccess(true);

      // Auto redirect after animation
      setTimeout(() => {
        handleViewOrders();
      }, 3000);
    } catch (error) {
      console.error('Error creating order:', error);
      present({
        message: 'Failed to place order. Please try again.',
        duration: 3000,
        color: 'danger'
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="cart-header">
          <IonTitle>Shopping Cart</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={notificationsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="cart-content">
        <div className="cart-summary-top">
          <IonText>
            <h2>My Order</h2>
            <p>You have {items.length} items in your cart</p>
          </IonText>
        </div>

        <div className="cart-list-container">
          {items.length > 0 ? (
            items.map(item => (
              <div key={`${item.id}-${item.size}`} className="cart-item-modern">
                <div className="item-image-container">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details-container">
                  <div className="item-header-row">
                    <h3 className="item-name">{item.name}</h3>
                    <button className="remove-icon-btn" onClick={() => removeItem(item.id, item.sizeId)}>
                      <IonIcon icon={trashOutline} />
                    </button>
                  </div>

                  <div className="item-meta-row">
                    <span className="item-category-tag">{item.category}</span>
                    {item.size && <span className="item-size-pill">{item.size}</span>}
                  </div>

                  <div className="item-actions-row">
                    <div className="quantity-pill">
                      <button onClick={() => updateQuantity(item.id, -1, item.sizeId)}>
                        <IonIcon icon={removeOutline} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1, item.sizeId)}>
                        <IonIcon icon={addOutline} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-cart">
              <IonIcon icon={cartOutline} className="empty-cart-icon" />
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything yet.</p>
              <IonButton expand="block" fill="outline" routerLink="/app/products">
                Start Shopping
              </IonButton>
            </div>
          )}
        </div>

        <div className="order-options">
          <h3>Order Type</h3>
          <div className="type-toggle">
            <div
              className={`type-option ${orderType === 1 ? 'active general' : ''}`}
              onClick={() => setOrderType(1)}
            >
              General
            </div>
            <div
              className={`type-option ${orderType === 2 ? 'active emergency' : ''}`}
              onClick={() => setOrderType(2)}
            >
              Emergency
            </div>
          </div>
        </div>

        {selectedClient && (
          <div className="selected-client-section">
            <div className="section-header">
              <h3>Client Details</h3>
              <IonButton fill="clear" size="small" onClick={() => setIsClientModalOpen(true)}>
                Change
              </IonButton>
            </div>
            <div className="client-summary-card">
              <div className="client-avatar">
                <IonIcon icon={personOutline} />
              </div>
              <div className="client-data">
                <h4>{selectedClient.name}</h4>
                <p>{selectedClient.city}, {selectedClient.state}</p>
              </div>
              <div className="client-check">
                <IonIcon icon={checkmarkCircleOutline} color="success" />
              </div>
            </div>
          </div>
        )}
      </IonContent>

      {items.length > 0 && (
        <>
          <IonFooter className="ion-no-border cart-footer">
            <IonButton
              expand="block"
              className={`place-order-btn ${selectedClient ? 'confirm-btn' : ''}`}
              onClick={handlePlaceOrderClick}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <IonSpinner name="crescent" />
              ) : (
                selectedClient ? 'Confirm & Place Order' : 'Select Client to Place Order'
              )}
              {!isPlacingOrder && <IonIcon icon={chevronForwardOutline} slot="end" />}
            </IonButton>
          </IonFooter>

          {/* Client Selection Modal */}
          <IonModal
            isOpen={isClientModalOpen}
            onDidDismiss={() => setIsClientModalOpen(false)}
            className="client-selection-modal"
            initialBreakpoint={0.7}
            breakpoints={[0, 0.7, 0.9]}
          >
            <div className="modal-sheet-container">
              <div className="sheet-header">
                <div className="drag-handle"></div>
                <div className="header-content">
                  <h2>Select Client</h2>
                  <IonButton fill="clear" onClick={() => setIsClientModalOpen(false)}>
                    <IonIcon icon={closeOutline} />
                  </IonButton>
                </div>
                <IonSearchbar
                  value={searchTerm}
                  onIonInput={(e) => setSearchTerm(e.detail.value!)}
                  placeholder="Search clients..."
                  mode="ios"
                  className="modal-search"
                />
              </div>

              <IonContent className="ion-padding">
                {loadingClients ? (
                  <div className="modal-loader">
                    <IonSpinner name="crescent" color="primary" />
                    <p>Fetching clients...</p>
                  </div>
                ) : filteredClients.length > 0 ? (
                  <div className="client-list">
                    {filteredClients.map(client => (
                      <div
                        key={client._id}
                        className="client-item ion-activatable"
                        onClick={() => handleSelectClient(client)}
                      >
                        <IonRippleEffect />
                        <div className="client-icon-circle">
                          <IonIcon icon={personOutline} />
                        </div>
                        <div className="client-info">
                          <span className="client-name">{client.name}</span>
                          <span className="client-sub">{client.city}, {client.state}</span>
                        </div>
                        <IonIcon icon={chevronForwardOutline} className="select-arrow" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-clients">
                    <IonIcon icon={searchOutline} />
                    <p>No clients match your search</p>
                  </div>
                )}
              </IonContent>
            </div>
          </IonModal>
        </>
      )}

      {/* High-End Success Climax Overlay */}
      <IonModal isOpen={showSuccess} className="success-overlay-modal" backdropDismiss={false}>
        <div className="success-climax-container">
          <div className="confetti-placeholder"></div>
          <div className="success-card">
            <div className="check-animation-wrapper">
              <div className="check-circle">
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
              <div className="success-rings">
                <div className="ring r1"></div>
                <div className="ring r2"></div>
                <div className="ring r3"></div>
              </div>
            </div>

            <div className="success-text-content">
              <h1 className="success-title">Order Placed!</h1>
              <p className="order-id-label">Order #<span className="id-val">{placedOrderId}</span></p>
              <div className="success-divider"></div>
              <p className="success-message">Your order has been successfully sent to the manufacturing unit.</p>
            </div>

            <div className="success-footer-actions">
              <IonButton expand="block" fill="clear" onClick={handleViewOrders}>
                View Order Review
              </IonButton>
            </div>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default Cart;
