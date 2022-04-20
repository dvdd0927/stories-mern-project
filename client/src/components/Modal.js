import { useEffect } from "react";

const Modal = ({ type, message, setShowModal }) => {
  useEffect(() => {
    const timer = setInterval(() => {
      setShowModal({ show: false });
    }, 2000);
    return () => clearInterval(timer);
  }, []);
  return <div className={`alert alert-${type}`}>{message}</div>;
};

export default Modal;
