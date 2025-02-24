import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ isLoading, children }) => {
  return (
    <div className="relative">
      {/* Main content */}
      <div className={isLoading ? 'pointer-events-none opacity-50' : ''}>
        {children}
      </div>

      {/* Overlay with spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="rounded-lg bg-white p-4 shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
