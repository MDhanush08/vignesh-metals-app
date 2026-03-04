import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonBadge
} from '@ionic/react';
import {
  homeOutline,
  gridOutline,
  cartOutline,
  bagHandleOutline,
  personOutline
} from 'ionicons/icons';

import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Cart from '../pages/Cart';
import OrderHistory from '../pages/OrderHistory';
import Profile from '../pages/Profile';

import './MainTabs.css';

const MainTabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/app/products">
          <Products />
        </Route>
        <Route exact path="/app/cart">
          <Cart />
        </Route>
        <Route exact path="/app/orders">
          <OrderHistory />
        </Route>
        <Route exact path="/app/profile">
          <Profile />
        </Route>
        <Route exact path="/app">
          <Redirect to="/app/dashboard" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="custom-tab-bar">
        <IonTabButton tab="dashboard" href="/app/dashboard">
          <div className="tab-icon-wrapper">
            <IonIcon icon={homeOutline} />
            <IonLabel>Dashboard</IonLabel>
          </div>
        </IonTabButton>

        <IonTabButton tab="products" href="/app/products">
          <div className="tab-icon-wrapper">
            <IonIcon icon={gridOutline} />
            <IonLabel>Order</IonLabel>
          </div>
        </IonTabButton>

        <IonTabButton tab="cart" href="/app/cart">
          <div className="tab-icon-wrapper">
            <div className="icon-badge-container">
              <IonIcon icon={cartOutline} />
              <div className="badge-dot"></div>
            </div>
            <IonLabel>Cart</IonLabel>
          </div>
        </IonTabButton>

        <IonTabButton tab="orders" href="/app/orders">
          <div className="tab-icon-wrapper">
            <IonIcon icon={bagHandleOutline} />
            <IonLabel>Order History</IonLabel>
          </div>
        </IonTabButton>

        <IonTabButton tab="profile" href="/app/profile">
          <div className="tab-icon-wrapper">
            <IonIcon icon={personOutline} />
            <IonLabel>Profile</IonLabel>
          </div>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default MainTabs;
