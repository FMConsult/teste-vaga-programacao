import axios from "axios";
import { useState, useEffect } from "react";

// Bootstrap components
import { Form, Button, Row, Col, Container } from "react-bootstrap";

// Utils functions to mask the input
import { cnpjMask, cepMask, numberMask } from "../../utils/mask/masks";

const RegistrationForm = () => {
	const [values, setValues] = useState({ name: "", cnpj: "", cep: "", number: "", neighborhood: "", address: "", city: "", state: "" });
	const [cepError, setCepError] = useState(false);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setValues({ ...values, [name]: value });
	};

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

	const handleSubmit = (event) => {
		event.preventDefault();

		// Validate the form
		if (values.name === "" || values.cnpj === "" || values.cep === "" || values.number === "" || values.address === "" || values.city === "" || values.state === "") {
			alert("Preencha todos os campos!");
		} else {
			alert("Formulário enviado com sucesso!");
			setValues({ name: "", cnpj: "", cep: "", number: "", address: "", neighborhood: "", city: "", state: "" });
		}

		// Send the form to the API
		axios.post("http://localhost:3001/companies", values).then((response) => {
			console.log(response);
		});
	};

	const handleClear = () => {
		setValues({ name: "", cnpj: "", cep: "", number: "", address: "", neighborhood: "", city: "", state: "" });
	};

	return (
		<Form onSubmit={handleSubmit}>
			<fieldset className="border p-4">
				<legend>Formulário de cadastro de empresas</legend>
				<Row>
					<Col sm={12} lg={6} className="mb-3">
						<Form.Group controlId="formName">
							<Form.Label>Nome da empresa</Form.Label>
							<Form.Control type="text" name="name" value={values.name} onChange={handleChange} placeholder="Digite o nome da empresa" />
						</Form.Group>
					</Col>
					<Col sm={12} lg={6} className="mb-3">
						<Form.Group controlId="formCnpj">
							<Form.Label>CNPJ</Form.Label>
							<Form.Control type="text" name="cnpj" value={cnpjMask(values.cnpj)} onChange={handleChange} placeholder="00.000.000/0000-00" />
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col xs={5} lg={5} className="mb-3">
						<Form.Group controlId="formCep">
							<Form.Label>CEP:</Form.Label>
							<Form.Control type="text" name="cep" value={cepMask(values.cep)} onChange={handleChange} placeholder="00000-000" />
							{cepError && <Form.Text className="text-danger">CEP não encontrado!</Form.Text>}
						</Form.Group>
					</Col>
					<Col xs={7} lg={7} className="mb-3">
						<Form.Group controlId="formAddress">
							<Form.Label>Endereço</Form.Label>
							<Form.Control type="text" name="address" value={values.address} onChange={handleChange} placeholder="Digite o endereço" />
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col xs={3} className="mb-3">
						<Form.Group controlId="formNumber">
							<Form.Label>Número</Form.Label>
							<Form.Control type="text" name="number" value={numberMask(values.number)} onChange={handleChange} placeholder="0" />
						</Form.Group>
					</Col>
					<Col xs={9} className="mb-3">
						<Form.Group controlId="formNeighbourhood">
							<Form.Label>Bairro</Form.Label>
							<Form.Control type="text" name="neighborhood" value={values.neighborhood} onChange={handleChange} placeholder="Digite o bairro" />
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col xs={7} className="mb-3">
						<Form.Group controlId="formCity">
							<Form.Label>Cidade</Form.Label>
							<Form.Control type="text" name="city" value={values.city} onChange={handleChange} placeholder="Digite a cidade" />
						</Form.Group>
					</Col>
					<Col xs={5} className="mb-3">
						<Form.Group controlId="formState">
							<Form.Label>Estado</Form.Label>
							<Form.Control type="text" name="state" value={values.state} onChange={handleChange} placeholder="Digite o estado" />
						</Form.Group>
					</Col>
				</Row>
				<Row>
					<Col xs={6} className="mb-3">
						<Button variant="primary" type="submit" className="w-100">
							Enviar
						</Button>
					</Col>
					<Col xs={6} className="mb-3">
						<Button variant="secondary" type="button" className="w-100" onClick={handleClear}>
							Limpar
						</Button>
					</Col>
				</Row>
			</fieldset>
		</Form>
	);
};

export default RegistrationForm;
