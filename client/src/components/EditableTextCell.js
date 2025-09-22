import { useRef, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function EditableTextCell(props){

  const [inputToggle, setInputToggle] = useState(false);

  async function subirCambios() {

  }

  const handleCellClick = () => {
    if (props.isEditing) {
      setInputToggle(true);
      props.setRowIndex(props.rowIndex);
      props.setColName(props.colName);
    }
  };

  const handleInputChange = (e) => {
    props.setValue(e.target.value);
  };

  const handleBlur = () => {
    setInputToggle(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setInputToggle(false);
      props.setNewText(props.value);
      props.setValue("")
    }
  };

  if(inputToggle){
    return(
      <>
          <input
            type="text"
            value={props.value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
      </>
    );
  }

  else{
    if(!props.isEditing){
      return(
          <>
            <span onClick={handleCellClick}>
              {props.defaultText}
            </span>
          </>
        );
      } else {
        return(
          <>
            <OverlayTrigger 
              placement="top"
              overlay={<Tooltip id="tooltip-top">{props.hoverText}</Tooltip>}
            >
              <span onClick={handleCellClick}>
                {props.defaultText}
              </span>
            </OverlayTrigger>
          </>
        );
      }
  }
}

export default EditableTextCell;
