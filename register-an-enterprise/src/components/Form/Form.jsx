import { useState, useEffect } from "react";

// Utils functions to mask the input
import { cnpjMask, cepMask, numberMask } from "../../utils/mask/masks";

// CSS
import styles from "./Form.module.css";

const Form = () => {
	const [values, setValues] = useState({ name: "", cnpj: "", cep: "", number: "", address: "", city: "", state: "" });

	const handleChange = (event) => {
		const { name, value } = event.target;
		setValues({ ...values, [name]: value });
	};

	useEffect(() => {
		// Mask the input
		values.cnpj = cnpjMask(values.cnpj);
		values.cep = cepMask(values.cep);
		values.number = numberMask(values.number);
	}, [values]);

	useEffect(() => {
		if (values.cep.length === 9) {
			fetch(`https://viacep.com.br/ws/${values.cep}/json/`)
				.then((response) => response.json())
				.then((data) => {
					if (data.cep === undefined) {
						setValues({ ...values, address: "", neighborhood: "", city: "", state: "" });
					} else {
						setValues({ ...values, address: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf });
					}
				});
		} else {
			setValues({ ...values, address: "", neighborhood: "", city: "", state: "" });
		}
	}, [values.cep]);

	const handleSubmit = (event) => {
		event.preventDefault();

		// Validate the form
		if (values.name === "" || values.cnpj === "" || values.cep === "" || values.number === "" || values.address === "" || values.city === "" || values.state === "") {
			alert("Preencha todos os campos!");
		} else {
			alert("Formulário enviado com sucesso!");
		}

		// Clear the form
		setValues({ name: "", cnpj: "", cep: "", number: "", address: "", city: "", state: "" });
	};

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<fieldset>
				<legend>Formulário de cadastro de empresas</legend>
				<div className={styles.container}>
					<div className={styles.row}>
						<div className={styles.column}>
							<label htmlFor="name">Nome da empresa:</label>
							<input type="text" name="name" id="name" value={values.name} onChange={handleChange} />
						</div>
						<div className={styles.column}>
							<label htmlFor="cnpj">CNPJ:</label>
							<input type="text" name="cnpj" id="cnpj" value={cnpjMark(values.cnpj)} onChange={handleChange} />
						</div>
					</div>
				</div>
				{/*
				<div className={styles.container}>
					<div className={styles.row}>
						<div className={styles.formGroup}>
							<label htmlFor="name">Nome da empresa</label>
							<input type="text" name="name" id="name" value={values.name} onChange={handleChange} />
						</div>
						<div className={styles.formGroup}>
							<label htmlFor="cnpj">CNPJ</label>
							<input type="text" name="cnpj" id="cnpj" value={cnpjMask(values.cnpj)} onChange={handleChange} placeholder="00.000.000/0000-00" />
						</div>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="cep">CEP</label>
						<input type="text" name="cep" id="cep" value={cepMask(values.cep)} onChange={handleChange} />
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="address">Endereço</label>
						<input type="text" name="address" id="address" value={values.address} onChange={handleChange} readOnly />
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="number">Número</label>
						<input type="text" name="number" id="number" value={numberMask(values.number)} onChange={handleChange} />
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="neighborhood">Bairro</label>
						<input type="text" name="neighborhood" id="neighborhood" value={values.neighborhood} onChange={handleChange} readOnly />
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="city">Cidade</label>
						<input type="text" name="city" id="city" value={values.city} onChange={handleChange} readOnly />
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="state">Estado</label>
						<input type="text" name="state" id="state" value={values.state} onChange={handleChange} readOnly />
					</div>
					<div className={styles.formGroup}>
						<button type="submit">Cadastrar</button>
					</div>
				</div>
    */}
			</fieldset>
			<button>Enviar</button>
		</form>
	);
};

export default Form;
