import { useRef, useState } from 'react';
import LogicTitleModal from './LogicTitleBodyModal.js';
import ImgInventario from './imgInventario.js';

function CeldaImgArticulo(props) {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  return (
    <>
      <ImgInventario
        imgSource={props.imgSource}
        hoverText="Ampliar Imagen"
        onClick={openModal}
      />
      <LogicTitleModal 
        show={showModal}
        onClose={closeModal}
        modalSize="xl"
        modalTitle={props.nombreArticulo}
        modalBody={
          <div className="d-flex justify-content-center">
            <img 
              src={props.imgSource} 
              style={{ maxWidth: "50vh" }} 
              alt="Imagen del artículo"  // Agregamos el alt aquí para accesibilidad
            />
          </div>
        }
      />
    </>
  );
}

export default CeldaImgArticulo;
