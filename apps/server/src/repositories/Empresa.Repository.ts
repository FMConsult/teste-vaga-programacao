import { prisma } from '~/database';

import { IEmpresaRepository, ICadastroEmpresa } from './IEmpresa';

export class EmpresaRepository implements IEmpresaRepository {
  async findAll(): Promise<ICadastroEmpresa[]> {
    const findAll = await prisma.cadastroEmpresa.findMany();
    return findAll;
  }
  async create({ cnpj, nomeDaEmpresa, cep, endereco, numero, bairro, uf, cidade }: ICadastroEmpresa): Promise<ICadastroEmpresa> {
    const createEmpresa = await prisma.cadastroEmpresa.create({
      data: {
        cnpj,
        nomeDaEmpresa,
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
  async update({ id, cnpj, nomeDaEmpresa, cep, endereco, numero, bairro, uf, cidade }: ICadastroEmpresa): Promise<ICadastroEmpresa> {
    const updateEmpresa = await prisma.cadastroEmpresa.update({
      where: {
        id,
      },
      data: {
        cnpj,
        nomeDaEmpresa,
        cep,
        endereco,
        numero,
        bairro,
        uf,
        cidade,
      },
    });
    return updateEmpresa;
  }
}
