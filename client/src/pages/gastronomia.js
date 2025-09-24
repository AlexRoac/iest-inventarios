import InventarioArea from '../components/InventarioArea.js';
import InventarioAreaAdmin from '../components/InventarioAreaAdmin.js';
import useUserType from '../hooks/useUserType.js';

function Gastronomia(){
  const userType = useUserType();

  if (userType === 'normal'){
    return <InventarioArea nombreArea="Gastronomía" area="gastronomia"/>;
  }
  else if (userType === 'admin') {
    return <InventarioAreaAdmin nombreArea="Gastronomía" area="gastronomia"/>;
  }
}

export default Gastronomia;
