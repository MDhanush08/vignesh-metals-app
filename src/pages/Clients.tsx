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
  IonText,
  IonSearchbar,
  IonSpinner,
  useIonToast,
  IonFab,
  IonFabButton,
  useIonViewWillEnter
} from '@ionic/react';
import {
  notificationsOutline,
  personOutline,
  locationOutline,
  callOutline,
  addOutline,
  chevronForwardOutline,
  peopleOutline,
  downloadOutline
} from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getClients, ApiClient, getClientsDownloadUrl } from '../services/clientService';
import './Clients.css';

const Clients: React.FC = () => {
  const history = useHistory();
  const [searchText, setSearchText] = useState('');
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();

  useIonViewWillEnter(() => {
    fetchClients();
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await getClients(1, 100);
      setClients(response.response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      present({
        message: 'Failed to load clients.',
        duration: 2000,
        color: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClients = async () => {
    const downloadUrl = getClientsDownloadUrl();

    present({
      message: 'Preparing client data export...',
      duration: 2000,
      color: 'primary',
      position: 'bottom'
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clients-registry-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      present({
        message: 'Client list download started!',
        duration: 2000,
        color: 'success'
      });
    } catch (error) {
      console.error('Download error:', error);
      present({
        message: 'Download failed. Please try again later.',
        duration: 3000,
        color: 'danger'
      });
    }
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(searchText.toLowerCase()) ||
    c.client_code?.toLowerCase().includes(searchText.toLowerCase()) ||
    c.city.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="clients-header">
          <IonTitle>Our Clients</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={handleDownloadClients}>
              <IonIcon icon={downloadOutline} slot="icon-only" />
            </IonButton>
            <IonButton fill="clear" routerLink="/app/clients-add">
              <IonIcon icon={addOutline} slot="icon-only" />
            </IonButton>
            <IonButton>
              <IonIcon icon={notificationsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="clients-content">
        <div className="search-wrapper">
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
            <div className="no-clients-found">
              <IonIcon icon={peopleOutline} className="empty-icon" />
              <h3>No Clients Found</h3>
              <p>Start by adding your first client</p>
              <IonButton fill="outline" color="primary" routerLink="/app/clients-add">
                Add Client
              </IonButton>
            </div>
          )}
        </div>

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
