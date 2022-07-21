import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import "./index.css";

import { db } from "../../service/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export const FormRegister = () => {
  // VARIÁVEIS DE ESTADO
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

  const clearFields = () => {
    setBairro("");
    setCep("");
    setCidade("");
    setCnpj("");
    setEndereco("");
    setNome("");
    setNumero("");
    setUf("");
    alert("Campos resetados com sucesso!")
  };

  useEffect(() => {
    // PEGANDO OS DADOS QUE ESTÃO NO FIRESTORE EM TEMPO REAL
    const getEmpresas = async () => {
      const data = await getDocs(empresasCollRef);
      setEmpresas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getEmpresas();
  }, []);

  return (
    <>
      <form onSubmit={cadastrarEmpresa} className="FormRegister_container">
        <h3>Formulário de Cadastro</h3>
        <div className="FormRegister_empresaData">
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
        </div>

        <div>
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
        </div>
        <div className="FormRegister_buttonGroup">
          <button type="reset" onClick={clearFields} className="reset-field">
            Resetar campos
          </button>
          <button type="submit" className="submit">
            Cadastrar empresa
          </button>
        </div>
      </form>

      <div>
        <h3>Empresas cadastradas</h3>
        <table>
          <thead>
            <tr>
              <th>CNPJ</th>
              <th>Nome da empresa</th>
              <th>Ações</th>
            </tr>
          </thead>
          {/* MAPEANDO UMA LISTA COM OS DADOS VINDO DO BD */}
          {empresas.map((empresa) => {
            return (
              <tbody key={empresa.id}>
                <tr>
                  <td>{empresa.cnpj}</td>
                  <td>{empresa.nome}</td>
                  <td><a href="https://www.youtube.com/channel/UCEZgWavfBlTWV-nmxnvdY_g" target="_blank" rel="noopener noreferrer">Edit</a></td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </>
  );
};
