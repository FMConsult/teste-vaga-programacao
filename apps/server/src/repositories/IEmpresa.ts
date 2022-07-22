export interface ICadastroEmpresa {
  id?: number;
  cnpj: string;
  nomeDaEmpresa: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  uf: string;
  cidade: string;
}
export interface IEmpresaRepository {
  create({ cnpj, nomeDaEmpresa, cep, endereco, numero, bairro, uf, cidade }: ICadastroEmpresa): Promise<ICadastroEmpresa>;
  update({ cnpj, nomeDaEmpresa, cep, endereco, numero, bairro, uf, cidade }: ICadastroEmpresa): Promise<ICadastroEmpresa>;
  findAll(): Promise<ICadastroEmpresa[]>;
}
