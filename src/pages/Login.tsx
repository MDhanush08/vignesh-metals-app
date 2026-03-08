import {
  IonContent,
  IonPage,
  IonInput,
  IonItem,
  IonButton,
  IonIcon,
  IonText,
  IonCheckbox,
  IonLabel
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  eyeOutline,
  eyeOffOutline,
  mailOutline,
  lockClosedOutline
} from 'ionicons/icons';
import './Login.css';

const Login: React.FC = () => {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    history.push('/app/dashboard');
  };

  return (
    <IonPage>
      <IonContent className="login-page-content" scrollY={false}>
        {/* Background Decorative Elements */}
        <div className="login-bg-decoration">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
        </div>

        <div className="login-main-container">
          <div className="login-header-section">
            <div className="login-logo-holder">
              <img
                src="/assets/logo.jpg"
                alt="Vignesh Metals"
                className="login-brand-logo"
              />
            </div>
            <IonText color="dark">
              <p className="login-welcome-text">Please sign in to your salesperson account</p>
            </IonText>
          </div>

          <form className="login-form-wrapper" onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <div className="custom-input-container">
                <IonIcon icon={mailOutline} className="input-prefix-icon" />
                <IonInput
                  type="email"
                  placeholder="name@vigneshmetals.com"
                  className="login-input-field"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="custom-input-container">
                <IonIcon icon={lockClosedOutline} className="input-prefix-icon" />
                <IonInput
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="login-input-field"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                </button>
              </div>
            </div>

            <div className="login-extras">
              <div className="remember-me">
                <IonCheckbox slot="start" mode="md" />
                <IonLabel>Remember Me</IonLabel>
              </div>
            </div>

            <div className="login-action-section">
              <IonButton
                expand="block"
                type="submit"
                className="login-submit-btn"
              >
                Sign In
              </IonButton>
            </div>
          </form>

          <div className="login-footer">
            <p>© 2024 Vignesh Metals. All Rights Reserved.</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
