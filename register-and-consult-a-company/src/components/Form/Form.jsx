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
			setValues({ name: "", cnpj: "", cep: "", number: "", address: "", city: "", state: "" });
		}
	};

	const handleClear = () => {
		setValues({ name: "", cnpj: "", cep: "", number: "", address: "", city: "", state: "" });
	};

	return (
		<form onSubmit={handleSubmit} className="border">
			<fieldset>
				<legend className="border-bottom p-2">Formulário de cadastro de empresas</legend>
				<div className="container d-flex flex-column">
					<div className="row">
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label htmlFor="name">Nome da empresa</label>
								<input type="text" className="form-control" id="name" name="name" value={values.name} onChange={handleChange} />
							</div>
						</div>
						<div className="col-12 col-md-6">
							<div className="form-group">
								<label htmlFor="cnpj">CNPJ</label>
								<input type="text" className="form-control" id="cnpj" name="cnpj" value={cnpjMask(values.cnpj)} onChange={handleChange} placeholder="00.000.000/0000-00" />
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-5">
							<div className="form-group">
								<label htmlFor="cep">CEP</label>
								<input type="text" className="form-control" id="cep" name="cep" value={cepMask(values.cep)} onChange={handleChange} />
							</div>
						</div>
						<div className="col-7">
							<div className="form-group">
								<label htmlFor="address">Endereço</label>
								<input type="text" className="form-control" id="address" name="address" value={values.address} onChange={handleChange} disabled />
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-3">
							<div className="form-group">
								<label htmlFor="number">Número</label>
								<input type="text" className="form-control" id="number" name="number" value={values.number} onChange={handleChange} />
							</div>
						</div>
						<div className="col-6">
							<div className="form-group">
								<label htmlFor="city">Cidade</label>
								<input type="text" className="form-control" id="city" name="city" value={values.city} onChange={handleChange} disabled />
							</div>
						</div>
						<div className="col-3">
							<div className="form-group">
								<label htmlFor="state">Estado</label>
								<input type="text" className="form-control" id="state" name="state" value={values.state} onChange={handleChange} disabled />
							</div>
						</div>
					</div>
					<div>
						<div className="d-flex justify-content-end mt-3 gap-2">
							<button type="button" className="btn btn-secondary mr-5" onClick={handleClear}>
								Cancelar
							</button>
							<button type="submit" className="btn btn-primary">
								Cadastrar
							</button>
						</div>
					</div>
				</div>
			</fieldset>
		</form>
	);
};

export default Form;
