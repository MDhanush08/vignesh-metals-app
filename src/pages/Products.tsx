import React, { useState, useRef, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonButtons,
  IonIcon,
  IonButton,
  IonSearchbar,
  useIonToast,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonCheckbox,
  useIonViewWillEnter,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/react';
import {
  notificationsOutline,
  optionsOutline,
  downloadOutline,
  checkmarkCircle,
  searchOutline
} from 'ionicons/icons';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { Product } from '../data/products';
import { getProducts, getCategories, ApiProduct } from '../services/productService';
import { useCart } from '../context/CartContext';
import AppHeader from '../components/common/AppHeader';
import EmptyState from '../components/common/EmptyState';
import './Products.css';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [initialModalQuantity, setInitialModalQuantity] = useState(1);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);
  const categoryMapRef = useRef<Record<string, string>>({});
  const [present] = useIonToast();
  const { addItem } = useCart();

  useIonViewWillEnter(() => {
    setSearchText('');
    setSelectedCategories(['All']);
  });

  useEffect(() => {
    loadData(1, true);
  }, []);

  const loadData = async (pageNumber: number = 1, isReset: boolean = false) => {
    if (isReset) {
      setLoading(true);
      setPage(1);
      setHasMore(true);
    }
    try {
      let currentMap = { ...categoryMapRef.current };
      if (Object.keys(currentMap).length === 0) {
        try {
          const catResponse = await getCategories();
          const apiCats = catResponse.response.data;
          apiCats.forEach((cat: any) => {
            currentMap[cat._id] = cat.name;
          });
          categoryMapRef.current = currentMap;
          setCategories(['All', ...apiCats.map((c: any) => c.name)]);
        } catch (catError) {
          setCategories(['All', 'Metal Works']);
        }
      }

      const limit = 20;
      const response = await getProducts(pageNumber, limit);
      const apiProducts = response.response.data;

      const mappedProducts: Product[] = apiProducts.map((p: ApiProduct) => ({
        id: p._id,
        name: p.name,
        basePrice: p.size[0]?.price || 0,
        image: p.thumbnail,
        category: currentMap[p.category] || 'Metal Works',
        packSize: p.item_code,
        description: p.description,
        sizeOptions: p.size.map(s => ({
          id: s._id,
          label: s.name,
          price: s.price || 0,
          HT: s.HT,
          BT: s.BT,
          WT: s.WT
        }))
      }));

      if (isReset) {
        setProducts(mappedProducts);
      } else {
        setProducts(prev => {
          const filteredNew = mappedProducts.filter(np => !prev.some(pp => pp.id === np.id));
          return [...prev, ...filteredNew];
        });
      }

      if (apiProducts.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      present({ message: 'Failed to load products.', duration: 3000, color: 'danger' });
    } finally {
      if (isReset) setLoading(false);
    }
  };

  const loadMoreProducts = async (e: any) => {
    if (!hasMore) {
      e.target.complete();
      return;
    }
    const nextPage = page + 1;
    setPage(nextPage);
    await loadData(nextPage, false);
    e.target.complete();
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

  const handleProductClick = (product: Product, quantity: number) => {
    setSelectedProduct(product);
    setInitialModalQuantity(quantity);
    setIsProductModalOpen(true);
  };

  const handleAddToCart = (product: Product, quantity: number, size?: string, price?: number, sizeId?: string) => {
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      image: product.image,
      quantity: quantity,
      size: size,
      sizeId: sizeId
    });

    present({
      message: `Added ${quantity} x ${product.name}${size ? ` [${size}]` : ''}`,
      duration: 2000,
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
    present({ message: 'Downloading Catalog...', duration: 2000, color: 'success' });
  };

  const RightButtons = (
    <>
      <IonButton onClick={handleDownloadCatalog}>
        <IonIcon icon={downloadOutline} slot="icon-only" />
      </IonButton>
    </>
  );

  return (
    <IonPage>
      <AppHeader title="Our Products" rightButtons={RightButtons} />

      <IonContent className="page-content-premium">
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
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        <IonInfiniteScroll
          onIonInfinite={loadMoreProducts}
          disabled={!hasMore}
        >
          <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading more products..."></IonInfiniteScrollContent>
        </IonInfiniteScroll>

        {!loading && filteredProducts.length === 0 && (
          <EmptyState
            icon={searchOutline}
            title="No results found"
            description="We couldn't find anything matching your search. Try different keywords or clear the filters."
            actionText="Clear Search & Filters"
            onAction={() => { setSearchText(''); setSelectedCategories(['All']); }}
          />
        )}

        <ProductModal
          product={selectedProduct}
          initialQuantity={initialModalQuantity}
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
                <div className="header-actions">
                  <IonButton fill="clear" color="medium" onClick={() => setSelectedCategories(['All'])}>
                    Clear All
                  </IonButton>
                  <IonButton fill="clear" onClick={() => setIsFilterOpen(false)}>
                    <IonIcon icon={checkmarkCircle} slot="start" />
                    Done
                  </IonButton>
                </div>
              </div>
            </div>

            <IonContent className="ion-padding-horizontal">
              <div className="category-select-list">
                {categories.map(cat => (
                  <div
                    key={cat}
                    className={`filter-item ${selectedCategories.includes(cat) ? 'selected' : ''}`}
                    onClick={(e) => { e.preventDefault(); toggleCategory(cat); }}
                  >
                    <span className="filter-label-text">{cat}</span>
                    <IonCheckbox
                      checked={selectedCategories.includes(cat)}
                      style={{ pointerEvents: 'none' }}
                    />
                  </div>
                ))}
              </div>
            </IonContent>

            <div className="sheet-footer">
              <IonButton expand="block" className="apply-btn" onClick={() => setIsFilterOpen(false)}>
                Apply Selection
              </IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Products;
