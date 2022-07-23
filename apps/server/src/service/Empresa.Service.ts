import { ErrorApp } from '~/ErrorApp';
import { IEmpresaRepository } from '~/repositories/IEmpresa';
import { valida } from '~/utils/validacoes';
import { inject, injectable } from 'tsyringe';

interface IRequest {
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

@injectable()
export class CadastroService {
  constructor(
    @inject('EmpresaRepository')
    private EmpresaRepository: IEmpresaRepository
  ) {}
  async create({ cnpj, nomeDaEmpresa, cep, endereco, numero, bairro, uf, cidade }: IRequest) {
    const listField = { cnpj, nomeDaEmpresa, cep, endereco, numero, bairro, uf, cidade };

    const verify = valida(listField);

    if (verify) {
      throw new ErrorApp(`Campo em branco ${verify}`, 401);
    }

    const empresa = await this.EmpresaRepository.create({ cnpj, nomeDaEmpresa, cep, endereco, numero, bairro, uf, cidade });

    return empresa;
  }

  async getAll() {
    const empresa = await this.EmpresaRepository.findAll();
    return empresa;
  }
  async update({ id, cnpj, nomeDaEmpresa, cep, endereco, numero, bairro, uf, cidade }: IRequest) {
    const listField = { id, cnpj, nomeDaEmpresa, cep, endereco, numero, bairro, uf, cidade };

    const verify = valida(listField);

    if (verify) {
      throw new ErrorApp(`Campo em branco ${verify}`, 401);
    }

    const empresaUpdate = await this.EmpresaRepository.update({ id, cnpj, nomeDaEmpresa, cep, endereco, numero, bairro, uf, cidade });

    return empresaUpdate;
  }
}
