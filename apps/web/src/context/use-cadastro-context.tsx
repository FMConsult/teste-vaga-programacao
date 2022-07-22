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

  async function updateCadastro(id: number, values: CadastroData) {
    const { data } = await api.put(`/cadastro/${id}`, {
      ...values,
    });

    const update = cadastros.map((cadastro) => {
      if (cadastro.id === id) {
        return {
          ...cadastro,
          cnpj: values.cnpj,
          nomeDaEmpresa: values.nomeDaEmpresa,
          cep: values.cep,
          endereco: values.endereco,
          numero: values.numero,
          bairro: values.bairro,
          uf: values.uf,
          cidade: values.cidade,
        };
      }
      return cadastro;
    });

    setCadastros(update);
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
