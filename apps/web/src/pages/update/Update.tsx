import { Input } from "../../components/input/Input";
import { SubmitHandler, useForm, useFormState } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  ContainerButton,
  ContainerInputs,
  ContainerTitle,
} from "./style";
import { Button } from "../../components/button/Button";
import { Select } from "../../components/select/Select";
import axios from "axios";
import { CadastroData } from "../../interfaces/cadastro";
import { yupResolver } from "@hookform/resolvers/yup";
import { createInFormSchema } from "../../utils/validacoes";
import { useContextCadastro } from "../../context/use-cadastro-context";
import { useEffect, useState } from "react";

export function UpdateCadastro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCadastro, cadastros } = useContextCadastro();
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
    try {
      updateCadastro(Number(id), values);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const cadastro = cadastros.filter(
      (empresa) => empresa.id === Number(id)
    )[0];

    setValue("cnpj", cadastro.cnpj);
    setValue("nomeDaEmpresa", cadastro.nomeDaEmpresa);
    setValue("cep", cadastro.cep);
    setValue("endereco", cadastro.endereco);
    setValue("numero", cadastro.numero);
    setValue("bairro", cadastro.bairro);
    setValue("uf", cadastro.uf);
    setValue("cidade", cadastro.cidade);
    setCidade(cadastro.cidade);
    setUf(cadastro.uf);
  }, []);

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
    navigate("/");
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
            Label="Numero:"
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
          <Button onClick={cancel}>Cancelar</Button>
          <Button color={"#3d8af7"}>Salvar</Button>
        </ContainerButton>
      </form>
    </Container>
  );
}
