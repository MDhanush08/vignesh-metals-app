import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonSearchbar,
  IonSpinner,
  useIonToast,
  useIonViewWillEnter
} from '@ionic/react';
import {
  notificationsOutline,
  calendarOutline,
  chevronForwardOutline,
  filterOutline,
  cubeOutline,
  downloadOutline
} from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getOrders, ApiOrder, getTotalOrderDownloadUrl } from '../services/orderService';
import { getClientList, ApiClient } from '../services/clientService';
import AppHeader from '../components/common/AppHeader';
import './OrderHistory.css';

const OrderHistory: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();

  const statuses = ['All', 'Pending', 'Approved', 'Delivered'];
  const types = ['All', 'General', 'Emergency'];

  useIonViewWillEnter(() => {
    setSearchText('');
    setStatusFilter('All');
    setTypeFilter('All');
    fetchOrders();
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const clientsResponse = await getClientList(1, 200);
      const cMap: Record<string, string> = {};
      clientsResponse.response.data.forEach((c: ApiClient) => {
        cMap[c._id] = c.name;
      });

      const result = await getOrders(1, 50);

      const mappedOrders = result.response.data.map((o: ApiOrder) => ({
        id: o.order_number || o._id.substring(0, 8),
        realId: o._id,
        shopName: (o.client_id as any)?.name || cMap[o.client_id as any] || 'CLIENT',
        type: o.order_type === 1 ? 'Emergency' : 'General',
        date: new Date(o.approve_at || Date.now()).toLocaleDateString(),
        status: o.status === 1 ? 'Pending' : o.status === 2 ? 'Approved' : 'Delivered'
      }));

      setOrders(mappedOrders);
    } catch (error) {
      present({ message: 'Failed to load orders.', duration: 2000, color: 'danger' });
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

  const handleDownloadAll = async () => {
    const downloadUrl = getTotalOrderDownloadUrl();
    present({ message: 'Preparing all order records...', duration: 2000, color: 'primary', position: 'bottom' });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: { ...(token ? { 'Authorization': `Bearer ${token}` } : {}) }
      });

      if (!response.ok) throw new Error('Global export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `all-orders-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      present({ message: 'Global export started!', duration: 2000, color: 'success' });
    } catch (error) {
      present({ message: 'Failed to export orders. Please try again later.', duration: 3000, color: 'danger' });
    }
  };

  const RightButtons = (
    <>
      <IonButton onClick={handleDownloadAll} className="global-download-btn">
        <IonIcon icon={downloadOutline} slot="icon-only" />
      </IonButton>
    </>
  );

  return (
    <IonPage>
      <AppHeader title="Order Review" rightButtons={RightButtons} />

      <IonContent className="page-content-premium">
        <div className="review-sticky-header">
          <div className="review-top-section">
            <IonSearchbar
              placeholder="Search by Order ID or Shop"
              className="premium-searchbar"
              value={searchText}
              onIonInput={e => setSearchText(e.detail.value!)}
              mode="ios"
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
              <div className="filter-actions-row">
                <IonButton
                  fill="clear"
                  size="small"
                  className="clear-filters-action"
                  onClick={() => {
                    setStatusFilter('All');
                    setTypeFilter('All');
                    setSearchText('');
                  }}
                >
                  Clear All Filters
                </IonButton>
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
              <div
                key={order.realId}
                className="review-compact-card ion-activatable"
                onClick={() => {
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                  history.push(`/app/orders/${order.realId}`);
                }}
              >
                <div className={`status-strip ${order.status.toLowerCase().replace(' ', '-')}`}></div>
                <div className="card-inner-flex">
                  <div className="order-main-info">
                    <div className="order-meta-header">
                      <span className="order-number-pill">#{order.id}</span>
                      <span className={`order-type-tag ${order.type.toLowerCase()}`}>{order.type}</span>
                    </div>
                    <h3 className="shop-title-compact">{order.shopName}</h3>
                    <div className="order-meta-footer">
                      <div className="meta-item">
                        <IonIcon icon={calendarOutline} />
                        <span>{order.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="order-status-section">
                    <div className={`status-indicator-pill ${order.status.toLowerCase().replace(' ', '-')}`}>
                      <span className="status-dot"></span>
                      {order.status}
                    </div>
                    <IonIcon icon={chevronForwardOutline} className="arrow-hint" />
                  </div>
                </div>
              </div>
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

