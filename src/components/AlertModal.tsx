"use client";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: "error" | "success" | "info";
}

export default function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  variant = "info",
}: AlertModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300",
    success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300",
    info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
        <div className={`p-6 border-l-4 ${variantStyles[variant]}`}>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm mb-6">{message}</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

