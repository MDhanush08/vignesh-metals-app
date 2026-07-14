import {
  IonContent,
  IonPage,
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
  notificationsOutline
} from 'ionicons/icons';
import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getOrderById, getOrderDownloadUrl } from '../services/orderService';
import { getClientById } from '../services/clientService';
import { useCart } from '../context/CartContext';
import AppHeader from '../components/common/AppHeader';
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
      const data = result.response;
      setRawOrder(data);

      const clientId = typeof data.client_id === 'object' ? (data.client_id as any)._id : data.client_id;
      let clientName = 'CLIENT';

      try {
        const clientRes = await getClientById(clientId);
        if (clientRes && clientRes.response) {
          clientName = clientRes.response.name;
        }
      } catch (err) { }

      const mappedOrder = {
        id: data.order_number || data._id.substring(0, 8),
        clientName: clientName,
        type: data.order_type === 1 ? 'Emergency' : 'General',
        date: new Date(data.created_at || Date.now()).toLocaleDateString(),
        status: data.status === 1 ? 'Pending' : data.status === 2 ? 'Approved' : 'Delivered',
        address: data.address,
        phone: `+${data.country_code} ${data.phone}`,
        expectedDate: data.approve_at ? new Date(data.approve_at).toLocaleDateString() : 'TBD',
        items: (data.items_list || []).map((item: any) => ({
          name: item.product_name || item.name || 'Product',
          qty: item.qty || item.quantity || 1,
          size: item.size || 'Standard'
        }))
      };

      setOrder(mappedOrder);
    } catch (error) {
      present({ message: 'Error loading order details.', duration: 2000, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadOrder = async () => {
    if (!id) return;
    const downloadUrl = getOrderDownloadUrl(id);
    present({ message: 'Preparing order data...', duration: 2000, color: 'primary', position: 'bottom' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });

      if (!response.ok) throw new Error('Server returned an error');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order-${order?.id || id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      present({ message: 'Download started successfully!', duration: 2000, color: 'success' });
    } catch (error) {
      present({ message: 'Download failed. Please try again.', duration: 3000, color: 'danger' });
    }
  };

  const handleEditOrder = () => {
    if (!rawOrder || !id) return;

    const cartItems = (rawOrder.items_list || []).map((item: any) => ({
      id: item.product_id,
      name: item.product_name || item.name || 'Product',
      category: 'General',
      quantity: item.qty || item.quantity || 1,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=200',
      size: item.size || 'Small',
      sizeId: item.size_id || item.size
    }));

    const clientId = typeof rawOrder.client_id === 'object' ? rawOrder.client_id._id : rawOrder.client_id;
    initializeEdit(id, cartItems, clientId, rawOrder.order_type);

    present({ message: 'Order loaded into cart for editing.', duration: 2000, color: 'success' });
    history.push('/app/cart');
  };

  return (
    <IonPage>
      <AppHeader
        title={`Order #${order?.id || '...'}`}
        showBackButton={true}
      />

      <IonContent className="page-content-premium">
        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" color="primary" />
            <p>Loading order details...</p>
          </div>
        ) : order ? (
          <div className="modal-body-padding">
            <div className="top-action-bar">
              <button className="screenshot-pdf-btn" onClick={handleDownloadOrder}>
                Download Order
              </button>
              <button className="edit-order-btn" onClick={handleEditOrder}>
                Refine Order
              </button>
            </div>

            <div className="status-hero-card">
              <div className="hero-head">
                <h3>Order Status</h3>
                <div className={`hero-status-pill ${order.status.toLowerCase()}`}>
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
                <h4>Client Details</h4>
              </div>
              <div className="vendor-body">
                <h5 className="vendor-name-large">{order.clientName}</h5>
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

              <div className="items-list-container">
                {order.items.length > 0 ? (
                  order.items.map((item: any, idx: number) => (
                    <div key={idx} className="normal-item-row">
                      <div className="item-main-info">
                        <span className="item-qty-text">{item.qty} ×</span>
                        <div className="item-name-group">
                          <p className="item-name-text">{item.name}</p>
                          <p className="item-size-text">Size: {item.size}</p>
                        </div>
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

