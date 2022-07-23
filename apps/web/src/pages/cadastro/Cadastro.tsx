import { Input } from "../../components/input/Input";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Container,
  ContainerButton,
  ContainerInputs,
  ContainerTitle,
  SectionContainer,
} from "./style";
import { Select } from "../../components/select/Select";
import { Button } from "../../components/button/Button";
import { Table } from "../../components/table/Table";

import axios from "axios";
import { CadastroData } from "../../interfaces/cadastro";
import { useState } from "react";
import { createInFormSchema } from "../../utils/validacoes";
import { useContextCadastro } from "../../context/use-cadastro-context";
const titulos = [
  { name: "CNPJ" },
  { name: "Nome Da Empresa" },
  { name: "Acoes" },
];

export function Cadastro() {
  const { cadastro, cadastros } = useContextCadastro();
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CadastroData>({
    resolver: yupResolver(createInFormSchema),
  });
  const handleSignIn: SubmitHandler<CadastroData> = async (
    values: CadastroData
  ) => {
    cadastro(values);
  };

  async function checkCep(e: any) {
    const cep = e.target.value.replace("/D/g", "");
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    setValue("bairro", data.bairro);
    setValue("endereco", data.logradouro);
    setValue("uf", data.uf);
    setValue("cidade", data.localidade);
    setCidade(data.localidade);
    setUf(data.uf);
  }

  function cancel() {
    setValue("cnpj", "");
    setValue("nomeDaEmpresa", "");
    setValue("cep", "");
    setValue("endereco", "");
    setValue("numero", "");
    setValue("bairro", "");
    setValue("uf", "");
    setValue("cidade", "");
  }
  return (
    <Container>
      <ContainerTitle>
        <h3>Formulário de Cadastro</h3>
      </ContainerTitle>
      <form onSubmit={handleSubmit(handleSignIn)}>
        <ContainerInputs>
          <Input
            width="30%"
            Label="CNPJ:"
            type="text"
            placeholder="00000000"
            {...register("cnpj")}
            error={errors.cnpj}
          />
          <Input
            width="70%"
            type="text"
            Label="Nome da Empressa:"
            placeholder="exemplo "
            {...register("nomeDaEmpresa")}
            error={errors.nomeDaEmpresa}
          />
        </ContainerInputs>
        <ContainerInputs>
          <Input
            width="20%"
            Label="CEP:"
            type="text"
            placeholder="0000000"
            {...register("cep")}
            error={errors.cep}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => checkCep(e)}
          />
          <Input
            width="90%"
            Label="Endereço:"
            type="text"
            placeholder="Rua examplo"
            {...register("endereco")}
            error={errors.endereco}
          />
          <Input
            width="10%"
            Label="Número:"
            type="text"
            placeholder="000"
            {...register("numero")}
            error={errors.numero}
          />
        </ContainerInputs>
        <ContainerInputs>
          <Input
            width="70%"
            Label="Bairro:"
            type="text"
            placeholder="bairro examplo"
            {...register("bairro")}
            error={errors.bairro}
          />
          <Select
            {...register("uf")}
            label={"Uf"}
            value={uf}
            error={errors.uf}
          />
          <Select
            {...register("cidade")}
            label={"Cidade"}
            value={cidade}
            error={errors.cidade}
          />
        </ContainerInputs>
        <ContainerButton>
          <Button type="button" onClick={cancel}>
            Cancelar
          </Button>
          <Button color={"#3d8af7"}>Salvar</Button>
        </ContainerButton>
      </form>
      <SectionContainer>
        <p>Empresas Cadastradas</p>
        <Table titulos={titulos} dados={cadastros} />
      </SectionContainer>
    </Container>
  );
}
