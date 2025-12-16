// src/features/ui/toast/components/ToastViewport.jsx
export default function ToastViewport({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className="
          px-6 py-3 rounded-full
          bg-bg-primary text-foreground
          shadow-xl border
          animate-in fade-in slide-in-from-bottom-4
        "
      >
        {message}
      </div>
    </div>
  );
}
