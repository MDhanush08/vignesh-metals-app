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
  IonBadge,
  useIonViewWillEnter,
  useIonViewWillLeave
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
  checkmarkCircleOutline,
  cubeOutline
} from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { getClientList, ApiClient, getClientById } from '../services/clientService';
import { createOrder, updateOrder } from '../services/orderService';
import { useCart } from '../context/CartContext';
import { IonSearchbar, IonModal, IonSpinner, useIonToast, IonRippleEffect } from '@ionic/react';
import './Cart.css';

const Cart: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const {
    items, updateQuantity, removeItem, clearCart,
    editingOrderId, selectedClientId, orderType: contextOrderType,
    setSelectedClientId, setEditingOrderId
  } = useCart();

  const [clients, setClients] = useState<ApiClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<ApiClient[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderType, setOrderType] = useState<number>(2); // 1: Emergency, 2: General
  const [selectedClient, setSelectedClient] = useState<ApiClient | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  useIonViewWillEnter(() => {
    if (editingOrderId && selectedClientId) {
      // Pre-populate for Edit Mode
      setOrderType(contextOrderType || 2);
      fetchSelectedClient(selectedClientId);
    } else {
      setSelectedClient(null);
      setOrderType(2); // Reset to General
    }
  });

  useIonViewWillLeave(() => {
    // Reset client details when leaving the page as per user request
    setSelectedClient(null);
    setSelectedClientId(null);
    // Also clear edit mode if we leave the page to ensure fresh start next time
    setEditingOrderId(null);
  });

  const fetchSelectedClient = async (clientId: string) => {
    try {
      const response = await getClientById(clientId);
      setSelectedClient(response.response);
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

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
      const response = await getClientList(1, 100);
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
    setSelectedClientId(client._id); // Update context too
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


      let result;
      if (editingOrderId) {
        result = await updateOrder(editingOrderId, orderData);
        present({
          message: 'Order updated successfully!',
          duration: 2000,
          color: 'success'
        });
      } else {
        result = await createOrder(orderData);
      }

      const orderId = result.response?.order_number || result.response?._id?.substring(0, 8) || '...';
      setPlacedOrderId(orderId);

      clearCart();
      setSelectedClient(null);
      setShowSuccess(true);

      // Auto redirect after animation
      setTimeout(() => {
        handleViewOrders();
      }, 3000);
    } catch (error) {
      console.error('Error processing order:', error);
      present({
        message: `Failed to ${editingOrderId ? 'update' : 'place'} order. Please try again.`,
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

      <IonContent className="cart-content-premium">
        {items.length > 0 ? (
          <>
            <div className="selected-client-section">
              <h3 className="section-title">Delivery To</h3>
              {selectedClient ? (
                <div className="client-summary-card" onClick={() => setIsClientModalOpen(true)}>
                  <div className="client-avatar">
                    <IonIcon icon={personOutline} />
                  </div>
                  <div className="client-data">
                    <h4>{selectedClient.name}</h4>
                    <p>{selectedClient.city}, {selectedClient.state} - {selectedClient.pincode || '620001'}</p>
                    <p className="phone-val">{selectedClient.phone}</p>
                  </div>
                  <div className="client-actions">
                    <button className="change-btn">
                      Change <IonIcon icon={chevronForwardOutline} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="client-summary-card placeholder-card" onClick={() => setIsClientModalOpen(true)}>
                  <div className="client-avatar empty">
                    <IonIcon icon={personOutline} />
                  </div>
                  <div className="client-data">
                    <h4>No Client Selected</h4>
                    <p>Tap here to select client</p>
                  </div>
                  <div className="client-actions">
                    <button className="change-btn">
                      Select <IonIcon icon={chevronForwardOutline} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="cart-items-wrapper">
              {items.map(item => (
                <div key={`${item.id}-${item.size}`} className="premium-cart-card">
                  <div className="card-image-box">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="card-info-content">
                    <div className="top-row">
                      <h3 className="card-product-name">{item.name}</h3>
                      <button className="card-delete-trigger" onClick={() => removeItem(item.id, item.sizeId)}>
                        <IonIcon icon={trashOutline} />
                      </button>
                    </div>

                    <div className="card-tags-row">
                      <span className="premium-tag category">{item.category}</span>
                      {item.size && <span className="premium-tag size">{item.size}</span>}
                    </div>

                    <div className="card-bottom-row">
                      <div className="price-placeholder"></div>

                      <div className="compact-qty-selector">
                        <button className="qty-ctrl" onClick={() => updateQuantity(item.id, -1, item.sizeId)}>
                          <IonIcon icon={removeOutline} />
                        </button>
                        <span className="qty-num">{item.quantity}</span>
                        <button className="qty-ctrl" onClick={() => updateQuantity(item.id, 1, item.sizeId)}>
                          <IonIcon icon={addOutline} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-cart-premium">
            <div className="empty-state-illust">
              <IonIcon icon={cartOutline} />
            </div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <IonButton mode="ios" className="shop-now-btn" routerLink="/app/products">
              Start Shopping
            </IonButton>
          </div>
        )}
      </IonContent>

      {items.length > 0 && (
        <IonFooter className="ion-no-border cart-footer">
          <div className="footer-flex-container">
            <div className="delivery-type-box">
              <span className="type-label">Delivery Type</span>
              <div className="type-selector" onClick={() => setOrderType(orderType === 1 ? 2 : 1)}>
                <IonIcon icon={cubeOutline} className="truck-icon" />
                <span className={`type-val ${orderType === 1 ? 'emergency' : 'standard'}`}>
                  {orderType === 1 ? 'Emergency' : 'Standard'}
                </span>
                <IonIcon icon={chevronForwardOutline} className="arrow-down-icon" />
              </div>
            </div>

            <IonButton
              className={`place-order-btn-new ${selectedClient ? 'confirm-btn' : ''}`}
              onClick={handlePlaceOrderClick}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <IonSpinner name="crescent" />
              ) : (
                <>
                  {selectedClient ? 'Confirm Order' : 'Select Client'} <IonIcon icon={chevronForwardOutline} className="btn-arrow" />
                </>
              )}
            </IonButton>
          </div>
        </IonFooter>
      )}

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
              <h1 className="success-title">{editingOrderId ? 'Order Updated!' : 'Order Placed!'}</h1>
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
