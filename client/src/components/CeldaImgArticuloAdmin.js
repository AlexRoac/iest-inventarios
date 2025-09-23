import { useRef, useState } from 'react';
import LogicTitleModal from './LogicTitleBodyModal.js';
import ImgInventario from './imgInventario.js';

const apiUrl = process.env.REACT_APP_API_URL || '';
function CeldaImgArticuloAdmin(props) {
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState("");  // Aquí se define el estado de la vista previa

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  const fileInputRef = useRef(null); // Permite hacer trigger a un input type="file" oculto.

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Manda el evento de click al input para poder abrir un file browser.
      props.setRowIndex(props.rowIndex);
      props.setColName(props.colName);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('archivo', file);
  
      try {
        const response = await fetch(`${apiUrl}/upload`, {
          method: 'POST',
          body: formData
        });
  
        if (!response.ok) {
          throw new Error('Error al subir la imagen');
        }
  
        const data = await response.json();
  
        // Usa la URL completa del backend para mostrar la imagen
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
        props.setImgSource(`${BACKEND_URL}/uploads/${file.name}`);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
  };

  if (props.isEditing) {
    return (
      <>
        <ImgInventario 
          imgSource={props.imgSource}
          hoverText="Cambiar Imagen"
          onClick={handleImageClick}
        />
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </>
    );
  } else {
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
}

export default CeldaImgArticuloAdmin;
