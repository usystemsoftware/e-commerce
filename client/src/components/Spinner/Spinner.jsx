const Spinner = ({ text = 'Loading...' }) => (
  <div className="spinner-wrapper">
    <div style={{ textAlign: 'center' }}>
      <div className="spinner-custom mx-auto"></div>
      <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '14px' }}>{text}</p>
    </div>
  </div>
);

export default Spinner;
