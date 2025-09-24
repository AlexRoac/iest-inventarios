import { useRef } from 'react';
import ImgInventario from './imgInventario.js';
import { buildFileUrl } from '../utils/urlHelper.js'; //  Importamos helper

function CeldaPdfAdmin(props){
  const fileInputRef = useRef(null);

  function openFile(url) {
    const fullUrl = buildFileUrl(url); //  Construimos URL correctamente
    window.open(fullUrl, '_blank');
  }

  return(
    <>
      <ImgInventario
        imgSource={props.imgSource}
        hoverText="Abrir PDF"
        onClick={() => openFile(props.PDF)}
      />
    </>
  );
}

export default CeldaPdfAdmin;