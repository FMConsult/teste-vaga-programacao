import { Link } from "react-router-dom";
import { TableProps } from "../../interfaces/table";
import { TableStyle } from "./style";

export function Table({ dados, titulos }: TableProps) {
  return (
    <>
      <TableStyle>
        <thead>
          <tr>
            {titulos &&
              titulos.map((item, index) => <th key={index}>{item.name}</th>)}
          </tr>
        </thead>
        <tbody>
        {dados &&
          dados.map((item, index) => (
            <tr key={index}>
              <td>{item.cnpj}</td>
              <td>{item.nomeDaEmpresa}</td>
              <td>{item.id && <Link to={String(item.id)}>Edit</Link>}</td>
            </tr>
          ))}
          </tbody>
      </TableStyle>
    </>
  );
}
