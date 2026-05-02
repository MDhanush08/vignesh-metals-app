import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  useIonToast,
  useIonLoading,
  IonText
} from '@ionic/react';
import {
  arrowBack,
  saveOutline,
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  businessOutline
} from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { createClient, updateClient, getClientById, ApiClient } from '../services/clientService';
import { authService } from '../services/authService';
import './AddEditClient.css';

const AddEditClient: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const history = useHistory();
  const isEditMode = !!id;
  const [presentToast] = useIonToast();
  const [presentLoading, dismissLoading] = useIonLoading();
  const user = authService.getUser();

  const [formData, setFormData] = useState<Partial<ApiClient>>({
    name: '',
    email: '',
    phone: '',
    country_code: '91',
    Address_line_one: '',
    Address_line_two: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    // gst_registration_type: 3,
    is_active: true,
    sales_person_id: user?._id || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      fetchClientForEdit();
    }
  }, [id]);

  const fetchClientForEdit = async () => {
    try {
      const response = await getClientById(id!);
      const clientData = response.response;
      setFormData({
        ...clientData,
        sales_person_id: clientData.sales_person_id || user?._id || ''
      });
    } catch (error) {
      console.error('Error fetching client for edit:', error);
      presentToast({
        message: 'Failed to load client data.',
        duration: 2000,
        color: 'danger'
      });
    }
  };

  const handleInputChange = (e: any, fieldName?: string) => {
    const name = fieldName || e.target.name;
    let value = e.detail?.value !== undefined ? e.detail.value : e.target.value;

    // Ensure country_code is stored as string
    if (name === 'country_code' && value !== undefined && value !== null) {
      value = String(value);
    }


    if (name === 'phone' || name === 'country_code' || name === 'pincode') {
      value = value.replace(/\D/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Required';
    if (!formData.email?.trim()) newErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Required';
    } else if (!/^\d{10,12}$/.test(formData.phone)) {
      newErrors.phone = 'Must be 10-12 digits';
    }

    if (!formData.Address_line_one?.trim()) newErrors.Address_line_one = 'Required';
    if (!formData.city?.trim()) newErrors.city = 'Required';
    if (!formData.state?.trim()) newErrors.state = 'Required';
    if (!formData.country?.trim()) newErrors.country = 'Required';
    if (!formData.pincode?.trim()) newErrors.pincode = 'Required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid PIN (6 digits)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (!validate()) {
      presentToast({
        message: 'Please fill all required fields correctly.',
        duration: 3000,
        color: 'warning',
        position: 'top'
      });
      return;
    }

    await presentLoading({ message: isEditMode ? 'Updating client...' : 'Creating client...' });

    try {
      // Create a clean payload matching the requested format
      const payload: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country_code: formData.country_code ? String(formData.country_code) : '91',
        sales_person_id: formData.sales_person_id || user?._id || '',
        Address_line_one: formData.Address_line_one,
        Address_line_two: formData.Address_line_two,
        city: formData.city,
        state: formData.state,
        country: formData.country || 'India',
        pincode: formData.pincode,
        is_active: formData.is_active ?? true
      };

      if (isEditMode && id) {
        await updateClient(id, payload);
        presentToast({ message: 'Client updated successfully!', color: 'success', duration: 2000 });
      } else {
        await createClient(payload);
        presentToast({ message: 'Client created successfully!', color: 'success', duration: 2000 });
      }

      // Fix ARIA focus warning by blurring before navigation
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      history.goBack();
    } catch (error) {
      console.error('Error saving client:', error);
      presentToast({ message: 'Error saving client. Please check your data.', color: 'danger', duration: 3000 });
    } finally {
      dismissLoading();
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="add-edit-header">
          <IonButtons slot="start">
            <IonButton onClick={() => {
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
              history.goBack();
            }}>
              <IonIcon icon={arrowBack} slot="icon-only" />
            </IonButton>
          </IonButtons>
          <IonTitle>{isEditMode ? 'Update Client' : 'Add New Client'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="add-edit-content">
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h4 className="form-section-title">General Information</h4>

              <div className="input-field-wrapper">
                <IonLabel className="field-label">Full Name</IonLabel>
                <div className={`input-inner ${errors.name ? 'error' : ''}`}>
                  <IonIcon icon={personOutline} />
                  <IonInput
                    name="name"
                    value={formData.name}
                    onIonInput={(e) => handleInputChange(e, 'name')}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>

              <div className="input-field-wrapper">
                <IonLabel className="field-label">Email Address</IonLabel>
                <div className={`input-inner ${errors.email ? 'error' : ''}`}>
                  <IonIcon icon={mailOutline} />
                  <IonInput
                    name="email"
                    type="email"
                    value={formData.email}
                    onIonInput={(e) => handleInputChange(e, 'email')}
                    placeholder="example@gmail.com"
                  />
                </div>
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="input-row">
                <div className="input-field-wrapper small">
                  <IonLabel className="field-label">Code</IonLabel>
                  <div className={`input-inner no-icon ${errors.country_code ? 'error' : ''}`}>
                    <IonInput
                      name="country_code"
                      value={formData.country_code}
                      onIonInput={(e) => handleInputChange(e, 'country_code')}
                      placeholder="91"
                    />
                  </div>
                </div>
                <div className="input-field-wrapper flex-1">
                  <IonLabel className="field-label">Phone Number</IonLabel>
                  <div className={`input-inner ${errors.phone ? 'error' : ''}`}>
                    <IonIcon icon={callOutline} />
                    <IonInput
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onIonInput={(e) => handleInputChange(e, 'phone')}
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              </div>
              {(errors.country_code || errors.phone) && (
                <div className="error-message">
                  {errors.country_code && `Country Code: ${errors.country_code}. `}
                  {errors.phone && `Phone: ${errors.phone}`}
                </div>
              )}
            </div>

            <div className="form-section">
              <h4 className="form-section-title">Address</h4>

              <div className="input-field-wrapper">
                <IonLabel className="field-label">Address Line 1</IonLabel>
                <div className={`input-inner ${errors.Address_line_one ? 'error' : ''}`}>
                  <IonIcon icon={locationOutline} />
                  <IonInput
                    name="Address_line_one"
                    value={formData.Address_line_one}
                    onIonInput={(e) => handleInputChange(e, 'Address_line_one')}
                    placeholder="Street/Area"
                  />
                </div>
                {errors.Address_line_one && <div className="error-message">{errors.Address_line_one}</div>}
              </div>

              <div className="input-field-wrapper">
                <IonLabel className="field-label">Address Line 2</IonLabel>
                <div className="input-inner">
                  <IonIcon icon={locationOutline} />
                  <IonInput
                    name="Address_line_two"
                    value={formData.Address_line_two}
                    onIonInput={(e) => handleInputChange(e, 'Address_line_two')}
                    placeholder="Locality"
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-field-wrapper flex-1">
                  <IonLabel className="field-label">City</IonLabel>
                  <div className={`input-inner no-icon ${errors.city ? 'error' : ''}`}>
                    <IonInput
                      name="city"
                      value={formData.city}
                      onIonInput={(e) => handleInputChange(e, 'city')}
                      placeholder="Chennai"
                    />
                  </div>
                </div>
                <div className="input-field-wrapper flex-1">
                  <IonLabel className="field-label">State</IonLabel>
                  <div className={`input-inner no-icon ${errors.state ? 'error' : ''}`}>
                    <IonInput
                      name="state"
                      value={formData.state}
                      onIonInput={(e) => handleInputChange(e, 'state')}
                      placeholder="Tamil Nadu"
                    />
                  </div>
                </div>
              </div>
              {(errors.city || errors.state) && (
                <div className="error-message">
                  {errors.city && `City: ${errors.city}. `}
                  {errors.state && `State: ${errors.state}`}
                </div>
              )}

              <div className="input-row">
                <div className="input-field-wrapper flex-1">
                  <IonLabel className="field-label">Pincode</IonLabel>
                  <div className={`input-inner no-icon ${errors.pincode ? 'error' : ''}`}>
                    <IonInput
                      name="pincode"
                      value={formData.pincode}
                      onIonInput={(e) => handleInputChange(e, 'pincode')}
                      placeholder="600001"
                    />
                  </div>
                </div>
                <div className="input-field-wrapper flex-1">
                  <IonLabel className="field-label">Country</IonLabel>
                  <div className={`input-inner no-icon ${errors.country ? 'error' : ''}`}>
                    <IonInput
                      name="country"
                      value={formData.country}
                      onIonInput={(e) => handleInputChange(e, 'country')}
                      placeholder="India"
                    />
                  </div>
                </div>
              </div>
              {(errors.pincode || errors.country) && (
                <div className="error-message">
                  {errors.pincode && `Pincode: ${errors.pincode}. `}
                  {errors.country && `Country: ${errors.country}`}
                </div>
              )}
            </div>


            <div className="action-button-wrapper">
              <IonButton expand="block" type="submit" className="submit-btn-premium">
                <IonIcon icon={saveOutline} slot="start" />
                {isEditMode ? 'Update Client' : 'Create Client'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AddEditClient;
