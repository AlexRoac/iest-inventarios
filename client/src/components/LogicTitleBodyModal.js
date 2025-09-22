import Modal from 'react-bootstrap/Modal';

function LogicTitleModal(props) {
  return (
    <Modal show={props.show} onHide={props.onClose} size={props.modalSize} centered={props.centered}>
      <Modal.Header closeButton className="justify-content-center text-white" style={{ backgroundColor: "#f56a0f"}}>
        <Modal.Title className="text-center text-white fw-bold w-100">{props.modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={props.style}>
        {props.modalBody}
      </Modal.Body>
    </Modal>
  );
}

export default LogicTitleModal;
