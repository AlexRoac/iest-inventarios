import ToggleButton from 'react-bootstrap/ToggleButton';
import { useState } from 'react';

function RenglonArticuloAdmin(props){

  const [btnBGColor, setBtnBGColor] = useState("grey");
  const [selected, setSelected] = useState(false);

  const handleToggleButtonClick = () => {
    if (!props.isEditing) return;

    const isNowSelected = !selected;
    setSelected(isNowSelected);
    setBtnBGColor(isNowSelected ? 'red' : 'grey');

    if (isNowSelected) {
      props.setSelectedRowsDelete([...props.selectedRowsDelete, props.rowIndex]);
    } else {
      props.setSelectedRowsDelete(
        props.selectedRowsDelete.filter((id) => id !== props.rowIndex)
      );
    }
  };

  return (
    <tr className="text-center align-middle fs-4">
      <td>{props.idArticulo}</td>
      <td>{props.imgArticulo}</td>
      <td>{props.nombreArticulo}</td>
      <td>{props.cantArticulo}</td>
      <td>{props.cantArticuloVol}</td>
      <td>{props.instructivoArticulo}</td>
      <td>{props.datosSegArticulo}</td>
      {props.isEditing && (
        <td>
          <ToggleButton
            id="tbg-check-1"
            value={1}
            style={{ backgroundColor: btnBGColor, borderColor: 'white' }}
            onClick={handleToggleButtonClick}
          >
            Eliminar
          </ToggleButton>
        </td>
      )}
    </tr>
  );
}

export default RenglonArticuloAdmin;
