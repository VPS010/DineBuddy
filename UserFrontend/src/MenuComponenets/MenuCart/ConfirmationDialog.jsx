// ConfirmationDialog.js
export const ConfirmationDialog = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText,
    confirmButtonClass
  }) => (
    isOpen && (
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
        onClick={onCancel}
      >
        <div
          className="bg-white rounded-lg p-4 mx-4 max-w-sm w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold text-[#2D3436]">{title}</h3>
          <p className="mt-2 text-sm text-[#666666]">{message}</p>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onCancel}
              className="bg-[#E8E1D3] text-[#2D3436] py-1 px-4 rounded-lg text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`${confirmButtonClass} text-white py-1 px-4 rounded-lg text-sm`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    )
  );