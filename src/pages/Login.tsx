import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonItem,
  IonButton,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const history = useHistory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard on click
    history.push('/app/dashboard');
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-content">
        <div className="login-container">
          <div className="logo-section">
            <div className="logo-placeholder">
              <img src="/assets/logo.png" alt="Logo" className="app-logo" onError={(e) => {
                e.currentTarget.src = '';
              }} />
            </div>
            <IonText className="welcome-text">
              <h2>Welcome Back</h2>
            </IonText>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <IonItem lines="none" className="custom-input-item">
              <IonInput
                type="email"
                placeholder="Email Address"
                className="custom-input"
                required
              ></IonInput>
            </IonItem>

            <IonItem lines="none" className="custom-input-item ion-margin-top">
              <IonInput
                type="password"
                placeholder="Password"
                className="custom-input"
                required
              ></IonInput>
            </IonItem>

            <IonButton 
              expand="block" 
              type="submit" 
              className="login-button ion-margin-top"
            >
              Login
            </IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
