import { prisma } from '~/database';

import { IEmpresaRepository, ICadastroEmpresa } from './IEmpresaRepository';

export class EmpresaRepository implements IEmpresaRepository {
  
  //   const totalEmpresa
  // }
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
