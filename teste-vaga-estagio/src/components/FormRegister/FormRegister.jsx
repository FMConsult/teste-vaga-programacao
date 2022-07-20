import React from "react";
import "./index.css";

export const FormRegister = () => {
    
  const CadastrarEmpresa = (event) => {
    event.preventDefault();
    console.log("Cadastrado com sucesso!!!!");
  };

  const ResetDefaultField = () =>{

  }

  return (
    <form onSubmit={CadastrarEmpresa}>
      <label htmlFor="empresaCnpj">CNPJ:</label>
      <input
        type="number"
        id="empresaCnpj"
        name="empresaCnpj"
        placeholder="Digite seu CNPJ ..."
      />

      <label htmlFor="empresaNome">Nome da Empresa:</label>
      <input
        type="text"
        id="empresaNome"
        name="empresaNome"
        placeholder="Nome da empresa ..."
      />

      <label htmlFor="cepCidade">CEP:</label>
      <input
        type="number"
        id="cepCidade"
        name="cepCidade"
        placeholder="Cep da cidade ..."
      />

      <label htmlFor="empresaEndereco">Endereço:</label>
      <input
        type="text"
        id="empresaEndereco"
        name="empresaEndereco"
        placeholder="Endereço da empresa ..."
      />

      <label htmlFor="empresaNumero">Número:</label>
      <input
        type="number"
        id="empresaNumero"
        name="empresaNumero"
        placeholder="Número do local ..."
      />

      <label htmlFor="empresaBairro">Bairro:</label>
      <input
        type="text"
        id="empresaBairro"
        name="empresaBairro"
        placeholder="Bairro ..."
      />

      <label htmlFor="unidadeFederativa">UF:</label>
      <input
        type="number"
        id="unidadeFederativa"
        name="unidadeFederativa"
        placeholder="UF ..."
      />

      <label htmlFor="cidade">Cidade:</label>
      <input
        type="text"
        id="cidade"
        name="cidade"
        placeholder="Cidade ..."
      />

      <button type="reset" onClick={ResetDefaultField}>Resetar campos</button>
      <button type="submit">Cadastrar empresa</button>
    </form>
  );
};
