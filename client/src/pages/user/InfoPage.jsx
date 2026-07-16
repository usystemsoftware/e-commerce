import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

const FaqAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion-neo">
      {items.map((item, index) => (
        <div key={index} className="faq-item mb-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <div 
            className="d-flex justify-content-between align-items-center py-3" 
            style={{ cursor: 'pointer' }}
            onClick={() => toggle(index)}
          >
            <h6 className="text-dark mb-0" style={{ fontSize: '1.05rem' }}>
              <i className={`${item.icon} me-3 text-acid`}></i>
              {item.question}
            </h6>
            <i className={`bi ${openIndex === index ? 'bi-chevron-up' : 'bi-chevron-down'} text-secondary`}></i>
          </div>
          <div className="faq-answer overflow-hidden" style={{ maxHeight: openIndex === index ? '500px' : '0', transition: 'max-height 0.3s ease', opacity: openIndex === index ? 1 : 0 }}>
            <p className="mb-0 text-secondary" style={{ paddingLeft: '2.5rem', paddingBottom: '1.5rem' }}>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const pageContent = {
  faq: {
    title: 'Help & Customer Service',
    subtitle: 'Frequently Asked Questions',
    content: (
      <FaqAccordion items={[
      {
        icon: 'bi-box-seam',
        question: 'How long will it take to receive my order?',
        answer: 'Order processing typically takes 1-2 business days. Once shipped, standard delivery within the country takes 3-5 business days, while express delivery takes 1-2 business days. International orders may take 7-14 business days depending on customs processing.'
      },
      {
        icon: 'bi-globe',
        question: 'Do you offer international shipping?',
        answer: 'Yes, we ship globally to most countries. Shipping costs and delivery times vary by destination and will be calculated at checkout.'
      },
      {
        icon: 'bi-pencil-square',
        question: 'Can I modify or cancel my order?',
        answer: 'We process orders quickly to ensure prompt delivery. If you need to modify or cancel your order, please contact our support team within 1 hour of placing it. Once an order has been processed for shipping, it cannot be modified or canceled.'
      },
      {
        icon: 'bi-truck',
        question: 'How can I track my shipment?',
        answer: 'Once your order is dispatched, you will receive a shipping confirmation email containing a tracking number and a link to track your package\'s delivery status.'
      },
      {
        icon: 'bi-credit-card',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, and select digital wallets. All transactions are securely encrypted.'
      }
    ]} />
    )
  },
  shipping: {
    title: 'Shipping & Delivery',
    subtitle: 'Delivery Rates and Policies',
    content: (
      <>
        <p className="text-secondary mb-4">At ShopZone, we are committed to delivering your products securely and on time. Please review our shipping policies below.</p>
        
        <div className="card-neo p-4 mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px' }}>
          <h5 className="text-dark mb-3">Domestic Shipping Rates</h5>
          <div className="table-responsive">
            <table className="table table-dark table-borderless mb-0">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-secondary">Shipping Speed</th>
                  <th className="text-secondary">Order Value</th>
                  <th className="text-secondary">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Standard (3-5 business days)</td>
                  <td>Over ₹999</td>
                  <td><span className="text-success fw-bold">FREE</span></td>
                </tr>
                <tr>
                  <td>Standard (3-5 business days)</td>
                  <td>Under ₹999</td>
                  <td>₹99</td>
                </tr>
                <tr>
                  <td>Express (1-2 business days)</td>
                  <td>Any</td>
                  <td>₹199</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <h5 className="text-dark mt-4">International Shipping</h5>
        <p className="text-secondary">We ship worldwide. International shipping rates are calculated dynamically at checkout based on the destination and package weight. Please note that international orders may be subject to customs duties, taxes, and import fees, which are the responsibility of the recipient.</p>
        
        <h5 className="text-dark mt-4">Order Processing</h5>
        <p className="text-secondary">All orders are processed within 1-2 business days (excluding weekends and public holidays). You will receive a notification email when your order has shipped.</p>
      </>
    )
  },
  returns: {
    title: 'Returns & Replacements',
    subtitle: 'Returns Policy',
    content: (
      <>
        <p className="text-secondary">We want you to be completely satisfied with your purchase. If for any reason you are not, we offer a comprehensive return and exchange policy.</p>
        
        <div className="alert alert-dark mt-4 mb-4 p-4" style={{ borderLeft: '4px solid var(--acid)', background: 'rgba(204, 255, 0, 0.05)', borderRadius: '0 8px 8px 0' }}>
          <h5 className="text-dark mb-2"><i className="bi bi-arrow-return-left me-2"></i> The 30-Day Guarantee</h5>
          <p className="mb-0 text-secondary">You have <strong>30 days</strong> from the date of delivery to return eligible items. To be eligible for a return, your item must be unused, unworn, unwashed, and in the same condition that you received it.</p>
        </div>

        <h5 className="text-dark mt-4">How to Initiate a Return</h5>
        <ol className="text-secondary ps-3 mt-3">
          <li className="mb-2">Go to <Link to="/orders" className="text-acid text-decoration-none">Your Orders</Link> and select the item you wish to return.</li>
          <li className="mb-2">Choose the reason for return and whether you want a refund or replacement.</li>
          <li className="mb-2">Print the provided Return Merchandise Authorization (RMA) label.</li>
          <li className="mb-2">Securely package the item with the label and drop it off at the designated carrier location.</li>
        </ol>
        
        <h5 className="text-dark mt-4">Refund Processing</h5>
        <p className="text-secondary">Refunds will be processed to the original method of payment within 5-7 business days after we receive and inspect your return. You can track the status of your return in your account dashboard.</p>
      </>
    )
  },
  contact: {
    title: 'Customer Service',
    subtitle: 'Contact Us',
    content: (
      <>
        <p className="text-secondary mb-4">We're here to help. Choose a contact method below, and our support team will assist you.</p>
        
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-chat-dots fs-3 text-acid me-3"></i>
                <h5 className="text-dark mb-0">Live Chat</h5>
              </div>
              <p className="text-secondary mb-0">Get instant help from our support team.</p>
              <div className="mt-3 text-acid"><small>Available 9AM - 6PM EST</small></div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-telephone fs-3 text-acid me-3"></i>
                <h5 className="text-dark mb-0">Request a Call</h5>
              </div>
              <p className="text-secondary mb-0">We'll call you right back.</p>
              <div className="mt-3 text-acid"><small>Wait time: ~2 mins</small></div>
            </div>
          </div>
          <div className="col-12">
            <div className="card p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-envelope fs-3 text-acid me-3"></i>
                <h5 className="text-dark mb-0">Email Support</h5>
              </div>
              <p className="text-secondary mb-1">For general inquiries and support:</p>
              <p className="text-dark fw-bold mb-0">support@shopzone.com</p>
            </div>
          </div>
        </div>
      </>
    )
  },
  terms: {
    title: 'Legal & Privacy',
    subtitle: 'Conditions of Use',
    content: (
      <>
        <p className="text-secondary"><small>Last Updated: {new Date().toLocaleDateString()}</small></p>
        <p className="text-secondary">Welcome to ShopZone. By accessing or using our website, you agree to be bound by these Conditions of Use.</p>
        
        <h5 className="text-dark mt-4">1. Electronic Communications</h5>
        <p className="text-secondary">When you use ShopZone Services, or send e-mails, text messages, and other communications from your desktop or mobile device to us, you may be communicating with us electronically. You consent to receive communications from us electronically.</p>
        
        <h5 className="text-dark mt-4">2. Copyright</h5>
        <p className="text-secondary">All content included in or made available through any ShopZone Service, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software is the property of ShopZone or its content suppliers and protected by international copyright laws.</p>
        
        <h5 className="text-dark mt-4">3. Your Account</h5>
        <p className="text-secondary">You may need your own ShopZone account to use certain Services, and you may be required to be logged in to the account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.</p>
        
        <h5 className="text-dark mt-4">4. Risk of Loss</h5>
        <p className="text-secondary">All purchases of physical items from ShopZone are made pursuant to a shipment contract. This means that the risk of loss and title for such items pass to you upon our delivery to the carrier.</p>
      </>
    )
  },
  privacy: {
    title: 'Legal & Privacy',
    subtitle: 'Privacy Notice',
    content: (
      <>
        <p className="text-secondary"><small>Last Updated: {new Date().toLocaleDateString()}</small></p>
        <p className="text-secondary">We know that you care how information about you is used and shared, and we appreciate your trust that we will do so carefully and sensibly. This Privacy Notice describes how ShopZone collects and processes your personal information.</p>
        
        <h5 className="text-dark mt-4">What Personal Information About Customers Does ShopZone Collect?</h5>
        <ul className="text-secondary ps-3">
          <li className="mb-2"><strong>Information You Give Us:</strong> We receive and store any information you provide in relation to ShopZone Services. You can choose not to provide certain information, but then you might not be able to take advantage of many of our Services.</li>
          <li className="mb-2"><strong>Automatic Information:</strong> We automatically collect and store certain types of information about your use of ShopZone Services, including information about your interaction with content and services available.</li>
        </ul>
        
        <h5 className="text-dark mt-4">For What Purposes Does ShopZone Use Your Personal Information?</h5>
        <ul className="text-secondary ps-3">
          <li className="mb-2">Purchase and delivery of products and services.</li>
          <li className="mb-2">Provide, troubleshoot, and improve ShopZone Services.</li>
          <li className="mb-2">Recommendations and personalization.</li>
          <li className="mb-2">Comply with legal obligations.</li>
          <li className="mb-2">Communicate with you.</li>
        </ul>
      </>
    )
  },
  cookies: {
    title: 'Legal & Privacy',
    subtitle: 'Cookies & Internet Advertising',
    content: (
      <>
        <p className="text-secondary"><small>Last Updated: {new Date().toLocaleDateString()}</small></p>
        <p className="text-secondary">ShopZone uses cookies and similar technologies to enhance your experience, gather information about visitors, and serve personalized ads.</p>
        
        <h5 className="text-dark mt-4">Approved Third Parties</h5>
        <p className="text-secondary">Approved third parties may also set cookies when you interact with ShopZone services. Third parties include search engines, providers of measurement and analytics services, social media networks, and advertising companies.</p>
        
        <h5 className="text-dark mt-4">Managing Cookies</h5>
        <p className="text-secondary">You can manage browser cookies through your browser settings. The 'Help' feature on most browsers will tell you how to prevent your browser from accepting new cookies, how to have the browser notify you when you receive a new cookie, how to block cookies, and when cookies will expire.</p>
      </>
    )
  }
};

const InfoPage = () => {
  const { pageId } = useParams();
  const page = pageContent[pageId] || {
    title: 'Help Center',
    subtitle: 'Page Not Found',
    content: <p className="text-secondary">The information you are looking for does not exist or has been moved.</p>
  };

  return (
    <div className="info-page-wrapper pb-5" style={{ minHeight: '80vh' }}>

      <div className="container mt-5">
        <div className="row">
          {/* Sidebar Navigation */}
          <div className="col-lg-3 mb-5 mb-lg-0">
            <div className="card p-0 sticky-top" style={{ background: 'transparent', border: 'none', top: '100px' }}>
              <h6 className="mb-3 px-3 text-uppercase text-secondary" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Help Topics</h6>
              <div className="list-group list-group-flush" style={{ background: 'transparent' }}>
                <Link to="/info/faq" className={`list-group-item list-group-item-action ${pageId === 'faq' ? 'active' : ''}`} style={{ background: 'transparent', color: pageId === 'faq' ? 'var(--acid)' : 'var(--text-secondary)', border: 'none', borderLeft: pageId === 'faq' ? '3px solid var(--acid)' : '3px solid transparent', padding: '12px 20px' }}>
                  Frequently Asked Questions
                </Link>
                <Link to="/info/shipping" className={`list-group-item list-group-item-action ${pageId === 'shipping' ? 'active' : ''}`} style={{ background: 'transparent', color: pageId === 'shipping' ? 'var(--acid)' : 'var(--text-secondary)', border: 'none', borderLeft: pageId === 'shipping' ? '3px solid var(--acid)' : '3px solid transparent', padding: '12px 20px' }}>
                  Shipping & Delivery
                </Link>
                <Link to="/info/returns" className={`list-group-item list-group-item-action ${pageId === 'returns' ? 'active' : ''}`} style={{ background: 'transparent', color: pageId === 'returns' ? 'var(--acid)' : 'var(--text-secondary)', border: 'none', borderLeft: pageId === 'returns' ? '3px solid var(--acid)' : '3px solid transparent', padding: '12px 20px' }}>
                  Returns & Replacements
                </Link>
                <Link to="/info/contact" className={`list-group-item list-group-item-action ${pageId === 'contact' ? 'active' : ''}`} style={{ background: 'transparent', color: pageId === 'contact' ? 'var(--acid)' : 'var(--text-secondary)', border: 'none', borderLeft: pageId === 'contact' ? '3px solid var(--acid)' : '3px solid transparent', padding: '12px 20px' }}>
                  Customer Service
                </Link>
                
                <h6 className="mb-3 mt-4 px-3 text-uppercase text-secondary" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>Legal & Privacy</h6>
                <Link to="/info/terms" className={`list-group-item list-group-item-action ${pageId === 'terms' ? 'active' : ''}`} style={{ background: 'transparent', color: pageId === 'terms' ? 'var(--acid)' : 'var(--text-secondary)', border: 'none', borderLeft: pageId === 'terms' ? '3px solid var(--acid)' : '3px solid transparent', padding: '12px 20px' }}>
                  Conditions of Use
                </Link>
                <Link to="/info/privacy" className={`list-group-item list-group-item-action ${pageId === 'privacy' ? 'active' : ''}`} style={{ background: 'transparent', color: pageId === 'privacy' ? 'var(--acid)' : 'var(--text-secondary)', border: 'none', borderLeft: pageId === 'privacy' ? '3px solid var(--acid)' : '3px solid transparent', padding: '12px 20px' }}>
                  Privacy Notice
                </Link>
                <Link to="/info/cookies" className={`list-group-item list-group-item-action ${pageId === 'cookies' ? 'active' : ''}`} style={{ background: 'transparent', color: pageId === 'cookies' ? 'var(--acid)' : 'var(--text-secondary)', border: 'none', borderLeft: pageId === 'cookies' ? '3px solid var(--acid)' : '3px solid transparent', padding: '12px 20px' }}>
                  Cookies & Internet Advertising
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-lg-9">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item"><Link to="/info/faq" className="text-secondary text-decoration-none">Help Center</Link></li>
                <li className="breadcrumb-item text-secondary" aria-current="page">{page.title}</li>
              </ol>
            </nav>

            <div className="card p-4 p-md-5" style={{ background: 'var(--dark-2)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <h3 className="mb-4 text-dark" style={{ fontWeight: 600 }}>
                {page.subtitle}
              </h3>
              <div style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                {page.content}
              </div>
            </div>
            
            <div className="mt-4 p-4 text-center rounded" style={{ border: '1px dashed var(--border)' }}>
              <p className="mb-3 text-secondary">Did this solve your problem?</p>
              <div>
                <button className="btn btn-outline-secondary me-2 px-4 rounded-pill">Yes</button>
                <button className="btn btn-outline-secondary px-4 rounded-pill">No</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
