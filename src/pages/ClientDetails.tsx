import {
  IonContent,
  IonPage,
  IonIcon,
  IonButton,
  IonText,
  useIonViewWillEnter,
  IonSpinner,
  useIonToast
} from '@ionic/react';
import {
  personOutline,
  locationOutline,
  callOutline,
  mailOutline,
  createOutline,
  shieldCheckmarkOutline,
  notificationsOutline
} from 'ionicons/icons';
import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { getClientById, ApiClient } from '../services/clientService';
import AppHeader from '../components/common/AppHeader';
import './ClientDetails.css';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [client, setClient] = useState<ApiClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();

  useIonViewWillEnter(() => {
    fetchClientDetails();
  });

  const fetchClientDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await getClientById(id);
      setClient(response.response);
    } catch (error) {
      present({ message: 'Error loading client details.', duration: 2000, color: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const RightButtons = (
    <>
      <IonButton onClick={() => history.push(`/app/clients-edit/${id}`)}>
        <IonIcon icon={createOutline} slot="icon-only" />
      </IonButton>
    </>
  );

  return (
    <IonPage>
      <AppHeader title="Client Details" showBackButton={true} rightButtons={RightButtons} />

      <IonContent className="page-content-premium client-details-content">
        {loading ? (
          <div className="ion-text-center ion-padding">
            <IonSpinner name="crescent" color="primary" />
            <p>Loading client details...</p>
          </div>
        ) : client ? (
          <div className="details-container">
            <div className="client-hero-section">
              <div className="avatar-large">
                <IonIcon icon={personOutline} />
              </div>
              <h2 className="client-main-name">{client.name}</h2>
              <div className="client-status-pill active">
                <IonIcon icon={shieldCheckmarkOutline} />
                Active Client
              </div>
            </div>

            <div className="details-group">
              <h4 className="section-title-premium">Contact Information</h4>
              <div className="details-card-white">
                <div className="info-item-row">
                  <div className="item-icon mail"><IonIcon icon={mailOutline} /></div>
                  <div className="item-content">
                    <span className="item-label">Email Address</span>
                    <span className="item-value">{client.email}</span>
                  </div>
                </div>
                <div className="info-item-row">
                  <div className="item-icon phone"><IonIcon icon={callOutline} /></div>
                  <div className="item-content">
                    <span className="item-label">Phone Number</span>
                    <span className="item-value">+{client.country_code} {client.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-group">
              <h4 className="section-title-premium">Address Details</h4>
              <div className="details-card-white">
                <div className="info-item-row">
                  <div className="item-icon location"><IonIcon icon={locationOutline} /></div>
                  <div className="item-content">
                    <span className="item-label">Address</span>
                    <span className="item-value">
                      {client.Address_line_one}, {client.Address_line_two}<br />
                      {client.city}, {client.state}, {client.country} - {client.pincode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="ion-padding ion-text-center">
            <IonText color="medium">Client not found.</IonText>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ClientDetails;

