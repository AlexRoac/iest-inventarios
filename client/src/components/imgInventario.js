import ClickableImg from './ClickableImg.js';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function ImgInventario(props){
  return(
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="tooltip-top">{props.hoverText}</Tooltip>}
    >
      <div>
        <ClickableImg imgSource={props.imgSource} maxHeight="10vh" className="mx-auto d-flex" onClick={props.onClick}/>
      </div>
    </OverlayTrigger>
  );
}

export default ImgInventario;
