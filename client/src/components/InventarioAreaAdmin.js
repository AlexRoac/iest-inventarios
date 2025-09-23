import {Button, Row, Col, Form, Image, InputGroup} from 'react-bootstrap';
import {FaSave, FaEdit, FaPlus, FaSearch} from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';
import { BsEraserFill } from 'react-icons/bs';
import DefaultNavbar from './navbar';
import TablaInventarioAdmin from './TablaInventarioAdmin';
import RenglonArticuloAdmin from './RenglonArticuloAdmin';
import ImgInventario from '../components/imgInventario';
import CeldaImgArticuloAdmin from '../components/CeldaImgArticuloAdmin';
import CeldaPdfAdmin from '../components/CeldaPdfAdmin';
import EditableCell from '../components/EditableTextCell';
import FormAgregarArticulo from '../components/FormAgregarArticulo';
import ModalButton from '../components/ModalButton';
import PDFIcon from '../assets/pdf.png';
import Fuse from 'fuse.js' //fuse es la libreria utilizada para hacer fuzzy search en las busquedas

import { generatePDFThumbnail } from '../utils/pdfThumbnailGenerator';

import { useState, useEffect, useRef } from 'react';

function InventarioAreaAdmin(props){

  const [imgSource, setImgSource] = useState("/file/path/string");

  const [fileSource, setFileSource] = useState("/file/path/string");

  const [selectedRowsDelete, setSelectedRowsDelete] = useState([]);

  const [articulos, setArticulos] = useState([]);

  const [rowIndex, setRowIndex] = useState();

  const [colName, setColName] = useState("");

  const isFirstRender = useRef(true);

  const [btnBGColor, setBtnBGColor] = useState("grey");

  const [value, setValue] = useState("");

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPath, setThumbnailPath] = useState("");

  const [isAdding, setIsAdding] = useState(false);
   const [newItem, setNewItem] = useState({
     nombre: '',
     cant: '',
     ruta_img: '',
     ruta_pdf_instructivo: '',
     ruta_img_instructivo: '',
     ruta_pdf_seguridad: '',
     ruta_img_seguridad: ''
   }); const [newText, setNewText] = useState("");

  const fuse = new Fuse(articulos, { 
    keys: ['nombre'],
    treshold: 0.2,
    ignoreDiacritics: true,
  });

  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState(articulos);

  async function fetchArticulos(area) {
    console.log("Fetching articulos for area:", area);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/cargarInventario?area=${area}`);
      const data = await response.json();
      console.log("Fetched data:", data);
      setArticulos(data);  // Update the state with fetched data
    } catch (error) {
      console.error("Error fetching articulos:", error);
    }
  }

  async function updateChanges(newValue) {

    const cellUpdateParams = {
      rowIndex: rowIndex,
      colName: colName,
      newValue: newValue
    }

    try{
      //console.log("rowIndex changed: ", rowIndex);
      //console.log("colName changed: ", colName);
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response= await fetch(`${apiUrl}/updateChanges`, {
        method: "POST",
        body: JSON.stringify(cellUpdateParams),
        headers: {"Content-Type" : "application/json"}
      })
      const result = await response.json()
      if (response.ok){
        alert('Datos subidos correctamente');
      }
    } catch (error) {
      console.error(error.message);
      alert('Error subiendo los datos: ' + error.message)
    }
  }

const handleAddItem = async () => {
  console.log("handling add item");

  try {
    const formData = new FormData();
    formData.append("area", props.area);
    formData.append("nombre", newItem.nombre);
    formData.append("cant", newItem.cant);
    formData.append("cant_vol", newItem.cant);
    if (newItem.ruta_img) formData.append("ruta_img", newItem.ruta_img);
    if (newItem.ruta_pdf_instructivo) formData.append("ruta_pdf_instructivo", newItem.ruta_pdf_instructivo);
    if (newItem.ruta_pdf_seguridad) formData.append("ruta_pdf_seguridad", newItem.ruta_pdf_seguridad);

    console.log(formData)
    const apiUrl = process.env.REACT_APP_API_URL || '';
    const response = await fetch(`${apiUrl}/addItem`, {
      method: "POST",
      body: formData // No need to set Content-Type manually!
    });

    console.log(response);

    if (response.ok) {
      const result = await response.json();
      console.log("This is the result", result);
      alert('Artículo agregado correctamente');
      fetchArticulos(props.area);
      setIsAdding(false);
      setNewItem({
        nombre: '',
        cant: '',
        cant_vol: '',
        ruta_img: '',
        ruta_pdf_instructivo: '',
        ruta_img_instructivo: '',
        ruta_pdf_seguridad: '',
        ruta_img_seguridad: ''
      });
    }
  } catch (error) {
    console.error("Error en handleAddItem:", error);
    alert('Error agregando el artículo: ' + error.message);
  }
};

  async function uploadThumbnail(thumbnailUrl) {
    const blob = await (await fetch(thumbnailUrl)).blob(); // Convert dataURL to Blob

    const formData = new FormData();
    formData.append('thumbnail', blob, 'thumbnail.png');

    try{
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const response = await fetch(`${apiUrl}/upload-thumbnail`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      console.log('This is data.path ', data.path);

      setImgSource(data.path);

      console.log(thumbnailPath);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
  }


  const handlePdfChange = async (event) => {
    const input = event.target;
    const file = input.files[0];
    if (!file) return;

    const currentColName = colName; // Capture current colName synchronously
    const currentRowIndex = rowIndex;

    // Upload PDF
    const pdfFormData = new FormData();
    pdfFormData.append('pdf', file, file.name);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const pdfResponse = await fetch(`${apiUrl}/upload-pdf`, {
        method: 'POST',
        body: pdfFormData
      });

      if (!pdfResponse.ok) throw new Error("Error uploading PDF");

      const pdfData = await pdfResponse.json();
      const uploadedPath = pdfData.path;

      // Immediately update with uploaded PDF path
      await updateChangesForCell(currentRowIndex, currentColName, uploadedPath);

      // Generate thumbnail from new file
      const thumbnailUrl = await generatePDFThumbnail(file);

      // Upload thumbnail
      const blob = await (await fetch(thumbnailUrl)).blob();
      const formData = new FormData();
      formData.append('thumbnail', blob, 'thumbnail.png');

      const thumbResponse = await fetch(`${apiUrl}/upload-thumbnail`, {
        method: 'POST',
        body: formData,
      });

      const thumbData = await thumbResponse.json();
      const thumbPath = thumbData.path;

      // Infer thumbnail column name and update
      const thumbColName = currentColName === 'ruta_pdf_instructivo' ? 'ruta_img_instructivo' : 'ruta_img_seguridad';
      await updateChangesForCell(currentRowIndex, thumbColName, thumbPath);

      input.value = null;
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading PDF: " + error.message);
    }
  };
  const apiUrl = process.env.REACT_APP_API_URL || '';
  const updateChangesForCell = async (row, col, value) => {
    try {
      const response = await fetch(`${apiUrl}/updateChanges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowIndex: row, colName: col, newValue: value })
      });

      if (!response.ok) throw new Error('Failed to update cell');
      console.log(`Updated ${col} with value ${value}`);
    } catch (error) {
      console.error('Error updating cell:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const response = await fetch(`${apiUrl}/deleteItems`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedRowsDelete })
      });

      if (response.ok) {
        alert("Artículos eliminados exitosamente");
        fetchArticulos(props.area); // Refresh table
        setSelectedRowsDelete([]);  // Clear selection
      } else {
        alert("Error eliminando los artículos");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("Error de red");
    }
  };
  // Update fileSource changes
  useEffect(() => {
    if (fileSource === "/file/path/string") { // Skip al primer render
      return; 
    }
    console.log("fileSource changed:", fileSource);
    updateChanges(fileSource);
    if (colName === "ruta_pdf_instructivo")
    {
      setColName("ruta_img_instructivo");
    } 
    else if (colName === "ruta_pdf_seguridad")
    {
      setColName("ruta_img_seguridad");
    } 
    else 
    {
      console.log("Error, column does not correspond to a pdf file")
      return;
    }
  }, [fileSource]); 

  useEffect(() => {
    if (!thumbnailPath || (colName !== "ruta_img_instructivo" && colName !== "ruta_img_seguridad")) return;
    console.log("Updated thumbnailPath:", thumbnailPath);
    updateChanges(thumbnailPath);
    
  }, [thumbnailPath]);

  useEffect(() => {
    if (colName !== "") {
      console.log("colName colName:", colName);
    }
  }, [colName]);

  useEffect(() => {
    if (newText === ""){
      return;
    }
      updateChanges(newText);
  }, [newText]);

  // Update imgSource changes
  useEffect(() => {
    if (imgSource === "/file/path/string") { // Skip al primer render
      return; 
    }
    console.log("imgSource changed:", imgSource);
    updateChanges(imgSource);
  }, [imgSource]);

  useEffect(() => {
    if (thumbnail === null) { // Skip al primer render
      return; 
    }
    console.log("Thumbnail changed:", thumbnail);
    updateChanges(thumbnail);
  }, [thumbnail]); 


  // Obtener datos de la base de datos
  useEffect(() => {
    fetchArticulos(props.area); // <-- call it when component mounts
  }, [props.area]); // runs when prop area changes
  //Determina si el usuario esta en modo editar
  const [isEditing, setIsEditing] = useState(false);


  //Toggle del modo editar
  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setBtnBGColor(btnBGColor === 'grey' ? '#f56a0f' : 'grey')
  };

  const keyDownBusqueda = (e) => {
    if (e.key === 'Enter') {
      if (searchText.trim() === '') {
        // If search input is empty, show all results
        setResults(articulos);
      } else {
        const fuseResults = fuse.search(searchText);
        setResults(fuseResults.map(r => r.item));
      }
    }
  }

  const limpiarBusqueda = () => {
    setSearchText('');
    setResults(articulos);
  };
    useEffect(() => {
    setResults(articulos);
  }, [articulos]);

  const clickBusqueda = () => {
    const fuseResults = fuse.search(searchText);
    setResults(fuseResults.map(r => r.item));
  }

 return(
    <div>
      <DefaultNavbar />
      <div className="py-5">
        <Row className="pt-5">
          <Col></Col>
          <Col>
            <Row className="d-flex justify-content-center">
              <Col>
                <h1 className="fs-1 text-center">{props.nombreArea}</h1>
              </Col>
              <Row>
                <div className="d-flex justify-content-center mb-3 mt-2">
                  <ModalButton
                    className="me-2 d-flex align-items-center"
                    btnText={<><IoMdAddCircle />&ensp;Agregar Articulo</>}
                    modalTitle="Nuevo Articulo"
                    modalBody={
                     <FormAgregarArticulo
                       area={props.area}
                       fetchArticulos={fetchArticulos}
                     />
                    }
                  />
                  <Button
                    className="me-2 "
                    style={{ backgroundColor: btnBGColor ,borderColor:'white' }}
                    onClick={toggleEditing} //Boton de editar activa y desactiva modo editar.
                  >
                    <FaEdit className="pb-1"/>&ensp;Modo Edicion
                  </Button>
                  <Button
                    style={{ backgroundColor: "red", borderColor: "white" }}
                    hidden={!isEditing}
                    onClick={handleDeleteSelected}
                    disabled={selectedRowsDelete.length === 0}
                  >
                    <MdDeleteForever className="mb-1" />&ensp;Eliminar Articulos
                  </Button>
                </div>
              </Row>
            </Row>
            <InputGroup className="mb-4">
              <Form.Control
                placeholder="Buscar un producto o sustancia"
                aria-label="articuloBusq"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={keyDownBusqueda}
              />
              <Button 
                className="d-flex align-items-center" 
                style={{ backgroundColor: "#f56a0f", borderColor:"lightgrey" }}
                onClick={clickBusqueda}
              >
                <FaSearch />
              </Button>
              <Button
                style={{ backgroundColor: "#f56a0f", borderColor: "lightgrey" }}
                onClick={limpiarBusqueda}
              >
                <BsEraserFill className="mb-1" />
              </Button>
            </InputGroup>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
          <Col xs={9} style={{ maxHeight:'70vh', minHeight:'70vh' }}>
            <TablaInventarioAdmin 
              isEditing={isEditing}
              renglonArticulo=
              {
                results.map((articulo, index) => (
                  <RenglonArticuloAdmin 
                    key={articulo.id}
                    idArticulo={articulo.id} 
                    isEditing={isEditing}
                    setRowIndex={setRowIndex}
                    rowIndex={articulo.id}
                    selectedRowsDelete={selectedRowsDelete}
                    setSelectedRowsDelete={setSelectedRowsDelete}
                    imgArticulo={
                      <CeldaImgArticuloAdmin
                        isEditing={isEditing} 
                        imgSource={articulo.ruta_img}
                        setFileSource={setFileSource}
                        rowIndex={articulo.id}
                        setRowIndex={setRowIndex}
                        colName={"ruta_img"}
                        setColName={setColName}
                        nombreArticulo={articulo.nombre}
                      />
                    }
                    nombreArticulo={
                      <EditableCell 
                        isEditing={isEditing}
                        hoverText={"Cambiar nombre del articulo"}
                        defaultText={articulo.nombre}
                        value={value}
                        setValue={setValue}
                        setNewText={setNewText}
                        rowIndex={articulo.id}
                        setRowIndex={setRowIndex}
                        colName={"nombre"}
                        setColName={setColName}
                      />
                    } 
                    cantArticulo={
                      <EditableCell 
                        isEditing={isEditing}
                        hoverText={"Cambiar cantidad disponible"}
                        defaultText={articulo.cant}
                        value={value}
                        setValue={setValue}
                        setNewText={setNewText}
                        rowIndex={articulo.id}
                        setRowIndex={setRowIndex}
                        colName={"cant"}
                        setColName={setColName}
                      />
                    }
                    cantArticuloVol={
                      <EditableCell 
                        isEditing={isEditing}
                        hoverText={"Cambiar cantidad disponible"}
                        defaultText={articulo.cant_vol}
                        value={value}
                        setValue={setValue}
                        setNewText={setNewText}
                        rowIndex={articulo.id}
                        setRowIndex={setRowIndex}
                        colName={"cant"}
                        setColName={setColName}
                      />
                    }
                    instructivoArticulo={
                      <
                        CeldaPdfAdmin
                          setFileSource={setFileSource}
                          imgSource={PDFIcon}
                          nombreArticulo={articulo.nombre}
                          setRowIndex={setRowIndex}
                          rowIndex={articulo.id}
                          setColName={setColName}
                          colName={colName}
                          isEditing={isEditing}
                          PDF={articulo.ruta_pdf_instructivo}
                          onChange={handlePdfChange}
                          db_img={"ruta_img_instructivo"}
                          db_pdf={"ruta_pdf_instructivo"}
                      />
                    } 
                    datosSegArticulo={
                      <
                        CeldaPdfAdmin 
                          setFileSource={setFileSource}
                          imgSource={PDFIcon}
                          nombreArticulo={articulo.nombre}
                          setRowIndex={setRowIndex}
                          rowIndex={articulo.id}
                          setColName={setColName}
                          colName={colName}
                          isEditing={isEditing}
                          PDF={articulo.ruta_pdf_seguridad}
                          fileSource={articulo.ruta_img_seguridad}
                          onChange={handlePdfChange}
                          db_img={"ruta_img_seguridad"}
                          db_pdf={"ruta_pdf_seguridad"}
                      />
                    }
                  />
              ))}
            >
            </TablaInventarioAdmin>
          </Col>
          <Col></Col>
        </Row>
      </div>
    </div>
  );
}

export default InventarioAreaAdmin;
