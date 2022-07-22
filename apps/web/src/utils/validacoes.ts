import * as yup from "yup";

export const createInFormSchema = yup.object().shape({
  cnpj: yup.string().required("cnpj obrigatorio"),
  nomeDaEmpresa: yup.string().required("nome obrigatório"),
  cep: yup.string().required("cep obrigatório"),
  endereco: yup.string().required("endereço obrigatório"),
  numero: yup.string().required("numero obrigatório"),
  bairro: yup.string().required("bairro obrigatório"),
  uf: yup.string().required("obrigatório"),
  cidade: yup.string().required(" obrigatório"),
});
