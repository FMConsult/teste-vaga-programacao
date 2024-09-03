export interface TableProps {
  titulos: Titulo[];
  dados: Dado[];
}

export interface Dado {
  id?:number
  cnpj: string;
  nomeDaEmpresa: String;
}
export interface Titulo {
  name: string;
}
