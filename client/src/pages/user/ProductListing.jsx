import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductsAPI, getCategoriesAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import Spinner from '../../components/Spinner/Spinner';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState('grid');

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    brand: '',
    sort: 'newest',
  });

  useEffect(() => { getCategoriesAPI().then(r => setCategories(r.data)); }, []);

  useEffect(() => {
    setFilters(f => ({
      ...f,
      keyword: searchParams.get('keyword') || '',
      category: searchParams.get('category') || '',
    }));
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    // If a category is selected but categories haven't loaded yet, wait.
    if (filters.category && categories.length === 0) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { ...filters, page };
        
        // Map slug to _id for backend compatibility
        if (params.category) {
          const cat = categories.find(c => c.slug === params.category || c._id === params.category);
          if (cat) {
            params.category = cat._id;
          }
        }

        Object.keys(params).forEach(k => !params[k] && delete params[k]);
        const { data } = await getProductsAPI(params);
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      } catch (err) { /* silent */ } finally { setLoading(false); }
    };
    fetchProducts();
  }, [filters, page, categories]);

  const handleFilterChange = (key, value) => {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', rating: '', brand: '', sort: 'newest' });
    setPage(1);
  };

  return (
    <div>


      <div className="container pb-5 mt-4">
        <div className="row g-4">
          {/* FILTER SIDEBAR */}
          <div className="col-lg-3">
            <div className="filter-sidebar">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 style={{ fontWeight: 700, margin: 0 }}><i className="bi bi-funnel me-2"></i>Filters</h5>
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '13px', cursor: 'pointer' }}>Clear All</button>
              </div>

              {/* Category */}
              <div className="filter-section-title">Category</div>
              <div className="d-flex flex-column gap-2 mb-2">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '14px' }}>
                  <input type="radio" name="category" checked={!filters.category} onChange={() => handleFilterChange('category', '')} /> All Categories
                </label>
                {categories.map(cat => (
                  <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <input type="radio" name="category" checked={filters.category === cat._id || filters.category === cat.slug} onChange={() => handleFilterChange('category', cat.slug)} />
                    {cat.name}
                  </label>
                ))}
              </div>

              <div className="divider"></div>

              {/* Price */}
              <div className="filter-section-title">Price Range</div>
              <div className="d-flex gap-2 mb-2">
                <input className="form-control-custom" type="number" placeholder="Min" value={filters.minPrice} onChange={e => handleFilterChange('minPrice', e.target.value)} style={{ padding: '8px 12px', fontSize: '13px' }} />
                <input className="form-control-custom" type="number" placeholder="Max" value={filters.maxPrice} onChange={e => handleFilterChange('maxPrice', e.target.value)} style={{ padding: '8px 12px', fontSize: '13px' }} />
              </div>

              <div className="divider"></div>

              {/* Rating */}
              <div className="filter-section-title">Min Rating</div>
              <div className="d-flex flex-column gap-2 mb-2">
                {[4, 3, 2, 1].map(r => (
                  <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '14px' }}>
                    <input type="radio" name="rating" checked={filters.rating === String(r)} onChange={() => handleFilterChange('rating', String(r))} />
                    {'⭐'.repeat(r)} & Above
                  </label>
                ))}
              </div>

              <div className="divider"></div>

              {/* Brand */}
              <div className="filter-section-title">Brand</div>
              <input className="form-control-custom" type="text" placeholder="Search brand..." value={filters.brand} onChange={e => handleFilterChange('brand', e.target.value)} style={{ padding: '8px 12px', fontSize: '13px' }} />
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="col-lg-9">
            {/* Sort bar */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>{total} results</p>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex gap-2">
                  <button className={`page-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><i className="bi bi-grid"></i></button>
                  <button className={`page-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}><i className="bi bi-list"></i></button>
                </div>
                <select
                  className="form-control-custom"
                  style={{ padding: '8px 12px', fontSize: '14px', width: 'auto' }}
                  value={filters.sort}
                  onChange={e => handleFilterChange('sort', e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {loading ? <Spinner /> : products.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-search"></i>
                <h3>No Products Found</h3>
                <p>Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="btn-primary-custom">Clear Filters</button>
              </div>
            ) : (
              <div className={view === 'grid' ? 'row g-4' : 'd-flex flex-column gap-3'}>
                {products.map(p => (
                  <div key={p._id} className={view === 'grid' ? 'col-6 col-md-4 d-flex' : 'd-flex w-100'}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination-custom">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><i className="bi bi-chevron-left"></i></button>
                {[...Array(pages)].map((_, i) => (
                  <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                ))}
                <button className="page-btn" disabled={page === pages} onClick={() => setPage(p => p + 1)}><i className="bi bi-chevron-right"></i></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
