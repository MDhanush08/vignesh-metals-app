import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonButton,
  IonSearchbar,
  useIonToast,
  IonModal,
  IonText,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import {
  notificationsOutline,
  optionsOutline,
  chevronForwardOutline,
  closeOutline,
  downloadOutline,
  gridOutline
} from 'ionicons/icons';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { PRODUCTS, CATEGORIES, Product } from '../data/products';
import './Products.css';

const Products: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [present] = useIonToast();

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddToCart = (product: Product, quantity: number, size?: string) => {
    present({
      message: `Added ${quantity} x ${product.name} to cart!`,
      duration: 1500,
      position: 'bottom',
      color: 'success',
      mode: 'ios'
    });
  };

  const handleDownloadCatalog = () => {
    present({
      message: 'Generating Catalog PDF...',
      duration: 2000,
      position: 'top',
      color: 'primary',
      mode: 'ios'
    });
  };

  const changeCategory = (category: string) => {
    setSelectedCategory(category);
    setIsFilterOpen(false);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="products-header">
          <IonTitle>Product Catalog</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleDownloadCatalog}>
              <IonIcon icon={downloadOutline} slot="icon-only" />
            </IonButton>
            <IonButton>
              <IonIcon icon={notificationsOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="products-page-content">
        <div className="catalog-subheader">
          <div className="header-flex">
            <IonText>
              <h2>{selectedCategory === 'All' ? 'Our Collection' : selectedCategory}</h2>
              <p>Showing {filteredProducts.length} results</p>
            </IonText>
            <IonButton fill="outline" className="catalog-pdf-btn" onClick={handleDownloadCatalog}>
              <IonIcon icon={downloadOutline} slot="start" />
              Download PDF
            </IonButton>
          </div>
        </div>

        {/* Search & Filter Wrapper */}
        <div className="search-filter-wrapper">
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search by product name..."
            className="premium-searchbar"
            mode="ios"
            debounce={300}
          ></IonSearchbar>
          <IonButton
            className={`premium-filter-btn ${selectedCategory !== 'All' ? 'active' : ''}`}
            onClick={() => setIsFilterOpen(true)}
            fill="clear"
          >
            <IonIcon icon={optionsOutline} slot="icon-only" />
          </IonButton>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="categories-scroll">
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="products-grid-container">
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
                onAddToCart={(p, q) => handleAddToCart(p, q)}
              />
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="no-results-container">
            <img
              src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png"
              alt="No results"
            />
            <h3>No Products Found</h3>
            <p>Try adjusting your search or filters</p>
            <IonButton fill="outline" color="primary" onClick={() => { setSearchText(''); setSelectedCategory('All'); }}>
              Clear All Filters
            </IonButton>
          </div>
        )}

        {/* Product Detail Modal */}
        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onAddToCart={handleAddToCart}
        />

        {/* Side Filter Modal */}
        <IonModal
          isOpen={isFilterOpen}
          onDidDismiss={() => setIsFilterOpen(false)}
          className="filter-modal"
          backdropDismiss={true}
        >
          <div className="sidebar-container">
            <h2 className="sidebar-title">Categories</h2>

            <div className="category-group">
              {['All', ...CATEGORIES].map(cat => (
                <div
                  key={cat}
                  className={`category-link ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => changeCategory(cat)}
                >
                  <span>{cat}</span>
                  <IonIcon icon={chevronForwardOutline} />
                </div>
              ))}
            </div>

            <IonButton
              className="sidebar-close-btn"
              expand="block"
              fill="solid"
              onClick={() => setIsFilterOpen(false)}
            >
              VIEW PRODUCTS
            </IonButton>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Products;
