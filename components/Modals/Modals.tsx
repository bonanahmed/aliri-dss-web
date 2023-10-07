import React, { FC } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: any;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const handleOverlayClick = (event: React.MouseEvent) => {
    console.log(event.target, event.currentTarget);
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 dark:bg-boxdark">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleOverlayClick}
      />
      <div className="absolute bg-white dark:bg-boxdark p-6 rounded shadow-lg z-10 min-w-[25vw]">
        <button
          onClick={onClose}
          className="absolute right-1 -top-1 text-strokedark"
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
