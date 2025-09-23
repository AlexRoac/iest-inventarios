import {Button, Row, Col, Form, Image, InputGroup} from 'react-bootstrap';
import {FaSave, FaEdit, FaPlus, FaSearch} from 'react-icons/fa'
import { BsEraserFill } from 'react-icons/bs';
import DefaultNavbar from './navbar';
import TablaInventario from './TablaInventario';
import RenglonArticulo from './RenglonArticulo';
import ImgInventario from '../components/imgInventario';
import CeldaImgArticulo from '../components/CeldaImgArticulo';
import CeldaPdf from '../components/CeldaPdf';
import iconoPdf from '../assets/pdf.png';
import { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';

function InventarioArea(props){

  const [searchText, setSearchText] = useState('');

  const [articulos, setArticulos] = useState([]);

  const [results, setResults] = useState(articulos);

  const isFirstRender = useRef(true);

  const [thumbnailPath, setThumbnailPath] = useState("");

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

  // Obtener datos de la base de datos
  useEffect(() => {
    fetchArticulos(props.area); // <-- call it when component mounts
  }, [props.area]); // runs when prop area changes

  const fuse = new Fuse(articulos, { 
    keys: ['nombre'],
    treshold: 0.2,
    ignoreDiacritics: true,
  });

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

  const clickBusqueda = () => {
    const fuseResults = fuse.search(searchText);
    setResults(fuseResults.map(r => r.item));
  }

  const limpiarBusqueda = () => {
    setSearchText('');
    setResults(articulos);
  };
    useEffect(() => {
    setResults(articulos);
  }, [articulos]);

 return(
    <div>
      <DefaultNavbar />
      <div className="py-5">
        <Row className="mb-3 mt-5">
          <Col></Col>
          <Col>
            <Row className="d-flex justify-content-end text-center">
              <Col xs={12}>
                <h1 className="fs-1 text-center ">{props.nombreArea}</h1>
              </Col>
              <Col>
              </Col>
            </Row>
            <InputGroup className="mb-3 mt-3">
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
          <Col xs={10} style={{ maxHeight:'70vh', minHeight:'70vh' }}>
            <TablaInventario
              renglonArticulo=
              {
                results.map((articulo, index) => (
                  <RenglonArticulo key={articulo.id}
                    idArticulo={articulo.id} 
                    imgArticulo={
                      <CeldaImgArticulo
                        imgSource={articulo.ruta_img}
                        nombreArticulo={articulo.nombre}
                      />
                    }
                    nombreArticulo={
                      <span className="fs-3">
                        {articulo.nombre}
                      </span>
                    } 
                    instructivoArticulo={
                      <
                        CeldaPdf
                          imgSource={iconoPdf}
                          nombreArticulo={articulo.nombre}
                          PDF={articulo.ruta_pdf_instructivo}
                      />
                    } 
                    datosSegArticulo={
                      <
                        CeldaPdf
                          imgSource={iconoPdf}
                          nombreArticulo={articulo.nombre}
                          PDF={articulo.ruta_pdf_seguridad}
                      />
                    }
                  />
              ))}
            >
            </TablaInventario>
          </Col>
          <Col></Col>
        </Row>
      </div>
    </div>
  );
}

export default InventarioArea;
