import {
  IonContent,
  IonPage,
  useIonToast,
  useIonLoading,
  IonButton,
  IonIcon
} from '@ionic/react';
import {
  saveOutline,
  personOutline,
  mailOutline,
  callOutline,
  locationOutline
} from 'ionicons/icons';
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { createClient, updateClient, getClientById, ApiClient } from '../services/clientService';
import { authService } from '../services/authService';
import AppHeader from '../components/common/AppHeader';
import CustomInput from '../components/common/CustomInput';
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
    is_active: true,
    sales_person_id: user?._id || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode && id) {
      fetchClientForEdit();
    }
  }, [id]);

  const fetchClientForEdit = async () => {
    try {
      const response = await getClientById(id!);
      setFormData({
        ...response.response,
        sales_person_id: response.response.sales_person_id || user?._id || ''
      });
    } catch (error) {
      presentToast({ message: 'Failed to load client data.', duration: 2000, color: 'danger' });
    }
  };

  const handleInputChange = (e: any, name: string) => {
    let value = e.detail?.value !== undefined ? e.detail.value : e.target.value;

    if (name === 'country_code' || name === 'phone' || name === 'pincode') {
      value = String(value).replace(/\D/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: value }));
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

    if (!formData.phone?.trim()) newErrors.phone = 'Required';
    else if (!/^\d{10,12}$/.test(formData.phone)) newErrors.phone = 'Must be 10-12 digits';

    if (!formData.Address_line_one?.trim()) newErrors.Address_line_one = 'Required';
    if (!formData.Address_line_two?.trim()) newErrors.Address_line_two = 'Required';
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
    if (!validate()) {
      presentToast({ message: 'Please fix the errors before submitting.', duration: 3000, color: 'warning', position: 'top' });
      return;
    }

    await presentLoading({ message: isEditMode ? 'Updating client...' : 'Creating client...' });

    try {
      const payload = {
        ...formData,
        country_code: String(formData.country_code || '91'),
        country: formData.country || 'India',
        sales_person_id: formData.sales_person_id || user?._id || ''
      };

      if (isEditMode && id) {
        await updateClient(id, payload);
        presentToast({ message: 'Client updated successfully!', color: 'success', duration: 2000 });
      } else {
        await createClient(payload);
        presentToast({ message: 'Client created successfully!', color: 'success', duration: 2000 });
      }

      history.goBack();
    } catch (error) {
      presentToast({ message: 'Error saving client. Please try again.', color: 'danger', duration: 3000 });
    } finally {
      dismissLoading();
    }
  };

  return (
    <IonPage>
      <AppHeader
        title={isEditMode ? 'Update Client' : 'Add New Client'}
        showBackButton={true}
      />

      <IonContent className="page-content-premium">
        <div className="form-container-premium">
          <form onSubmit={handleSubmit}>
            <div className="form-section-premium">
              <h4 className="form-section-title-premium">General Information</h4>

              <CustomInput
                label="Full Name"
                name="name"
                icon={personOutline}
                value={formData.name}
                onInput={handleInputChange}
                error={errors.name}
                placeholder="Enter full name"
              />

              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                icon={mailOutline}
                value={formData.email}
                onInput={handleInputChange}
                error={errors.email}
                placeholder="example@gmail.com"
              />

              <div className="input-row">
                <CustomInput
                  label="Code"
                  name="country_code"
                  value={formData.country_code}
                  onInput={handleInputChange}
                  error={errors.country_code}
                  placeholder="91"
                  className="small"
                />
                <CustomInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  icon={callOutline}
                  value={formData.phone}
                  onInput={handleInputChange}
                  error={errors.phone}
                  placeholder="9876543210"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="form-section-premium">
              <h4 className="form-section-title-premium">Address Details</h4>

              <CustomInput
                label="Address Line 1"
                name="Address_line_one"
                icon={locationOutline}
                value={formData.Address_line_one}
                onInput={handleInputChange}
                error={errors.Address_line_one}
                placeholder="Street/Area"
              />

              <CustomInput
                label="Address Line 2"
                name="Address_line_two"
                icon={locationOutline}
                value={formData.Address_line_two}
                onInput={handleInputChange}
                error={errors.Address_line_two}
                placeholder="Locality"
              />

              <div className="input-row">
                <CustomInput
                  label="City"
                  name="city"
                  value={formData.city}
                  onInput={handleInputChange}
                  error={errors.city}
                  placeholder="Chennai"
                  className="flex-1"
                />
                <CustomInput
                  label="State"
                  name="state"
                  value={formData.state}
                  onInput={handleInputChange}
                  error={errors.state}
                  placeholder="Tamil Nadu"
                  className="flex-1"
                />
              </div>

              <div className="input-row">
                <CustomInput
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onInput={handleInputChange}
                  error={errors.pincode}
                  placeholder="600001"
                  className="flex-1"
                />
                <CustomInput
                  label="Country"
                  name="country"
                  value={formData.country}
                  onInput={handleInputChange}
                  error={errors.country}
                  placeholder="India"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="action-button-wrapper">
              <IonButton expand="block" type="submit" className="btn-premium">
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
