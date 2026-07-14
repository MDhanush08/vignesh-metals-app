import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonSearchbar,
  IonSpinner,
  useIonToast,
  IonFab,
  IonFabButton,
  useIonViewWillEnter,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/react';
import {
  personOutline,
  locationOutline,
  callOutline,
  addOutline,
  chevronForwardOutline,
  peopleOutline,
  downloadOutline,
  notificationsOutline
} from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getClients, ApiClient, getClientsDownloadUrl } from '../services/clientService';
import AppHeader from '../components/common/AppHeader';
import EmptyState from '../components/common/EmptyState';
import './Clients.css';

const Clients: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [present] = useIonToast();

  useIonViewWillEnter(() => {
    fetchClients(1, true);
  });

  const fetchClients = async (pageNumber: number = 1, isReset: boolean = false) => {
    if (isReset) {
      setLoading(true);
      setPage(1);
      setHasMore(true);
    }
    try {
      const limit = 20;
      const response = await getClients(pageNumber, limit);
      const newClients = response.response?.data || [];
      
      if (isReset) {
        setClients(newClients);
      } else {
        setClients(prev => {
          const filteredNew = newClients.filter(nc => !prev.some(pc => pc._id === nc._id));
          return [...prev, ...filteredNew];
        });
      }

      if (newClients.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      present({ message: 'Failed to load clients.', duration: 2000, color: 'danger' });
    } finally {
      if (isReset) setLoading(false);
    }
  };

  const loadMoreClients = async (e: any) => {
    if (!hasMore) {
      e.target.complete();
      return;
    }
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchClients(nextPage, false);
    e.target.complete();
  };

  const handleDownloadClients = async () => {
    const downloadUrl = getClientsDownloadUrl();
    present({ message: 'Preparing client data export...', duration: 2000, color: 'primary', position: 'bottom' });

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
      link.setAttribute('download', `clients-registry-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      present({ message: 'Client list download started!', duration: 2000, color: 'success' });
    } catch (error) {
      present({ message: 'Download failed. Please try again later.', duration: 3000, color: 'danger' });
    }
  };

  const filteredClients = clients.filter(c =>
    c.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    c.client_code?.toLowerCase().includes(searchText.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchText.toLowerCase())
  );

  const HeaderButtons = (
    <>
      <IonButton fill="clear" onClick={handleDownloadClients}>
        <IonIcon icon={downloadOutline} slot="icon-only" />
      </IonButton>
      <IonButton fill="clear" routerLink="/app/clients-add">
        <IonIcon icon={addOutline} slot="icon-only" />
      </IonButton>
    </>
  );

  return (
    <IonPage>
      <AppHeader title="Our Clients" rightButtons={HeaderButtons} />

      <IonContent className="page-content-premium">
        <div className="search-wrapper-premium">
          <IonSearchbar
            placeholder="Search by Name, Code or City"
            className="premium-searchbar"
            value={searchText}
            onIonInput={e => setSearchText(e.detail.value!)}
            mode="ios"
          />
        </div>

        <div className="clients-list">
          {loading ? (
            <div className="ion-text-center ion-padding">
              <IonSpinner name="crescent" color="primary" />
              <p>Loading clients...</p>
            </div>
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client, index) => (
              <div
                key={client._id}
                className="colorful-card"
                onClick={() => {
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                  history.push(`/app/clients/${client._id}`);
                }}
              >
                <div className={`icon-box color-${(index % 5) + 1}`}>
                  <IonIcon icon={personOutline} />
                </div>

                <div className="card-content-main">
                  <div className="card-header-main">
                    <span className="client-id-badge">{client.client_code || 'CLI'}</span>
                    <h3 className="client-name-text">{client.name}</h3>
                  </div>

                  <div className="card-footer-metrics">
                    <div className="metric-item">
                      <IonIcon icon={callOutline} />
                      <span className="metric-value">{client.phone}</span>
                    </div>
                    <div className="metric-item">
                      <IonIcon icon={locationOutline} />
                      <span className="metric-value truncate">{client.city}</span>
                    </div>
                  </div>
                </div>

                <div className="arrow-action">
                  <IonIcon icon={chevronForwardOutline} />
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={peopleOutline}
              title="No Clients Found"
              description="Start by adding your first client"
              actionText="Add Client"
              onAction={() => history.push('/app/clients-add')}
            />
          )}
        </div>

        <IonInfiniteScroll
          onIonInfinite={loadMoreClients}
          disabled={!hasMore}
        >
          <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more clients..."></IonInfiniteScrollContent>
        </IonInfiniteScroll>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/app/clients-add" className="custom-fab">
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Clients;
