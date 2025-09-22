function ClickableImg(props){
  return(
    <img src={props.imgSource}
      onClick={props.onClick} 
      style={{ cursor:'pointer', maxHeight:props.maxHeight, maxWidth:props.maxWidth }}
      className={props.className}
    />
  );
}

export default ClickableImg;
