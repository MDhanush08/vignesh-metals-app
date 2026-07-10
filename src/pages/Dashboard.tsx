import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonSearchbar,
  IonBadge,
  IonCard,
  IonCardHeader,
  IonCardTitle,
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
  chevronForwardOutline,
  searchOutline
} from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../components/common/AppHeader';
import { getOrders, ApiOrder } from '../services/orderService';
import { getClientList, ApiClient } from '../services/clientService';
import { IonSpinner, useIonToast } from '@ionic/react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const history = useHistory();
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const clientsResponse = await getClientList(1, 200);
      const cMap: Record<string, any> = {};
      clientsResponse.response.data.forEach((c: ApiClient) => {
        cMap[c._id] = c;
      });

      const result = await getOrders(1, 5); // Fetch top 5 recent orders for dashboard

      const mappedOrders = result.response.data.map((o: ApiOrder) => {
        const clientInfo = typeof o.client === 'object' ? o.client : (typeof o.client_id === 'object' ? o.client_id : cMap[o.client_id as string]);
        let shopName = 'CLIENT';
        let location = 'Unknown Location';

        if (clientInfo) {
          shopName = clientInfo.name || shopName;
          location = [clientInfo.city, clientInfo.state].filter(Boolean).join(', ') || location;
        }

        return {
          id: o.order_number || o._id.substring(0, 8),
          realId: o._id,
          shopName,
          location,
          type: o.order_type === 1 ? 'Emergency' : 'General',
          date: new Date(o.approve_at || Date.now()).toLocaleDateString(),
          status: o.status === 1 ? 'Pending' : o.status === 2 ? 'Approved' : 'Delivered'
        };
      });

      setActiveOrders(mappedOrders);
    } catch (error) {
      present({ message: 'Failed to load dashboard orders.', duration: 2000, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <IonPage>
      <AppHeader title="Dashboard" />

      <IonContent className="page-content-premium ion-padding dashboard-content">
        <div className="sticky-header-container">
          <div className="welcome-banner">
            <IonText>
              <h1>Welcome back,</h1>
              <p>Here's what's happening today.</p>
            </IonText>
          </div>

          <div className="search-section">
            <IonSearchbar
              placeholder="Search Order ID or Shop"
              className="premium-searchbar"
              searchIcon={searchOutline}
              mode="ios"
            />
          </div>

          <div className="section-header">
            <h3>Active Orders</h3>
            <IonButton fill="clear" color="primary" className="view-all-btn" onClick={() => history.push('/app/orders')}>
              View All
            </IonButton>
          </div>
        </div>

        <div className="orders-list">
          {loading ? (
            <div className="ion-text-center ion-padding">
              <IonSpinner name="crescent" color="primary" />
              <p>Loading orders...</p>
            </div>
          ) : activeOrders.length > 0 ? (
            activeOrders.map((order) => (
              <IonCard 
                key={order.realId} 
                className="order-card ion-activatable" 
                onClick={() => history.push(`/app/orders/${order.realId}`)}
              >
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
            ))
          ) : (
            <div className="ion-text-center ion-padding">
              <p>No recent orders found.</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

