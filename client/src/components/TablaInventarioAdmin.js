import {Button, Container, Row, Col, Image, Table} from 'react-bootstrap';
import { useState } from 'react';

//Id, imagen, nombre, cantidad, instructivo, datos de seguridad 

function TablaInventarioAdmin(props){
  return(
    <>
      <Table striped bordered >
        <thead>
          <tr className="text-center" style={{ backgroundColor: '#f56a0f', color:'white' }}>
            <th>ID</th>
            <th>Imagen del Producto o Sustancia</th>
            <th>Nombre del Producto o Sustancia</th>
            <th>Cantidad Disponible (Pieza)</th>
            <th>Cantidad Disponible (Litros/KG)</th>
            <th>Instructivo de Trabajo</th>
            <th>Hoja de Datos de Seguridad</th>
            {props.isEditing && (
              <th></th>
            )}
          </tr>
        </thead>
        <tbody>
          {props.renglonArticulo}
        </tbody>
      </Table>
    </>
  );
}

export default TablaInventarioAdmin;
