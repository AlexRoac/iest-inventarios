import {useNavigate} from 'react-router-dom';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';


function BtnArea(props){

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(props.ruta)
  };

  if (props.userType === "admin"){
    return(
      <>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>{props.hoverText}</Tooltip>}
        >
          <div 
             className="text-center"
             style={{ 
               cursor: 'pointer',
               transition: 'transform 0.3s ease',
               ':hover': {
                 transform: 'scale(1.05)'
               }
             }}
             onClick={handleClick}
           >
             <div style={{
               width: '100%',
               height: '200px',
               overflow: 'hidden',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               marginBottom: '15px',
               borderRadius: '8px',
               //boxShadow: '0 4px 8px rgba(0,0,0,0.1)' //AQUI ESTA ALEX LO DE LA SOMBRA ANTES DE QUE SE TE OLVIDE
             }}>
               <Image
                 src={props.img}
                 style={{
                   width: '100%',
                   height: '100%',
                   objectFit: 'cover',
                   transition: 'transform 0.3s ease'
                 }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
               />
             </div>
             <h3 style={{
               color: '#f56a0f',
               fontWeight: 'bold',
               fontSize: '1.2rem',
               marginTop: '10px'
             }}>
               {props.nombreArea}
             </h3>
           </div>
         </OverlayTrigger>
       </>
     );
  }
  else {
    return(
      <div 
         className="text-center"
         style={{ 
           cursor: 'pointer',
           transition: 'transform 0.3s ease',
           ':hover': {
             transform: 'scale(1.05)'
           }
         }}
         onClick={handleClick}
       >
         <div style={{
           width: '100%',
           height: '200px',
           overflow: 'hidden',
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center',
           marginBottom: '15px',
           borderRadius: '8px',
           //boxShadow: '0 4px 8px rgba(0,0,0,0.1)' //AQUI ESTA ALEX LO DE LA SOMBRA ANTES DE QUE SE TE OLVIDE
         }}>
           <Image
             src={props.img}
             style={{
               width: '100%',
               height: '100%',
               objectFit: 'cover',
               transition: 'transform 0.3s ease'
             }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
           />
         </div>
         <h3 style={{
           color: '#f56a0f',
           fontWeight: 'bold',
           fontSize: '1.2rem',
           marginTop: '10px'
         }}>
           {props.nombreArea}
         </h3>
       </div>
     );
  }
}

export default BtnArea;
