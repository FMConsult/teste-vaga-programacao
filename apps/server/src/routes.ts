import { Router } from 'express';

import { Cadastro } from './controller/Empresa.Controller';

export const router = Router();
const controllerCadastro = new Cadastro();

router.post('/cadastro/', controllerCadastro.create);
router.get('/', controllerCadastro.getAll);
