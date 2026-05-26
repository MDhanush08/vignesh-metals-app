import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightButtons?: React.ReactNode;
  className?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  onBackClick,
  rightButtons,
  className = ''
}) => {
  const history = useHistory();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      history.goBack();
    }
  };

  return (
    <IonHeader className="ion-no-border">
      <IonToolbar className={`app-header-premium ${className}`}>
        {showBackButton && (
          <IonButtons slot="start">
            <IonButton onClick={handleBack}>
              <IonIcon icon={arrowBack} slot="icon-only" />
            </IonButton>
          </IonButtons>
        )}
        <IonTitle>{title}</IonTitle>
        {rightButtons && (
          <IonButtons slot="end">
            {rightButtons}
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default AppHeader;
