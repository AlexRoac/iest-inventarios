import InventarioArea from '../components/InventarioArea.js';
import InventarioAreaAdmin from '../components/InventarioAreaAdmin.js';
import useUserType from '../hooks/useUserType.js';

function Medicina(){
  const userType = useUserType();

  if (userType === 'normal'){
    return <InventarioArea nombreArea="Medicina" area="medicina"/>;
  }
  else if (userType === 'admin') {
    return <InventarioAreaAdmin nombreArea="Medicina" area="medicina"/>;
  }
}

export default Medicina;
