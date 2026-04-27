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
            <IonButton routerLink="/app/clients-add">
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
            filteredClients.map((client) => (
              <IonCard
                key={client._id}
                className="client-card ion-activatable"
                onClick={() => {
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                  history.push(`/app/clients/${client._id}`);
                }}
              >
                <div className="card-top-accent"></div>
                <IonCardHeader>
                  <div className="client-header-row">
                    <div className="client-code-tag">CLIENT</div>
                    <IonIcon icon={personOutline} className="avatar-icon" />
                  </div>
                  <IonCardTitle className="client-name">{client.name}</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  <div className="client-info-grid">
                    <div className="info-row">
                      <IonIcon icon={callOutline} />
                      <span>{client.phone}</span>
                    </div>
                    <div className="info-row">
                      <IonIcon icon={locationOutline} />
                      <span className="truncate">{client.city}, {client.state}</span>
                    </div>
                  </div>
                  <div className="card-action">
                    <IonButton fill="clear" size="small" className="view-details-btn">
                      View Details
                      <IonIcon icon={chevronForwardOutline} slot="end" />
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
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
