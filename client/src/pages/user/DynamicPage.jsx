import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPageBySlugAPI } from '../../services/api';
import Spinner from '../../components/Spinner/Spinner';

const DynamicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const { data } = await getPageBySlugAPI(slug);
        setPage(data);
        document.title = `${data.title} | ShopZone`;
      } catch (error) {
        navigate('/404', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug, navigate]);

  if (loading) return <div className="d-flex justify-content-center p-5"><Spinner /></div>;
  if (!page) return null;

  return (
    <div className="container py-5">
      <h1 className="mb-4" style={{ fontWeight: 800 }}>{page.title}</h1>
      <div 
        className="page-content" 
        style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--text-primary)' }}
        dangerouslySetInnerHTML={{ __html: page.content }} 
      />
    </div>
  );
};

export default DynamicPage;
