import { prisma } from '~/database';

import { IEmpresaRepository, ICadastroEmpresa } from './IEmpresa';

export class EmpresaRepository implements IEmpresaRepository {
  update({ cnpj, nomeDaEmpressa, cep, endereco, numero, bairro, uf, cidade }: ICadastroEmpresa): Promise<ICadastroEmpresa> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<ICadastroEmpresa[]> {
    const findAll = await prisma.cadastroEmpresa.findMany();
    return findAll;
  }
  async create({ cnpj, nomeDaEmpressa, cep, endereco, numero, bairro, uf, cidade }: ICadastroEmpresa): Promise<ICadastroEmpresa> {
    const createEmpresa = await prisma.cadastroEmpresa.create({
      data: {
        cnpj,
        nomeDaEmpressa,
        cep,
        endereco,
        numero,
        bairro,
        uf,
        cidade,
      },
    });
    return createEmpresa;
  }
}
