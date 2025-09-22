import InventarioArea from '../components/InventarioArea.js';
import InventarioAreaAdmin from '../components/InventarioAreaAdmin.js';
import useUserType from '../hooks/useUserType.js';

function Gastronomia(){
  const userType = useUserType();

  if (userType === 'normal'){
    return <InventarioArea nombreArea="Gastronomía"/>;
  }
  else if (userType === 'admin') {
    return <InventarioAreaAdmin nombreArea="Gastronomía"/>;
  }
}

export default Gastronomia;
