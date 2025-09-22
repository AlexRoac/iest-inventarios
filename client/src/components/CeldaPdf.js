import { useRef, useState } from 'react';
import LogicTitleModal from './LogicTitleBodyModal.js';
import ImgInventario from './imgInventario.js';
import {Button, Row, Col, Dropdown, DropdownButton} from 'react-bootstrap';

function CeldaPdfAdmin(props){

  const fileInputRef = useRef(null); //Permite hacer trigger a un input type="file" oculto.

  function openFile(url) {
    window.open(`http://localhost:3001/${url}`, '_blank');
  }

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

export default CeldaPdfAdmin;
