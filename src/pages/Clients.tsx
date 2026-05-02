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
  peopleOutline
} from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getClients, ApiClient } from '../services/clientService';
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
          <div className="clients-page-intro">
            <IonText color="primary">
              <h1>Client Registry</h1>
              <p>Manage your business partners and contacts</p>
            </IonText>
          </div>
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
