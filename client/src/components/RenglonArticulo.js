function RenglonArticulo(props){
  return(
    <tr className="text-center align-middle">
      <td>{props.idArticulo}</td>
      <td>{props.imgArticulo}</td>
      <td>{props.nombreArticulo}</td>
      <td>{props.instructivoArticulo}</td>
      <td>{props.datosSegArticulo}</td>
    </tr>
  );
}

export default RenglonArticulo;
