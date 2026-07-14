import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonCheckbox,
  IonLabel,
  useIonToast,
  useIonLoading
} from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  eyeOutline,
  eyeOffOutline,
  mailOutline,
  lockClosedOutline
} from 'ionicons/icons';
import { authService } from '../services/authService';
import './Login.css';

const Login: React.FC = () => {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    await presentLoading({
      message: 'Signing in...',
      duration: 5000,
    });

    try {
      const apiResponse = await authService.login({ email, password });

      if (apiResponse && apiResponse.response) {
        // Store token and user data from the nested response object
        localStorage.setItem('token', apiResponse.response.token);
        localStorage.setItem('user', JSON.stringify(apiResponse.response));
      }

      await dismissLoading();

      presentToast({
        message: 'Login successful!',
        duration: 2000,
        color: 'success',
        position: 'top'
      });

      // Navigate to products
      history.push('/app/products');
    } catch (error: any) {
      await dismissLoading();
      presentToast({
        message: error.message || 'Login failed. Please check your credentials.',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
    }
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
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value!)}
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
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
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

