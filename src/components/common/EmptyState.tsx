import React from 'react';
import { IonIcon, IonButton } from '@ionic/react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="empty-state-premium">
      <IonIcon icon={icon} className="empty-state-icon-premium" />
      <h3>{title}</h3>
      <p>{description}</p>
      {actionText && onAction && (
        <IonButton mode="ios" className="clear-all-action" onClick={onAction}>
          {actionText}
        </IonButton>
      )}
    </div>
  );
};

export default EmptyState;
