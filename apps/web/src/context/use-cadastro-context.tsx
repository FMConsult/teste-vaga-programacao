import { createContext, useContext, useEffect, useState } from "react";
import { CadastroData } from "../interfaces/cadastro";
import {
  UseCadastroContext,
  UseCadastroProviderProps,
} from "../interfaces/use-cadastro-context";
import { api } from "../services/api";

export const useCadastroContext = createContext<UseCadastroContext>(
  {} as UseCadastroContext
);

export const CadastroStorage = ({ children }: UseCadastroProviderProps) => {
  const [cadastros, setCadastros] = useState<CadastroData[]>([]);
  useEffect(() => {
    async function getAll() {
      const { data } = await api.get("/");
      console.log(data);
      setCadastros([...data]);
    }
    getAll();
  }, []);

  async function cadastro(values: CadastroData) {
    const { data } = await api.post("/cadastro", {
      ...values,
    });

    setCadastros((prevent) => [...prevent, data]);
  }

  return (
    <useCadastroContext.Provider value={{ cadastros, cadastro }}>
      {children}
    </useCadastroContext.Provider>
  );
};
export function useContextCadastro() {
  const context = useContext(useCadastroContext);
  return context;
}
