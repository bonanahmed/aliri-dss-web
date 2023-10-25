/* eslint-disable react/display-name */
import { StateCloseIcon } from "@/public/images/icon/icon";
import { PropBasic } from "@/types/general";

interface PropModal extends PropBasic {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  disableBackdrop?: boolean;
  withCloseButton?: boolean;
}

const Modal = (props: PropModal) => {
  const {
    children,
    className,
    isOpen = false,
    onClose,
    title = "",
    disableBackdrop = false,
    withCloseButton = false,
  } = props;
  return (
    <div className={`modal-wrapper ${isOpen ? "flex" : "hidden"}`}>
      <div className="min-w-[30vw] min-h-[20vh] modal-content">
        <div
          className={`modal-title text-black dark:text-white ${
            title ? "mb-[10px] border-b border-black dark:border-white " : ""
          } ${title || disableBackdrop || withCloseButton ? "flex" : "hidden"}`}
        >
          <div className="text-lg font-semibold flex-grow">{title}</div>
          <a className="cursor-pointer hover:text-primary" onClick={onClose}>
            <StateCloseIcon />
          </a>
        </div>
        <div className={`modal-body ${className}`}>{children}</div>
      </div>
      <div
        className={`modal-background ${disableBackdrop ? "hidden" : ""}`}
        onClick={onClose}
      ></div>
    </div>
  );
};

Modal.Footer = (props: PropBasic) => {
  const { className, children } = props;
  return <div className={`modal-footer ${className}`}>{children}</div>;
};

export default Modal;
