import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import {
  FormularioRegistro,
  DadosEmpresa,
  DadosEndereco,
} from "./FormRegisterStyled";
import { Input } from "./Input";
import "./index.css";
import { db } from "../../service/firebase";

import { collection, addDoc, getDocs } from "firebase/firestore";

export const FormRegister = () => {
  const [cnpj, setCnpj] = useState("");
  const [nome, setNome] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [empresas, setEmpresas] = useState([]);
  const empresasCollRef = collection(db, "empresas");

  const cadastrarEmpresa = async (event) => {
    // event.preventDefault();
    console.log({
      bairro: bairro,
      cep,
      cidade,
      cnpj,
      endereco,
      nome,
      numero,
      uf,
    });

    // ADICIONANDO UM NOVO DOCUMENTO COM ID ALEATORIO PASSANDO TODOS OS DADOS COLETADOS
    const docRef = await addDoc(collection(db, "empresas"), {
      bairro: bairro,
      cep: cep,
      cidade: cidade,
      cnpj: cnpj,
      endereco: endereco,
      nome: nome,
      numero: numero,
      uf: uf,
    })
      .then((response) => {
        alert("Dados cadastrados com sucesso!!!");
      })
      .catch((response) => {
        alert("Dados não cadastrados, pois falhou!");
      });
  };

  useEffect(() => {
    const getEmpresas = async () =>{
        const data = await getDocs(empresasCollRef)
        setEmpresas(data.docs.map((doc)=>({...doc.data(), id: doc.id})))
    }
    getEmpresas()
  },[]);

  return (
    <>
      <FormularioRegistro onSubmit={cadastrarEmpresa}>
        <DadosEmpresa>
          <Input
            text="CNPJ"
            type="number"
            id="empresaCnpj"
            name="empresaCnpj"
            placeholder="Digite seu CNPJ ..."
            value={cnpj}
            onChange={(event) => setCnpj(event.target.value)}
          />
          <Input
            text="Nome da Empresa"
            type="text"
            id="empresaNome"
            name="empresaNome"
            placeholder="Nome da empresa ..."
            value={nome}
            onChange={(event) => setNome(event.target.value)}
          />
        </DadosEmpresa>

        <DadosEndereco className="dadosEndereco">
          <Input
            text="CEP"
            type="number"
            id="cepCidade"
            name="cepCidade"
            placeholder="Cep da cidade ..."
            value={cep}
            onChange={(event) => setCep(event.target.value)}
          />
          <Input
            text="Endereço"
            type="text"
            id="empresaEndereco"
            name="empresaEndereco"
            placeholder="Digite o endereço ..."
            value={endereco}
            onChange={(event) => setEndereco(event.target.value)}
          />
          <Input
            text="Número"
            type="number"
            id="empresaNumero"
            name="empresaNumero"
            onChange={(event) => setNumero(event.target.value)}
            placeholder="Número do local ..."
            value={numero}
          />
          <Input
            text="Bairro"
            type="text"
            id="empresaBairro"
            name="empresaBairro"
            placeholder="Digite seu bairro ..."
            value={bairro}
            onChange={(event) => setBairro(event.target.value)}
          />
          <Input
            text="UF"
            type="text"
            id="unidadeFederativa"
            name="unidadeFederativa"
            placeholder="Unidade Federativa ..."
            value={uf}
            onChange={(event) => setUf(event.target.value)}
          />
          <Input
            text="Cidade"
            type="text"
            id="cidade"
            name="cidade"
            placeholder="Digite sua cidade ..."
            value={cidade}
            onChange={(event) => setCidade(event.target.value)}
          />
        </DadosEndereco>

        <Button type="reset" text="Resetar campos" />
        <Button type="submit" text="Cadastrar empresa" />
      </FormularioRegistro>
      <div>
        <ul>
          {empresas.map((empresa) => {
            return (
              <div key={empresa.id}>
                <li>CNPJ: {empresa.cnpj}</li>
                <li>Nome da empresa: {empresa.nome}</li>
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
};
