import Modal from './Modal';

export default function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-sm mb-6" style={{ color: '#8b90a7', lineHeight: '1.6' }}>
        {message}
      </p>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: 'transparent',
            color: '#8b90a7',
            border: '1px solid #2e3349',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#272b3d';
            e.currentTarget.style.color = '#e8eaf0';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#8b90a7';
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: '#ff5263', color: '#fff', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ff6573')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ff5263')}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
