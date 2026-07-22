/**
 * PageLoader — Minimal fullscreen loading fallback for React.lazy() Suspense boundaries.
 * Matches the portfolio's dark aesthetic without importing any heavy dependencies.
 */
export default function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Loading page"
      role="status"
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {/* Minimal spinner using CSS animation via inline style */}
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '2px solid #2A2A2A',
            borderTopColor: '#F5F5F5',
            borderRadius: '50%',
            animation: 'page-loader-spin 0.8s linear infinite',
          }}
        />
        <style>{`
          @keyframes page-loader-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <span style={{ color: '#6A6A6A', fontSize: '13px', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.05em' }}>
          Loading…
        </span>
      </div>
    </div>
  );
}
