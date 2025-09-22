import InventarioArea from '../components/InventarioArea.js'
import InventarioAreaAdmin from '../components/InventarioAreaAdmin.js';
import useUserType from '../hooks/useUserType.js';

function Cafeteria(){
  const userType = useUserType();

  if (userType === 'normal'){
    return <InventarioArea nombreArea="Cafetería" area="cafeteria"/>;
  }
  else if (userType === 'admin') {
    return <InventarioAreaAdmin nombreArea="Cafetería" area="cafeteria"/>;
  }
  return(
    <InventarioArea nombreArea="Cafetería"/>
  );
}

export default Cafeteria;
