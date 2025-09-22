import LogicModal from './LogicTitleBodyModal';
import Nav from 'react-bootstrap/Nav';

function ClickableNav(props){
  return(
    <Nav.Item>
      <Nav.Link className="text-hover" onClick={props.clickAction}>{props.navText}</Nav.Link>
    </Nav.Item>
  );
}

export default ClickableNav;
