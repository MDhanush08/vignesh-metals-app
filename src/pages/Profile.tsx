import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonButton,
  IonAvatar,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  useIonAlert,
  IonRippleEffect
} from '@ionic/react';
import {
  notificationsOutline,
  logOutOutline,
  mailOutline,
  personOutline,
  cartOutline,
  chevronForwardOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import './Profile.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();

  const salesperson = {
    name: 'Dhanush M',
    email: 'dhanush@vigneshmetals.com',
    totalOrders: 148
  };

  const handleLogout = () => {
    presentAlert({
      header: 'Confirm Logout',
      message: 'Are you sure you want to sign out from the application?',
      buttons: [
        { text: 'Stay', role: 'cancel' },
        {
          text: 'Sign Out',
          role: 'confirm',
          handler: () => history.push('/login')
        }
      ],
      mode: 'ios'
    });
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="profile-header">
          <IonTitle>My Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={notificationsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

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
            <h2>{salesperson.name}</h2>
            <p>Sales Executive</p>
          </IonText>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon orders">
              <IonIcon icon={cartOutline} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{salesperson.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">
              <IonIcon icon={shieldCheckmarkOutline} />
            </div>
            <div className="stat-info">
              <span className="stat-value">Active</span>
              <span className="stat-label">Status</span>
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
                <span className="value">{salesperson.name}</span>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-icon">
                <IonIcon icon={mailOutline} />
              </div>
              <div className="detail-info">
                <span className="label">Email ID</span>
                <span className="value">{salesperson.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
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
