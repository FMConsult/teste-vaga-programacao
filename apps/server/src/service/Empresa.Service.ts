import { ErrorApp } from '~/ErrorApp';
import { IEmpresaRepository } from '~/repositories/IEmpresaRepository';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  cnpj: string;
  nomeDaEmpressa: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  uf: string;
  cidade: string;
}

@injectable()
export class CadastroService {
  constructor(
    @inject('EmpresaRepository')
    private EmpresaRepository: IEmpresaRepository
  ) {}
  async create({ cnpj, nomeDaEmpressa, cep, endereco, numero, bairro, uf, cidade }: IRequest) {
    console.log(bairro, cep, cidade, cnpj, endereco, nomeDaEmpressa, numero, uf);
    if (!cnpj) {
      throw new ErrorApp('cnpj em branco');
    }

    if (!nomeDaEmpressa) {
      throw new ErrorApp('nome Da Empressa em branco');
    }

    if (!cep) {
      throw new ErrorApp('cep em branco');
    }

    if (!endereco) {
      throw new ErrorApp('endereco em branco');
    }

    if (!numero) {
      throw new ErrorApp('numero em branco');
    }

    if (!bairro) {
      throw new ErrorApp('bairro em branco');
    }

    if (!uf) {
      throw new ErrorApp('uf em branco');
    }

    if (!cidade) {
      throw new ErrorApp('cidade em branco');
    }

    const empresa = await this.EmpresaRepository.create({ cnpj, nomeDaEmpressa, cep, endereco, numero, bairro, uf, cidade });

    return empresa;
  }
}
