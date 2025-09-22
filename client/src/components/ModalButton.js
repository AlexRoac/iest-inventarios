import {useState} from 'react';
import LogicTitleModal from './LogicTitleBodyModal.js';
import {Button} from 'react-bootstrap';

function ModalButton(props){
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  return(
  <>
    <Button
        className={props.className}
        onClick={openModal}
        style={{ backgroundColor:'#f56a0f', borderColor:'white' }}
    >
        {props.btnText}
    </Button>
    <LogicTitleModal 
      show={showModal}
      onClose={closeModal}
      modalSize="lg"
      modalTitle={props.modalTitle}
      modalBody={props.modalBody}
      centered={props.centered}
    />
  </>
  );
}

export default ModalButton;
