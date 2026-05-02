import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonButton,
  IonText,
  useIonViewWillEnter,
  IonSpinner,
  useIonToast
} from '@ionic/react';
import {
  calendarOutline,
  timeOutline,
  businessOutline,
  locationOutline,
  callOutline,
  cubeOutline,
  notificationsOutline,
  arrowBack
} from 'ionicons/icons';
import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getOrderById, getOrderDownloadUrl } from '../services/orderService';
import { useCart } from '../context/CartContext';
import './OrderDetails.css';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { initializeEdit } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [rawOrder, setRawOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();

  useIonViewWillEnter(() => {
    fetchOrderDetails();
  });

  const fetchOrderDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await getOrderById(id);
      console.log("response .... Order Details", result);
      const data = result.response;
      setRawOrder(data);

      // Map API response to UI structure
      const mappedOrder = {
        id: data.order_number || data._id.substring(0, 8),
        shopName: data.email.split('@')[0].toUpperCase() || 'CLIENT',
        type: data.order_type === 1 ? 'Emergency' : 'General',
        date: new Date(data.created_at || Date.now()).toLocaleDateString(),
        status: data.status === 1 ? 'Processing' : data.status === 2 ? 'In Transit' : 'Delivered',
        address: data.address,
        phone: `+${data.country_code} ${data.phone}`,
        expectedDate: data.approve_at ? new Date(data.approve_at).toLocaleDateString() : 'TBD',
        items: (data.items_list || []).map((item: any) => ({
          name: item.name || 'Product',
          qty: `${item.quantity} Units`,
          size: item.size || 'Standard'
        }))
      };

      setOrder(mappedOrder);
    } catch (error) {
      console.error('Error fetching order details:', error);
      present({
        message: 'Error loading order details.',
        duration: 2000,
        color: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!id) return;
    const downloadUrl = getOrderDownloadUrl(id);

    present({
      message: 'Opening order PDF...',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });

    // Open in new tab to trigger download
    window.open(downloadUrl, '_blank');
  };

  const handleEditOrder = () => {
    if (!rawOrder || !id) return;

    const cartItems = (rawOrder.items_list || []).map((item: any) => ({
      id: item.product_id,
      name: item.name || 'Product',
      category: 'General',
      quantity: item.quantity,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=200',
      size: item.size || 'Small',
      sizeId: item.size_id || item.size // Fallback
    }));

    initializeEdit(id, cartItems, rawOrder.client_id, rawOrder.order_type);

    present({
      message: 'Order loaded into cart for editing.',
      duration: 2000,
      color: 'success'
    });

    history.push('/app/cart');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="order-details-header">
          <IonButtons slot="start">
            <IonButton onClick={() => {
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
              history.goBack();
            }}>
              <IonIcon icon={arrowBack} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Order #{order?.id || '...'}</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={notificationsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="order-details-content">
        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" color="primary" />
            <p>Loading order details...</p>
          </div>
        ) : order ? (
          <div className="modal-body-padding">
            <div className="top-action-bar">
              <button className="screenshot-pdf-btn" onClick={handleDownloadPDF}>
                Download PDF
              </button>
              <button className="edit-order-btn" onClick={handleEditOrder}>
                Refine Order
              </button>
            </div>

            <div className="status-hero-card">
              <div className="hero-head">
                <h3>Order Status</h3>
                <div className="hero-status-pill">
                  <span className="dot"></span>
                  {order.status}
                </div>
              </div>

              <div className="hero-info-grid">
                <div className="hero-item">
                  <div className="icon-wrap"><IonIcon icon={calendarOutline} /></div>
                  <div className="text-wrap">
                    <span className="label">Ordered On</span>
                    <span className="value">{order.date}</span>
                  </div>
                </div>
                <div className="hero-item">
                  <div className="icon-wrap"><IonIcon icon={timeOutline} /></div>
                  <div className="text-wrap">
                    <span className="label">Expected Delivery</span>
                    <span className="value">{order.expectedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-white-card">
              <div className="card-title-row">
                <IonIcon icon={businessOutline} className="title-icon" />
                <h4>Vendor Details</h4>
              </div>
              <div className="vendor-body">
                <h5 className="vendor-name-large">{order.shopName}</h5>
                <div className="contact-row">
                  <IonIcon icon={locationOutline} />
                  <p>{order.address}</p>
                </div>
                <div className="contact-row">
                  <IonIcon icon={callOutline} />
                  <p>{order.phone}</p>
                </div>
              </div>
            </div>

            <div className="details-white-card">
              <div className="card-title-row flex-between">
                <div className="title-left">
                  <IonIcon icon={cubeOutline} className="title-icon" />
                  <h4>Order Items</h4>
                </div>
              </div>

              <div className="items-table">
                {order.items.length > 0 ? (
                  order.items.map((item: any, idx: number) => (
                    <div key={idx} className="table-item-row">
                      <div className="item-details">
                        <p className="item-name-qty">{item.qty} {item.name}</p>
                        <p className="item-spec">Size: {item.size}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="ion-text-center ion-padding">No items found in this order.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="ion-padding ion-text-center">
            <IonText color="medium">Order not found.</IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default OrderDetails;
