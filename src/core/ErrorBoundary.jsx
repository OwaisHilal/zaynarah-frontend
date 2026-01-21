import { ErrorBoundary } from 'react-error-boundary';
import { useCallback, useState } from 'react';

function Fallback({ resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full rounded-xl bg-white shadow-sm border border-gray-200 p-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          An unexpected error occurred. You can safely retry.
        </p>
        <button
          onClick={resetErrorBoundary}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-900 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function GlobalErrorBoundary({ children }) {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
  }, []);

  const handleError = useCallback((error, info) => {
    console.error('GlobalErrorBoundary', error, info);
  }, []);

  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <Fallback
          resetErrorBoundary={() => {
            handleReset();
            resetErrorBoundary();
          }}
        />
      )}
      onError={handleError}
      resetKeys={[resetKey]}
    >
      <div key={resetKey}>{children}</div>
    </ErrorBoundary>
  );
}
