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
  useIonViewWillEnter
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
import './OrderDetails.css';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [order, setOrder] = useState<any>(null);

  useIonViewWillEnter(() => {
    // Mock data based on the provided ID
    setTimeout(() => {
      setOrder({
        id: id || 'ORD-7742',
        shopName: 'Bala Metals & Steels',
        type: 'Emergency',
        date: '2024-03-05',
        status: 'In Transit',
        address: '123, Industrial Street, Chennai, TN - 600032',
        phone: '+91 98765 43210',
        expectedDate: '2024-03-10',
        items: [
          { name: 'Steel Rod 12mm', qty: '100 Units', rate: '₹450.00', GST: '5%', total: '₹47,250.00' },
          { name: 'Iron Beam 6m', qty: '20 Units', rate: '₹2,500.00', GST: '5%', total: '₹52,500.00' }
        ],
        subtotal: '₹95,000.00',
        gstTotal: '₹4,750.00',
        grandTotal: '₹99,750.00'
      });
    }, 50);
  });

  const handleDownloadPDF = () => {
    console.log('Generating PDF Invoice...');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="order-details-header">
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={arrowBack} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>Order #{order?.id || id || '...'}</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={notificationsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="order-details-content">
        {order ? (
          <div className="modal-body-padding">
            <div className="top-action-bar">
              <button className="screenshot-pdf-btn" onClick={handleDownloadPDF}>
                Download as PDF
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
                    <span className="value">{order.date}, 10:00 PM</span>
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
                <button className="inline-edit-btn">Edit</button>
              </div>

              <div className="items-table">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="table-item-row">
                    <div className="item-details">
                      <p className="item-name-qty">{item.qty} {item.name}</p>
                      <p className="item-code">Item Code: {700119 + idx}</p>
                      <p className="item-pricing">Rate: {item.rate} per UNIT</p>
                      <p className="item-pricing">GST (5%): Included</p>
                    </div>
                    <div className="item-total">
                      {item.total}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-section">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{order.subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>GST (5%)</span>
                  <span>{order.gstTotal}</span>
                </div>
                <div className="summary-row grand-total">
                  <span>Grand Total</span>
                  <span>{order.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="ion-padding ion-text-center">
            <IonText color="medium">Loading order details...</IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default OrderDetails;
