import React, { useState, useRef, useEffect } from 'react';
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
  IonCheckbox,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner
} from '@ionic/react';
import {
  notificationsOutline,
  optionsOutline,
  closeOutline,
  downloadOutline,
  checkmarkCircle
} from 'ionicons/icons';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Product } from '../data/products';
import { getProducts, getCategories, ApiProduct } from '../services/productService';
import './Products.css';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const [present] = useIonToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch categories first
      let categoryMap: Record<string, string> = {};
      try {
        const catResponse = await getCategories();
        console.log("response .... Categories", catResponse);
        
        const apiCats = catResponse.response.data;
        apiCats.forEach(cat => {
          categoryMap[cat._id] = cat.name;
        });
        setCategories(['All', ...apiCats.map(c => c.name)]);
      } catch (catError) {
        console.error('Error fetching categories:', catError);
        setCategories(['All', 'Metal Works']);
      }

      // Fetch products
      const response = await getProducts(1, 100);
      console.log("response .... Produsts", response);
      
      const apiProducts = response.response.data;

      const mappedProducts: Product[] = apiProducts.map((p: ApiProduct) => ({
        id: p._id,
        name: p.name,
        basePrice: p.size[0]?.price || 0,
        image: p.thumbnail,
        category: categoryMap[p.category] || 'Metal Works',
        packSize: p.item_code,
        description: p.description,
        sizeOptions: p.size.map(s => ({
          label: s.name,
          price: s.price || 0
        }))
      }));

      setProducts(mappedProducts);

    } catch (error) {
      console.error('Error fetching data:', error);
      present({
        message: 'Failed to load products. Please try again.',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategories.includes('All') || selectedCategories.includes(p.category);
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
    } else {
      let newCategories = selectedCategories.filter(c => c !== 'All');
      if (newCategories.includes(category)) {
        newCategories = newCategories.filter(c => c !== category);
        if (newCategories.length === 0) newCategories = ['All'];
      } else {
        newCategories.push(category);
      }
      setSelectedCategories(newCategories);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddToCart = (product: Product, quantity: number, size?: string, price?: number) => {
    const finalPrice = price || product.basePrice;
    const sizeInfo = size ? ` [${size}]` : '';

    present({
      message: `Added ${quantity} x ${product.name}${sizeInfo} - ₹${(finalPrice * quantity).toFixed(2)}`,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      mode: 'ios'
    });
  };

  const handleDownloadCatalog = () => {
    const link = document.createElement('a');
    link.href = '/assets/SRI VIGNESH METAL CATALOGE.pptx';
    link.download = 'SRI VIGNESH METAL CATALOGE.pptx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    present({
      message: 'Downloading Catalog...',
      duration: 2000,
      position: 'top',
      color: 'success',
      mode: 'ios'
    });
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="products-header">
          <IonTitle>Our Products</IonTitle>
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
              <h2>Our Products</h2>
              <p>
                {loading ? 'Loading...' : (
                  selectedCategories.includes('All')
                    ? 'Showing all items'
                    : `Filtering ${selectedCategories.length} categories`
                )}
              </p>
            </IonText>
            <IonButton fill="outline" className="catalog-pdf-btn" onClick={handleDownloadCatalog}>
              <IonIcon icon={downloadOutline} slot="start" />
              Catalog
            </IonButton>
          </div>
        </div>

        <div className="search-filter-wrapper">
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search products..."
            className="premium-searchbar"
            mode="ios"
            debounce={300}
          ></IonSearchbar>
          <IonButton
            className={`premium-filter-btn ${!selectedCategories.includes('All') ? 'active' : ''}`}
            onClick={() => setIsFilterOpen(true)}
            fill="clear"
          >
            <IonIcon icon={optionsOutline} slot="icon-only" />
          </IonButton>
        </div>

        <div className="categories-scroll">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-pill-btn ${selectedCategories.includes(cat) ? 'active' : ''}`}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="products-grid-container">
          {loading ? (
            <div className="ion-text-center ion-padding">
              <IonSpinner name="crescent" color="primary" />
              <p>Loading products...</p>
            </div>
          ) : (
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
          )}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="no-results-container">
            <IonIcon icon={closeOutline} style={{ fontSize: '64px', color: '#ccc' }} />
            <h3>No Products Found</h3>
            <p>Try adjusting your search or filters</p>
            <IonButton fill="outline" color="primary" onClick={() => { setSearchText(''); setSelectedCategories(['All']); }}>
              Clear All Filters
            </IonButton>
          </div>
        )}

        <ProductModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onAddToCart={handleAddToCart}
        />

        <IonModal
          ref={modal}
          isOpen={isFilterOpen}
          onDidDismiss={() => setIsFilterOpen(false)}
          initialBreakpoint={0.65}
          breakpoints={[0, 0.65, 0.9]}
          className="filter-bottom-sheet"
        >
          <div className="sheet-container">
            <div className="sheet-header">
              <div className="handle"></div>
              <div className="title-row">
                <h2>Filter Categories</h2>
                <IonButton fill="clear" onClick={() => setIsFilterOpen(false)}>
                  <IonIcon icon={checkmarkCircle} slot="start" />
                  Done
                </IonButton>
              </div>
            </div>

            <IonContent className="ion-padding-horizontal">
              <IonList className="category-select-list" lines="none">
                {categories.map(cat => (
                  <IonItem
                    key={cat}
                    className={`filter-item ${selectedCategories.includes(cat) ? 'selected' : ''}`}
                    onClick={(e) => { e.preventDefault(); toggleCategory(cat); }}
                  >
                    <IonLabel className="filter-label-text">{cat}</IonLabel>
                    <IonCheckbox
                      slot="end"
                      checked={selectedCategories.includes(cat)}
                      style={{ pointerEvents: 'none' }}
                    />
                  </IonItem>
                ))}
              </IonList>
            </IonContent>

            <div className="sheet-footer">
              <IonButton expand="block" className="apply-btn" onClick={() => setIsFilterOpen(false)}>
                Apply Filters ({filteredProducts.length} Products)
              </IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Products;
