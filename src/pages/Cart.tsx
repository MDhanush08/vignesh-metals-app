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
  IonThumbnail,
  IonText,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge
} from '@ionic/react';
import {
  notificationsOutline,
  trashOutline,
  addOutline,
  removeOutline,
  chevronForwardOutline,
  cartOutline
} from 'ionicons/icons';
import React, { useState } from 'react';
import { PRODUCTS } from '../data/products';
import './Cart.css';

const Cart: React.FC = () => {
  const [items, setItems] = useState([
    {
      id: PRODUCTS[0].id,
      name: PRODUCTS[0].name,
      category: PRODUCTS[0].category,
      price: PRODUCTS[0].price,
      quantity: 5,
      image: PRODUCTS[0].image
    },
    {
      id: PRODUCTS[4].id,
      name: PRODUCTS[4].name,
      category: PRODUCTS[4].category,
      price: PRODUCTS[4].price,
      quantity: 3,
      image: PRODUCTS[4].image
    },
  ]);

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="cart-header">
          <IonTitle>Shopping Cart</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={notificationsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="cart-content">
        <div className="cart-summary-top">
          <IonText>
            <h2>My Order</h2>
            <p>You have {items.length} items in your cart</p>
          </IonText>
        </div>

        {items.length > 0 ? (
          <IonList className="cart-list" lines="none">
            {items.map(item => (
              <IonItem key={item.id} className="cart-item-card">
                <IonThumbnail slot="start" className="cart-thumb">
                  <img src={item.image} alt={item.name} />
                </IonThumbnail>
                <IonLabel className="cart-item-label">
                  <div className="item-title-row">
                    <h3>{item.name}</h3>
                    <IonButton fill="clear" color="danger" className="remove-btn" onClick={() => removeItem(item.id)}>
                      <IonIcon icon={trashOutline} slot="icon-only" />
                    </IonButton>
                  </div>
                  <p className="item-cat">{item.category}</p>
                  <div className="item-bottom-row">
                    <div className="price-stack">
                      <span className="unit-price">₹{item.price.toLocaleString()} / unit</span>
                      <span className="item-subtotal">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    <div className="quantity-control">
                      <IonButton fill="clear" size="small" onClick={() => updateQuantity(item.id, -1)}>
                        <IonIcon icon={removeOutline} />
                      </IonButton>
                      <span className="item-qty">{item.quantity}</span>
                      <IonButton fill="clear" size="small" onClick={() => updateQuantity(item.id, 1)}>
                        <IonIcon icon={addOutline} />
                      </IonButton>
                    </div>
                  </div>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <div className="empty-cart">
            <IonIcon icon={cartOutline} className="empty-cart-icon" />
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <IonButton expand="block" fill="outline" routerLink="/app/products">
              Start Shopping
            </IonButton>
          </div>
        )}

        <div className="order-options">
          <h3>Order Type</h3>
          <div className="type-toggle">
            <IonBadge className="type-badge general active">General</IonBadge>
            <IonBadge className="type-badge emergency">Emergency</IonBadge>
          </div>
        </div>
      </IonContent>

      {items.length > 0 && (
        <IonFooter className="ion-no-border cart-footer">
          <div className="total-container">
            <div className="total-row">
              <span className="label">Subtotal</span>
              <span className="value">₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="total-row main">
              <span className="label">Total Amount</span>
              <span className="value">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
          <IonButton expand="block" className="place-order-btn">
            Place Order
            <IonIcon icon={chevronForwardOutline} slot="end" />
          </IonButton>
        </IonFooter>
      )}
    </IonPage>
  );
};

export default Cart;
