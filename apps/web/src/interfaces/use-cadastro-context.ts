import { ReactNode } from "react";
import { CadastroData } from "./cadastro";

export interface UseCadastroContext {
  cadastros: CadastroData[];
  cadastro: (values: CadastroData) => Promise<void>;
}
export interface UseCadastroProviderProps {
  children: ReactNode;
}
