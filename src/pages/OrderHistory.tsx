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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonText,
  IonSearchbar
} from '@ionic/react';
import {
  notificationsOutline,
  calendarOutline,
  businessOutline,
  idCardOutline,
  chevronForwardOutline,
  filterOutline
} from 'ionicons/icons';
import React from 'react';
import './OrderHistory.css';

const OrderHistory: React.FC = () => {
  // Mock data for Order Review
  const orders = [
    { id: 'ORD-7742', shopName: 'Bala Metals & Steels', type: 'Emergency', date: '2024-03-05', status: 'In Transit' },
    { id: 'ORD-7741', shopName: 'Sri Vinayaga Hardware', type: 'General', date: '2024-03-04', status: 'Delivered' },
    { id: 'ORD-7740', shopName: 'Modern Build Solutions', type: 'General', date: '2024-03-02', status: 'Processing' },
    { id: 'ORD-7739', shopName: 'Royal Steel Traders', type: 'Emergency', date: '2024-03-01', status: 'Cancelled' },
  ];

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="order-review-header">
          <IonTitle>Order Review</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={notificationsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="order-review-content">
        <div className="review-top-section">
          <IonSearchbar placeholder="Search by Order ID or Shop" className="review-search" />
          <IonButton fill="clear" className="filter-btn">
            <IonIcon icon={filterOutline} slot="icon-only" />
          </IonButton>
        </div>

        <div className="orders-list">
          {orders.map((order) => (
            <IonCard key={order.id} className="review-card">
              <div className={`status-border ${order.status.toLowerCase().replace(' ', '-')}`}></div>
              <IonCardHeader>
                <div className="card-top-header">
                  <div className="id-badge">
                    <IonIcon icon={idCardOutline} />
                    <span>{order.id}</span>
                  </div>
                  <IonBadge className={order.type.toLowerCase() === 'emergency' ? 'badge-emergency' : 'badge-general'}>
                    {order.type}
                  </IonBadge>
                </div>
                <IonCardTitle className="shop-name">{order.shopName}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <div className="info-grid">
                  <div className="info-box">
                    <IonIcon icon={calendarOutline} />
                    <IonText>{order.date}</IonText>
                  </div>
                  <div className="info-box">
                    <div className="status-label">
                      <span className={`status-dot ${order.status.toLowerCase().replace(' ', '-')}`}></span>
                      <IonText>{order.status}</IonText>
                    </div>
                  </div>
                </div>
                <div className="card-action">
                  <IonButton fill="clear" size="small" className="details-link">
                    View Full Details
                    <IonIcon icon={chevronForwardOutline} slot="end" />
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrderHistory;
