import Modal from './Modal';

export default function ConfirmDialog({
  isOpen, onClose, onConfirm, title,
  message, confirmText = 'Confirm', loading,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-slate-600 text-sm leading-relaxed">{message}</p>
      <div className="flex gap-3 mt-6">
        <button onClick={onClose} className="btn-secondary flex-1">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="btn-danger flex-1 disabled:opacity-50"
        >
          {loading ? 'Processing…' : confirmText}
        </button>
      </div>
    </Modal>
  );
}
