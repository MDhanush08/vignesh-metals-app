import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonIcon, IonButton } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import React from 'react';

const Profile: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle>Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={notificationsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Profile</h2>
        <p>Inside design will be added later.</p>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
