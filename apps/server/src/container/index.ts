import { EmpresaRepository } from '~/repositories/Empresa.Repository';
import { IEmpresaRepository } from '~/repositories/IEmpresa';
import { container } from 'tsyringe';

container.registerSingleton<IEmpresaRepository>('EmpresaRepository', EmpresaRepository);
