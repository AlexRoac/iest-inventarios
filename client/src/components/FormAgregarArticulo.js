import { Button, Form, Row, Col } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import { useState } from 'react';
import { generatePDFThumbnail } from '../utils/pdfThumbnailGenerator.js';
import { uploadThumbnail } from '../utils/uploadThumbnail.js';

const apiUrl = process.env.REACT_APP_API_URL || '';
function FormAgregarArticulo({ area: areaProp, fetchArticulos }) {
  const isAreaFixed = !!areaProp;

  const [formData, setFormData] = useState({
    area: areaProp || '',
    nombre: '',
    cant: '',
    capRecipiente: '',
    ruta_img: '',
    ruta_pdf_instructivo: '',
    ruta_img_instructivo: '',
    ruta_pdf_seguridad: '',
    ruta_img_seguridad: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // Si es archivo, toma el primer archivo
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Convert values to numbers before using them
    const cant = parseFloat(formData.cant);
    const capRecipiente = parseFloat(formData.capRecipiente);
    const cant_vol = cant * capRecipiente;

    // Append each field manually so we have control
    data.append('area', formData.area);
    data.append('nombre', formData.nombre);
    data.append('cant', cant);
    data.append('capRecipiente', capRecipiente);
    data.append('cant_vol', cant_vol);

    // Append files if they exist
    const fileFields = [
      'ruta_img',
      'ruta_pdf_instructivo',
      'ruta_pdf_seguridad'
    ];
    for (const field of fileFields) {
      if (formData[field]) {
        data.append(field, formData[field]);
      }    
    }

    // Generate thumbnails for the PDFs
    const pdfFieldsWithThumbnails = [
      { pdfKey: 'ruta_pdf_instructivo', thumbKey: 'ruta_img_instructivo' },
      { pdfKey: 'ruta_pdf_seguridad', thumbKey: 'ruta_img_seguridad' }
    ];

    for (const { pdfKey, thumbKey } of pdfFieldsWithThumbnails) {
      const pdfFile = formData[pdfKey];
      if (pdfFile) {
        const thumbnailDataUrl = await generatePDFThumbnail(pdfFile, 0.5);

        // Convert base64 data URL to Blob
        const res = await fetch(thumbnailDataUrl);
        const blob = await res.blob();

        // Append thumbnail blob as a file (you can name it however you want)
        const thumbFile = new File([blob], `${pdfKey}_thumb.png`, { type: 'image/png' });
        data.append(thumbKey, thumbFile);
      }
    }

    try {
      const response = await fetch(`${apiUrl}/addItem`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        const nuevoArticulo = result.articulo;
        console.log(nuevoArticulo.ruta_pdf_instructivo);
        alert('Artículo agregado correctamente');
        fetchArticulos(formData.area);
      } else {
        alert('Error al agregar el artículo');
      }
    } catch (error) {
      console.error('Error al agregar artículo:', error);
      alert('Error en la petición: ' + error.message);
    }
  };

  async function fetchPdfBlob(pdfRoute) {
    const response = await fetch(`${apiUrl}/${pdfRoute}`);
    const blob = await response.blob();
    return blob;
  }

  return (
    <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light my-4">
      <Row>
        <Col>
          <Form.Group controlId="area">
            <Form.Label>Área</Form.Label>
            <Form.Select
              name="area"
              value={formData.area}
              onChange={handleChange}
              disabled={isAreaFixed}
              required
            >
              <option value="">Seleccione un área</option>
              <option value="medicina">Medicina</option>
              <option value="serviciosGenerales">Servicios Generales</option>
              <option value="cafeteria">Cafetería</option>
              <option value="gastronomia">Gastronomía</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="pt-3">
        <Col>
          <Form.Group controlId="cant">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              name="cant"
              value={formData.cant}
              onChange={handleChange}
              required
            />

          </Form.Group>
        </Col>
        <Col>
            <Form.Label>Litros/KG Recipiente</Form.Label>
            <Form.Control
              type="number"
              name="capRecipiente"
              value={formData.capRecipiente}
              onChange={handleChange}
              required
            />
        </Col>
      </Row>
      <Row className="pt-3">
        <Col>
          <Form.Group controlId="ruta_img">
            <Form.Label>Imagen del Artículo</Form.Label>
            <Form.Control type="file" name="ruta_img" onChange={handleChange} required />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group controlId="ruta_pdf_instructivo">
            <Form.Label>PDF Instructivo</Form.Label>
            <Form.Control type="file" name="ruta_pdf_instructivo" onChange={handleChange} />
          </Form.Group>
        </Col>
      </Row>
      <Row className="pt-3">
        <Col>
          <Form.Group controlId="ruta_pdf_seguridad">
            <Form.Label>PDF Seguridad</Form.Label>
            <Form.Control type="file" name="ruta_pdf_seguridad" onChange={handleChange} />
          </Form.Group>
        </Col>
        <Col className="d-flex align-items-end justify-content-end me-4 mb-1">
          <Button type="submit" style={{ backgroundColor: '#f56a0f', borderColor: 'white' }}>
            Agregar Articulo <FaSave className="ms-2" />
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default FormAgregarArticulo;
