import { Form as FormBs, Button, Row, Col, Alert } from "react-bootstrap";

import { cnpjMask, cepMask, numberMask } from "../../utils/mask/masks";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";

// Bootstrap components

import api from "../../services/api/api";

const Form = ({ legend }) => {
	// State to control the form fields
	const [values, setValues] = useState({ name: "", cnpj: "", cep: "", number: "", neighborhood: "", address: "", city: "", state: "" });

	// Show message for cep error and requests
	const [cepError, setCepError] = useState(false);
	const [message, setMessage] = useState("");
	const [variant, setVariant] = useState("");

	// handleChange function to update the state values
	const handleChange = (event) => {
		const { name, value } = event.target;
		setValues({ ...values, [name]: value });
	};

	// useParams to get the id from the url
	const { id } = useParams();

	// If the id is not null, get the company from the API and update the state values
	useEffect(() => {
		if (id) {
			api.get(`/companies/${id}`).then((response) => {
				setValues({
					name: response.data.name,
					cnpj: response.data.cnpj,
					cep: response.data.cep,
					number: response.data.number,
					neighborhood: response.data.neighborhood,
					address: response.data.address,
					city: response.data.city,
					state: response.data.state,
				});
			});
		}
	}, [id]);

	// useEffect responsible for listening to the cep state and making the request to the 'Via Cep' API to get the address data
	useEffect(() => {
		if (values.cep.length === 9) {
			fetch(`https://viacep.com.br/ws/${values.cep}/json/`)
				.then((response) => response.json())
				.then((data) => {
					if (data.cep === undefined || data.cep === null) {
						setValues({ ...values, address: "", neighborhood: "", city: "", state: "" });
						setCepError(true);
					} else {
						setValues({ ...values, address: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf });
						setCepError(false);
					}
				});
		} else {
			setValues({ ...values, address: "", neighborhood: "", city: "", state: "" });
		}
	}, [values.cep]);

	// useEffect to mask the cnpj and cep fields
	useEffect(() => {
		setValues({ ...values, cnpj: cnpjMask(values.cnpj), cep: cepMask(values.cep) });
	}, [values.cnpj, values.cep]);

	// handleSubmit function to send the form data to the API. If the id is null, it will create a new company, otherwise it will update the company data!
	const handleSubmit = async (event) => {
		event.preventDefault();

		// Validate the form
		if (values.name === "" || values.cnpj === "" || values.cnpj.length != 18 || values.cep === "" || values.cep.length != 9 || values.number === "" || values.address === "" || values.city === "" || values.state === "") {
			setMessage("Preencha todos os campos");
			setVariant("danger");

			setTimeout(() => {
				setMessage("");
			}, 3000);

			return;
		}

		// If id is passed, the form will be updated
		if (id) {
			await api.put(`/companies/${id}`, values);

			setMessage("Empresa atualizada com sucesso");
			setVariant("success");

			// If id is not passed, the form will be posted
		} else {
			await api.post("/companies", values);

			setValues({ name: "", cnpj: "", cep: "", number: "", address: "", neighborhood: "", city: "", state: "" });

			setMessage("Empresa cadastrada com sucesso");
			setVariant("success");
		}

		// Clean the the message after 3 seconds
		setTimeout(() => {
			setMessage("");
		}, 3000);
	};

	const handleDelete = async () => {
		await api.delete(`/companies/${id}`);

		setMessage("Empresa excluída com sucesso");
		setVariant("success");

		// Navigate to the home page
		window.location.href = "/";
	};

	const handleClear = () => {
		setValues({ name: "", cnpj: "", cep: "", number: "", address: "", neighborhood: "", city: "", state: "" });
	};

	return (
		<>
			<FormBs onSubmit={handleSubmit}>
				<fieldset className="border p-4">
					<legend className="text-center">
						<h1 className="h3">{legend}</h1>
					</legend>
					<Row>
						<Col sm={12} lg={6} className="mb-3">
							<FormBs.Group controlId="formName">
								<FormBs.Label>Nome da empresa</FormBs.Label>
								<FormBs.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Digite o nome da empresa" />
							</FormBs.Group>
						</Col>
						<Col sm={12} lg={6} className="mb-3">
							<FormBs.Group controlId="formCnpj">
								<FormBs.Label>CNPJ</FormBs.Label>
								<FormBs.Control type="text" name="cnpj" value={values.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" />
							</FormBs.Group>
						</Col>
					</Row>
					<Row>
						<Col xs={5} lg={5} className="mb-3">
							<FormBs.Group controlId="formCep">
								<FormBs.Label>CEP:</FormBs.Label>
								<FormBs.Control type="text" name="cep" value={values.cep} onChange={handleChange} placeholder="00000-000" />
								{cepError && <FormBs.Text className="text-danger">CEP não encontrado!</FormBs.Text>}
							</FormBs.Group>
						</Col>
						<Col xs={7} lg={7} className="mb-3">
							<FormBs.Group controlId="formAddress">
								<FormBs.Label>Endereço</FormBs.Label>
								<FormBs.Control type="text" name="address" value={values.address} onChange={handleChange} placeholder="Digite o endereço" disabled />
							</FormBs.Group>
						</Col>
					</Row>
					<Row>
						<Col xs={3} className="mb-3">
							<FormBs.Group controlId="formNumber">
								<FormBs.Label>Número</FormBs.Label>
								<FormBs.Control type="text" name="number" value={numberMask(values.number)} onChange={handleChange} placeholder="0" />
							</FormBs.Group>
						</Col>
						<Col xs={9} className="mb-3">
							<FormBs.Group controlId="formNeighbourhood">
								<FormBs.Label>Bairro</FormBs.Label>
								<FormBs.Control type="text" name="neighborhood" value={values.neighborhood} onChange={handleChange} placeholder="Digite o bairro" disabled />
							</FormBs.Group>
						</Col>
					</Row>
					<Row>
						<Col xs={7} className="mb-3">
							<FormBs.Group controlId="formCity">
								<FormBs.Label>Cidade</FormBs.Label>
								<FormBs.Control type="text" name="city" value={values.city} onChange={handleChange} placeholder="Digite a cidade" disabled />
							</FormBs.Group>
						</Col>
						<Col xs={5} className="mb-3">
							<FormBs.Group controlId="formState">
								<FormBs.Label>Estado</FormBs.Label>
								<FormBs.Control type="text" name="state" value={values.state} onChange={handleChange} placeholder="Digite o estado" disabled />
							</FormBs.Group>
						</Col>
					</Row>
					{message && (
						<Alert className="text-center" variant={variant}>
							{message}
						</Alert>
					)}
					<Row>
						{id ? (
							<>
								<Col xs={6} className="mb-3">
									<Button variant="primary" type="submit" className="w-100">
										Salvar alterações
									</Button>
								</Col>
								<Col xs={6} className="mb-3">
									<Button variant="secondary" type="submit" className="w-100" onClick={handleDelete}>
										Excluir
									</Button>
								</Col>
							</>
						) : (
							<>
								<Col className="mb-3">
									<Button variant="primary" type="submit" className="w-100">
										Salvar
									</Button>
								</Col>
								<Col className="mb-3">
									<Button variant="secondary" type="button" className="w-100" onClick={handleClear}>
										Limpar
									</Button>
								</Col>
							</>
						)}
					</Row>
				</fieldset>
			</FormBs>
		</>
	);
};

export default Form;
