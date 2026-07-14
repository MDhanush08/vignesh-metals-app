import { Redirect, Route, useHistory } from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonBadge,
  useIonRouter
} from '@ionic/react';
import {
  peopleOutline,
  gridOutline,
  cartOutline,
  bagHandleOutline,
  personOutline
} from 'ionicons/icons';

import Products from '../pages/Products';
import Cart from '../pages/Cart';
import OrderHistory from '../pages/OrderHistory';
import OrderDetails from '../pages/OrderDetails';
import Profile from '../pages/Profile';
import Clients from '../pages/Clients';
import ClientDetails from '../pages/ClientDetails';
import AddEditClient from '../pages/AddEditClient';
import { useCart } from '../context/CartContext';

import './MainTabs.css';

const MainTabs: React.FC = () => {
  const router = useIonRouter();
  const { totalItems } = useCart();
  return (
    <IonTabs onIonTabsWillChange={(e) => {
      const tab = e.detail.tab;
      const pathMap: Record<string, string> = {
        'products': '/app/products',
        'clients': '/app/clients',
        'cart': '/app/cart',
        'orders': '/app/orders',
        'profile': '/app/profile'
      };

      const targetPath = pathMap[tab];
      if (targetPath) {
        // Force navigate to the root of the tab branch
        router.push(targetPath, 'root', 'replace');
      }
    }}>
      <IonRouterOutlet>
        <Route exact path="/app/products">
          <Products />
        </Route>
        <Route exact path="/app/cart">
          <Cart />
        </Route>
        <Route exact path="/app/orders/:id">
          <OrderDetails />
        </Route>
        <Route exact path="/app/orders">
          <OrderHistory />
        </Route>
        <Route exact path="/app/clients-add">
          <AddEditClient />
        </Route>
        <Route exact path="/app/clients-edit/:id">
          <AddEditClient />
        </Route>
        <Route exact path="/app/clients/:id">
          <ClientDetails />
        </Route>
        <Route exact path="/app/clients">
          <Clients />
        </Route>
        <Route exact path="/app/profile">
          <Profile />
        </Route>
        <Route exact path="/app">
          <Redirect to="/app/products" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom" className="custom-tab-bar">
        <IonTabButton tab="products" href="/app/products">
          <div className="tab-icon-wrapper">
            <IonIcon icon={gridOutline} />
            <IonLabel>Products</IonLabel>
          </div>
        </IonTabButton>

        <IonTabButton tab="clients" href="/app/clients">
          <div className="tab-icon-wrapper">
            <IonIcon icon={peopleOutline} />
            <IonLabel>Clients</IonLabel>
          </div>
        </IonTabButton>

        <IonTabButton tab="cart" href="/app/cart">
          <div className="tab-icon-wrapper">
            <div className="icon-badge-container">
              <IonIcon icon={cartOutline} />
              {totalItems > 0 && <IonBadge className="cart-badge">{totalItems}</IonBadge>}
            </div>
            <IonLabel>Cart</IonLabel>
          </div>
        </IonTabButton>

        <IonTabButton tab="orders" href="/app/orders">
          <div className="tab-icon-wrapper">
            <IonIcon icon={bagHandleOutline} />
            <IonLabel>Order Review</IonLabel>
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
