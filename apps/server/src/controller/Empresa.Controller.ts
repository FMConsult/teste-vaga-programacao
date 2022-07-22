import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CadastroService } from '../service/Empresa.Service';

export class Cadastro {
  async create(req: Request, res: Response) {
    const { cnpj, nomeDaEmpressa, cep, endereco, numero, bairro, uf, cidade } = req.body;
    const cadastroService = container.resolve(CadastroService);
    const response = await cadastroService.create({ bairro, cep, cidade, cnpj, endereco, nomeDaEmpressa, numero, uf });

    return res.status(201).json(response);
  }

  async getAll(req: Request, res: Response) {
    const cadastroService = container.resolve(CadastroService);
    const response = await cadastroService.getAll();

    return res.status(200).json(response);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;

    const { cnpj, nomeDaEmpressa, cep, endereco, numero, bairro, uf, cidade } = req.body;
    const cadastroService = container.resolve(CadastroService);
    const idNumber = Number(id);
    const response = await cadastroService.update({ id: idNumber, bairro, cep, cidade, cnpj, endereco, nomeDaEmpressa, numero, uf });

    return res.status(200).json(response);
  }
}
