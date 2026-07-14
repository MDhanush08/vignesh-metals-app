import {
  IonContent,
  IonPage,
  IonIcon,
  IonText,
  useIonAlert,
  IonRippleEffect,
  IonSpinner,
  IonModal,
  IonButton,
  IonInput,
  useIonToast
} from '@ionic/react';
import {
  logOutOutline,
  mailOutline,
  personOutline,
  cartOutline,
  chevronForwardOutline,
  lockClosedOutline,
  peopleOutline,
  eyeOutline,
  eyeOffOutline,
  closeOutline,
  keyOutline,
  notificationsOutline
} from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { authService } from '../services/authService';
import { getClients } from '../services/clientService';
import { getHistoryListWithFilter } from '../services/orderService';
import AppHeader from '../components/common/AppHeader';
import './Profile.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();
  const user = authService.getUser();
  const [clientCount, setClientCount] = useState<number | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);

  // Change Password Modal State
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdErrors, setPwdErrors] = useState<{ old?: string; new?: string; confirm?: string }>({});

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const clientRes = await getClients(1, 1);
      setClientCount(clientRes.response.total);
    } catch (error) { }

    try {
      const orderRes = await getHistoryListWithFilter('All', 'All', '', 1, 1);
      setOrderCount(orderRes.response?.total || 0);
    } catch (error) { }
  };

  const resetPwdForm = () => {
    setOldPwd(''); setNewPwd(''); setConfirmPwd('');
    setShowOld(false); setShowNew(false); setShowConfirm(false);
    setPwdErrors({});
  };

  const handleChangePassword = async () => {
    const errors: { old?: string; new?: string; confirm?: string } = {};
    if (!oldPwd.trim()) errors.old = 'Current password is required';
    if (!newPwd.trim()) errors.new = 'New password is required';
    else if (newPwd.length < 6) errors.new = 'Password must be at least 6 characters';
    if (!confirmPwd.trim()) errors.confirm = 'Please confirm your new password';
    else if (newPwd !== confirmPwd) errors.confirm = 'Passwords do not match';

    if (Object.keys(errors).length > 0) {
      setPwdErrors(errors);
      return;
    }
    setPwdErrors({});

    setPwdLoading(true);
    try {
      await authService.changePassword({
        old_password: oldPwd,
        new_password: newPwd,
        confirm_password: confirmPwd
      });
      present({ message: 'Password changed successfully!', duration: 2500, color: 'success' });
      setShowChangePwd(false);
      resetPwdForm();
    } catch (error: any) {
      present({ message: error.message || 'Failed to change password.', duration: 3000, color: 'danger' });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleLogout = () => {
    presentAlert({
      header: 'Confirm Logout',
      message: 'Are you sure you want to sign out?',
      cssClass: 'logout-alert',
      buttons: [
        { text: 'Stay', role: 'cancel', cssClass: 'alert-button-cancel' },
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
      <AppHeader title="My Profile" />

      <IonContent className="page-content-premium profile-content">
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
          <div className="stat-card ion-activatable" onClick={() => history.push('/app/orders')}>
            <IonRippleEffect />
            <div className="stat-icon orders">
              <IonIcon icon={cartOutline} />
            </div>
            <div className="stat-info">
              <span className="stat-value">
                {orderCount !== null ? orderCount : <IonSpinner name="dots" />}
              </span>
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
          <h3 className="section-title-premium">Personal Information</h3>
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
            <div className="detail-item ion-activatable" onClick={() => history.push('/app/clients')}>
              <IonRippleEffect />
              <div className="detail-icon">
                <IonIcon icon={peopleOutline} />
              </div>
              <div className="detail-info" style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="value" style={{ fontSize: '15px' }}>Our Clients</span>
                <IonIcon icon={chevronForwardOutline} style={{ color: '#cbd5e1', fontSize: '18px' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="action-tile ion-activatable" onClick={() => setShowChangePwd(true)}>
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

        {/* Change Password Modal */}
        <IonModal
          isOpen={showChangePwd}
          onDidDismiss={() => { setShowChangePwd(false); resetPwdForm(); }}
          className="change-pwd-modal-centered"
        >
          <div className="pwd-modal-header">
            <div className="pwd-modal-title-row">
              <div className="pwd-modal-icon">
                <IonIcon icon={keyOutline} />
              </div>
              <div>
                <h2>Change Password</h2>
                <p>Update your account security</p>
              </div>
            </div>
            <button className="pwd-close-btn" onClick={() => { setShowChangePwd(false); resetPwdForm(); }}>
              <IonIcon icon={closeOutline} />
            </button>
          </div>

          <IonContent className="pwd-ion-content">
            <div className="pwd-form-body">
              <div className="pwd-input-group">
                <label className="pwd-label">Current Password</label>
                <div className={`pwd-input-wrap ${pwdErrors.old ? 'err' : ''}`}>
                  <IonInput
                    type={showOld ? 'text' : 'password'}
                    value={oldPwd}
                    onIonInput={e => setOldPwd(e.detail.value!)}
                    placeholder="Enter current password"
                    className="pwd-native-input"
                  />
                  <button type="button" className="pwd-eye-btn" onClick={() => setShowOld(!showOld)}>
                    <IonIcon icon={showOld ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>
                {pwdErrors.old && <span className="pwd-error">{pwdErrors.old}</span>}
              </div>

              <div className="pwd-input-group">
                <label className="pwd-label">New Password</label>
                <div className={`pwd-input-wrap ${pwdErrors.new ? 'err' : ''}`}>
                  <IonInput
                    type={showNew ? 'text' : 'password'}
                    value={newPwd}
                    onIonInput={e => setNewPwd(e.detail.value!)}
                    placeholder="Enter new password"
                    className="pwd-native-input"
                  />
                  <button type="button" className="pwd-eye-btn" onClick={() => setShowNew(!showNew)}>
                    <IonIcon icon={showNew ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>
                {pwdErrors.new && <span className="pwd-error">{pwdErrors.new}</span>}
              </div>

              <div className="pwd-input-group">
                <label className="pwd-label">Confirm New Password</label>
                <div className={`pwd-input-wrap ${pwdErrors.confirm ? 'err' : ''}`}>
                  <IonInput
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPwd}
                    onIonInput={e => setConfirmPwd(e.detail.value!)}
                    placeholder="Re-enter new password"
                    className="pwd-native-input"
                  />
                  <button type="button" className="pwd-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                    <IonIcon icon={showConfirm ? eyeOffOutline : eyeOutline} />
                  </button>
                </div>
                {pwdErrors.confirm && <span className="pwd-error">{pwdErrors.confirm}</span>}
              </div>

              <div className="pwd-modal-footer">
                <IonButton
                  expand="block"
                  className="pwd-submit-btn"
                  onClick={handleChangePassword}
                  disabled={pwdLoading}
                >
                  {pwdLoading ? <IonSpinner name="crescent" /> : 'Update Password'}
                </IonButton>
                <button type="button" className="pwd-cancel-btn" onClick={() => { setShowChangePwd(false); resetPwdForm(); }}>
                  Cancel
                </button>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Profile;

