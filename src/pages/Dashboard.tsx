import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonButton,
  IonSearchbar,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText
} from '@ionic/react';
import {
  notificationsOutline,
  locationOutline,
  calendarOutline,
  alertCircleOutline,
  chevronForwardOutline,
  searchOutline
} from 'ionicons/icons';
import React from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  // Mock data for Dashboard
  const activeOrders = [
    { id: 'ORD-001', shopName: 'Bala Metals & Steels', date: '2024-03-05', location: 'Chennai, TN', type: 'Emergency', status: 'In Progress' },
    { id: 'ORD-002', shopName: 'Sri Vinayaga Hardware', date: '2024-03-04', location: 'Madurai, TN', type: 'General', status: 'Shipped' },
    { id: 'ORD-003', shopName: 'Modern Build Solutions', date: '2024-03-03', location: 'Coimbatore, TN', type: 'General', status: 'Delivered' },
  ];

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="dashboard-toolbar">
          <IonTitle>Dashboard</IonTitle>
          <IonButtons slot="end">
            <div className="notification-btn">
              <IonButton>
                <IonIcon icon={notificationsOutline} slot="icon-only" />
              </IonButton>
              <span className="dot"></span>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding dashboard-content">
        <div className="welcome-banner">
          <IonText>
            <h1>Welcome back,</h1>
            <p>Here's what's happening with your orders today.</p>
          </IonText>
        </div>

        <div className="search-section">
          <IonSearchbar
            placeholder="Search Order ID or Shop"
            className="custom-searchbar"
            searchIcon={searchOutline}
          />
        </div>

        <div className="section-header">
          <h3>Active Orders</h3>
          <IonButton fill="clear" color="primary" className="view-all-btn">
            View All
          </IonButton>
        </div>

        <div className="orders-list">
          {activeOrders.map((order) => (
            <IonCard key={order.id} className="order-card">
              <div className={`status-accent ${order.type.toLowerCase()}`}></div>
              <IonCardHeader>
                <div className="card-top-row">
                  <IonText color="medium" className="order-id">{order.id}</IonText>
                  <IonBadge className={order.type.toLowerCase() === 'emergency' ? 'badge-emergency' : 'badge-general'}>
                    {order.type}
                  </IonBadge>
                </div>
                <IonCardTitle className="shop-name">{order.shopName}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <IonGrid className="ion-no-padding">
                  <IonRow className="info-row">
                    <IonCol size="6">
                      <div className="info-item">
                        <IonIcon icon={calendarOutline} />
                        <IonText>{order.date}</IonText>
                      </div>
                    </IonCol>
                    <IonCol size="6">
                      <div className="info-item">
                        <IonIcon icon={locationOutline} />
                        <IonText>{order.location}</IonText>
                      </div>
                    </IonCol>
                  </IonRow>
                  <div className="card-footer">
                    <div className="status-indicator">
                      <span className={`status-dot ${order.status.replace(' ', '-').toLowerCase()}`}></span>
                      <IonText>{order.status}</IonText>
                    </div>
                    <IonIcon icon={chevronForwardOutline} className="arrow-icon" />
                  </div>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
