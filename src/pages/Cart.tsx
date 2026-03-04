import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonIcon, IonButton } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import React from 'react';

const Cart: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle>Cart</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={notificationsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Your Cart</h2>
        <p>Inside design will be added later.</p>
      </IonContent>
    </IonPage>
  );
};

export default Cart;
