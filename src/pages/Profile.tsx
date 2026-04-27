import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonText,
  useIonAlert,
  IonRippleEffect,
  IonSpinner
} from '@ionic/react';
import {
  logOutOutline,
  mailOutline,
  personOutline,
  cartOutline,
  chevronForwardOutline,
  shieldCheckmarkOutline,
  lockClosedOutline,
  peopleOutline
} from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { authService } from '../services/authService';
import { getClients } from '../services/clientService';
import './Profile.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const user = authService.getUser();
  const [clientCount, setClientCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClientCount();
  }, []);

  const fetchClientCount = async () => {
    try {
      const response = await getClients(1, 1);
      setClientCount(response.response.total);
    } catch (error) {
      console.error('Error fetching client count:', error);
    }
  };

  const handleLogout = () => {
    presentAlert({
      header: 'Confirm Logout',
      message: 'Are you sure you want to sign out from the application?',
      cssClass: 'logout-alert',
      buttons: [
        {
          text: 'Stay',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Sign Out',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: () => {
            authService.logout();
            window.location.href = '/login';
          }
        }
      ],
      mode: 'ios'
    });
  };

  return (
    <IonPage>
      <IonContent className="profile-content">
        <div className="profile-hero">
          <div className="avatar-container">
            <div className="avatar-ring">
              <div className="avatar-placeholder">
                <IonIcon icon={personOutline} />
              </div>
            </div>
            <div className="status-online"></div>
          </div>
          <IonText className="profile-name">
            <h2>{user?.name || 'User'}</h2>
            <p>{user?.user_type === 1 ? 'Administrator' : 'Sales Executive'}</p>
          </IonText>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon orders">
              <IonIcon icon={cartOutline} />
            </div>
            <div className="stat-info">
              <span className="stat-value">148</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="stat-card ion-activatable" onClick={() => history.push('/app/clients')}>
            <IonRippleEffect />
            <div className="stat-icon active">
              <IonIcon icon={peopleOutline} />
            </div>
            <div className="stat-info">
              <span className="stat-value">
                {clientCount !== null ? clientCount : <IonSpinner name="dots" />}
              </span>
              <span className="stat-label">Clients</span>
            </div>
          </div>
        </div>

        <div className="profile-details-list">
          <h3>Personal Information</h3>
          <div className="details-card">
            <div className="detail-item">
              <div className="detail-icon">
                <IonIcon icon={personOutline} />
              </div>
              <div className="detail-info">
                <span className="label">Full Name</span>
                <span className="value">{user?.name || 'N/A'}</span>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon">
                <IonIcon icon={mailOutline} />
              </div>
              <div className="detail-info">
                <span className="label">Email ID</span>
                <span className="value">{user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="action-tile ion-activatable" onClick={() => console.log('Change Password clicked')}>
            <IonRippleEffect />
            <div className="action-icon password">
              <IonIcon icon={lockClosedOutline} />
            </div>
            <span className="action-label">Change Password</span>
            <IonIcon icon={chevronForwardOutline} className="action-chevron" />
          </button>

          <button className="action-tile logout-tile ion-activatable" onClick={handleLogout}>
            <IonRippleEffect />
            <div className="action-icon logout">
              <IonIcon icon={logOutOutline} />
            </div>
            <span className="action-label">Sign Out</span>
            <IonIcon icon={chevronForwardOutline} className="action-chevron" />
          </button>
        </div>

        <div className="version-info">
          <p>Vignesh Metals App v1.0.4</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;

