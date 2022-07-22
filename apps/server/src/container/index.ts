import { EmpresaRepository } from '~/repositories/Empresa.Repository';
import { IEmpresaRepository } from '~/repositories/IEmpresaRepository';
import { container } from 'tsyringe';

container.registerSingleton<IEmpresaRepository>('EmpresaRepository', EmpresaRepository);
