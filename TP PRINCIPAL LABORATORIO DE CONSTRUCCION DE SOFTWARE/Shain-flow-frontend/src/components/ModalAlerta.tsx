import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

export const ModalAlerta = ({ mensaje, onClose }: { mensaje: string, onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalInstanceRef = useRef<Modal | null>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current);
      modalInstanceRef.current.show();

      const currentModal = modalRef.current;
      currentModal.addEventListener("hidden.bs.modal", onClose);

      return () => {
        currentModal.removeEventListener("hidden.bs.modal", onClose);
        // Verificamos antes de llamar dispose
        if (modalInstanceRef.current) {
          modalInstanceRef.current.dispose();
        }
      };
    }
  }, []);

  return (
    <div className="modal fade" tabIndex={-1} ref={modalRef}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Mensaje</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            <p>{mensaje}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
