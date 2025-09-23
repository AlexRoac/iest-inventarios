import { useRef, useState } from 'react';
import ImgInventario from './imgInventario.js';
import {Button, Row, Col, Dropdown, DropdownButton} from 'react-bootstrap';

const apiUrl = process.env.REACT_APP_API_URL || '';
function CeldaPdfAdmin(props){

  const fileInputRef = useRef(null); //Permite hacer trigger a un input type="file" oculto.

  const handleItemClick = (filetype) => {
    console.log("Item click ", filetype)
    if (fileInputRef.current) {
      fileInputRef.current.click(); //Manda el evento de click al input para poder abrir un file browser.
      props.setRowIndex(props.rowIndex);
      props.setColName(filetype);
    }
  };

  function openFile(url) {
    window.open(`${apiUrl}/${url}`, '_blank');
  }

  if(props.isEditing){
    return(
      <>
        <ImgInventario
          imgSource={props.imgSource}
          hoverText="Cambiar PDF"
          onClick={() => handleItemClick(props.db_pdf)}
        />
        <input
          type="file"
          accept="image/*, application/pdf"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={props.onChange}
        />
    </>
  );
  }
  else{
    return(
      <>
        <ImgInventario
          imgSource={props.imgSource}
          hoverText="Abrir PDF"
          onClick={() => openFile(props.PDF)}
        />
      </>
    )
  }
}

export default CeldaPdfAdmin;
