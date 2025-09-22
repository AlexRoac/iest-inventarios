import InventarioArea from '../components/InventarioArea.js';
import InventarioAreaAdmin from '../components/InventarioAreaAdmin.js';
import useUserType from '../hooks/useUserType.js';

function ServiciosGenerales(){
  const userType = useUserType();

 if (userType === 'normal'){
    return <InventarioArea nombreArea="Servicios Generales" area='serviciosGenerales'/>;
  }
  else if (userType === 'admin') {
    return <InventarioAreaAdmin nombreArea="Servicios Generales" area='serviciosGenerales'/>;
  }
}

export default ServiciosGenerales;
