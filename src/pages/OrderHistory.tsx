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
  IonSearchbar
} from '@ionic/react';
import {
  notificationsOutline,
  calendarOutline,
  idCardOutline,
  chevronForwardOutline,
  filterOutline,
  cubeOutline
} from 'ionicons/icons';
import React, { useState } from 'react';
import './OrderHistory.css';

const OrderHistory: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const statuses = ['All', 'Delivered', 'Processing', 'In Transit', 'Cancelled'];
  const types = ['All', 'General', 'Emergency'];

  // Mock data for Order Review
  const orders = [
    {
      id: 'ORD-7742',
      shopName: 'Bala Metals & Steels',
      type: 'Emergency',
      date: '2024-03-05',
      status: 'In Transit'
    },
    {
      id: 'ORD-7741',
      shopName: 'Sri Vinayaga Hardware',
      type: 'General',
      date: '2024-03-04',
      status: 'Delivered'
    },
    {
      id: 'ORD-7740',
      shopName: 'Modern Build Solutions',
      type: 'General',
      date: '2024-03-02',
      status: 'Processing'
    },
    {
      id: 'ORD-7739',
      shopName: 'Royal Steel Traders',
      type: 'Emergency',
      date: '2024-03-01',
      status: 'Cancelled'
    },
  ];

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
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <IonCard
                key={order.id}
                className="review-card ion-activatable"
                routerLink={`/app/orders/${order.id}`}
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
                      routerLink={`/app/orders/${order.id}`}
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
