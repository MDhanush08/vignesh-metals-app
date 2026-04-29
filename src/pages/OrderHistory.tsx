import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonText,
  IonSearchbar,
  IonSpinner,
  useIonToast,
  useIonViewWillEnter
} from '@ionic/react';
import {
  notificationsOutline,
  calendarOutline,
  idCardOutline,
  chevronForwardOutline,
  filterOutline,
  cubeOutline
} from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getOrders, ApiOrder } from '../services/orderService';
import { getClients, ApiClient } from '../services/clientService';
import './OrderHistory.css';

const OrderHistory: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientsMap, setClientsMap] = useState<Record<string, string>>({});
  const [present] = useIonToast();

  const statuses = ['All', 'Delivered', 'Processing', 'In Transit', 'Cancelled'];
  const types = ['All', 'General', 'Emergency'];

  useIonViewWillEnter(() => {
    fetchOrders();
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch clients first to map names
      const clientsResponse = await getClients(1, 200);
      const cMap: Record<string, string> = {};
      clientsResponse.response.data.forEach((c: ApiClient) => {
        cMap[c._id] = c.name;
      });
      setClientsMap(cMap);

      const result = await getOrders(1, 50);
      console.log("response .... Orders", result);

      const mappedOrders = result.response.data.map((o: ApiOrder) => ({
        id: o.order_number || o._id.substring(0, 8),
        realId: o._id,
        shopName: cMap[o.client_id] || o.email.split('@')[0].toUpperCase() || 'CLIENT', // Fallback to email prefix
        type: o.order_type === 1 ? 'General' : 'Emergency',
        date: new Date(o.approve_at || Date.now()).toLocaleDateString(),
        status: o.status === 1 ? 'Processing' : o.status === 2 ? 'In Transit' : 'Delivered'
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      present({
        message: 'Failed to load orders.',
        duration: 2000,
        color: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchText.toLowerCase()) ||
      o.shopName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchesType = typeFilter === 'All' || o.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

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
        <div className="review-sticky-header">
          <div className="review-top-section">
            <IonSearchbar
              placeholder="Search by Order ID or Shop"
              className="review-search"
              value={searchText}
              onIonInput={e => setSearchText(e.detail.value!)}
            />
            <IonButton
              fill="clear"
              className={`filter-toggle-btn ${(statusFilter !== 'All' || typeFilter !== 'All') ? 'active' : ''}`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <IonIcon icon={filterOutline} slot="icon-only" />
            </IonButton>
          </div>

          {isFilterOpen && (
            <div className="filter-panel animated-fold">
              <div className="filter-group">
                <p className="filter-label">Status</p>
                <div className="filter-pills">
                  {statuses.map(s => (
                    <button
                      key={s}
                      className={`pill ${statusFilter === s ? 'active' : ''}`}
                      onClick={() => setStatusFilter(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <p className="filter-label">Type</p>
                <div className="filter-pills">
                  {types.map(t => (
                    <button
                      key={t}
                      className={`pill ${typeFilter === t ? 'active' : ''}`}
                      onClick={() => setTypeFilter(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="orders-list">
          {loading ? (
            <div className="ion-text-center ion-padding">
              <IonSpinner name="crescent" color="primary" />
              <p>Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <IonCard
                key={order.realId}
                className="review-card ion-activatable"
                onClick={() => {
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                  history.push(`/app/orders/${order.realId}`);
                }}
              >
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
                    <IonButton
                      fill="clear"
                      size="small"
                      className="details-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (document.activeElement instanceof HTMLElement) {
                          document.activeElement.blur();
                        }
                        history.push(`/app/orders/${order.realId}`);
                      }}
                    >
                      View Full Details
                      <IonIcon icon={chevronForwardOutline} slot="end" />
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))
          ) : (
            <div className="no-orders-found">
              <IonIcon icon={cubeOutline} className="empty-icon" />
              <h3>No Orders Found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default OrderHistory;
