import {Table} from 'react-bootstrap';

function TablaInventario(props){
  return(
    <>
      <Table striped bordered >
        <thead>
          <tr className="text-center" style={{ backgroundColor: '#f56a0f', color:'white', textAlign: "center" }}>
            <th>ID</th>
            <th>Imagen del Producto o Sustancia</th>
            <th>Nombre del Producto o Sustancia</th>
            <th>Instructivo de Trabajo</th>
            <th>Hoja de Datos de Seguridad</th>
          </tr>
        </thead>
        <tbody>
          {props.renglonArticulo}
        </tbody>
      </Table>
    </>
  );
}

export default TablaInventario;
