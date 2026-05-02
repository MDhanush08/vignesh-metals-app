import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  image: string;
  size?: string;
  sizeId?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, sizeId?: string) => void;
  updateQuantity: (id: string, delta: number, sizeId?: string) => void;
  clearCart: () => void;
  totalItems: number;
  // Editing state
  editingOrderId: string | null;
  selectedClientId: string | null;
  orderType: number | null;
  initializeEdit: (orderId: string, items: CartItem[], clientId: string, type: number) => void;
  setOrderType: (type: number) => void;
  setSelectedClientId: (clientId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [orderType, setOrderType] = useState<number | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('vignesh_metals_cart');
    const savedEditState = localStorage.getItem('vignesh_metals_edit_state');

    if (savedCart) {
      try { setItems(JSON.parse(savedCart)); } catch (e) { console.error(e); }
    }

    if (savedEditState) {
      try {
        const state = JSON.parse(savedEditState);
        setEditingOrderId(state.orderId);
        setSelectedClientId(state.clientId);
        setOrderType(state.orderType);
      } catch (e) { console.error(e); }
    }
  }, []);

  // Save cart and edit state to localStorage
  useEffect(() => {
    localStorage.setItem('vignesh_metals_cart', JSON.stringify(items));
    localStorage.setItem('vignesh_metals_edit_state', JSON.stringify({
      orderId: editingOrderId,
      clientId: selectedClientId,
      orderType: orderType
    }));
  }, [items, editingOrderId, selectedClientId, orderType]);

  const addItem = (newItem: CartItem) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id && item.sizeId === newItem.sizeId);
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      }
      return [...prevItems, newItem];
    });
  };

  const removeItem = (id: string, sizeId?: string) => {
    setItems(prevItems => prevItems.filter(item => !(item.id === id && item.sizeId === sizeId)));
  };

  const updateQuantity = (id: string, delta: number, sizeId?: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.sizeId === sizeId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setEditingOrderId(null);
    setSelectedClientId(null);
    setOrderType(null);
  };

  const initializeEdit = (orderId: string, orderItems: CartItem[], clientId: string, type: number) => {
    setItems(orderItems);
    setEditingOrderId(orderId);
    setSelectedClientId(clientId);
    setOrderType(type);
  };

  const totalItems = items.length;

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart, totalItems,
      editingOrderId, selectedClientId, orderType, initializeEdit,
      setOrderType, setSelectedClientId
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
