const Loader = ({ message = 'Please wait...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-4 w-100">
      <div className="w-100" style={{ maxWidth: '300px' }}>
        <div className="progress" style={{ height: '8px' }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-primary"
            role="progressbar"
            style={{ width: '100%' }}
          ></div>
        </div>
      </div>
      <div className="mt-3 text-muted small">{message}</div>
    </div>
  );
};

export default Loader;
