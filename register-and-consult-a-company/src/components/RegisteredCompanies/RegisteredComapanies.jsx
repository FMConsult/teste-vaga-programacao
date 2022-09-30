import { Table, Button, Modal } from "react-bootstrap";

import axios from "axios";
import { useEffect, useState } from "react";

const RegisteredComapanies = () => {
	const [companies, setCompanies] = useState([]);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	useEffect(() => {
		const getCompanies = async () => {
			const response = await axios.get("http://localhost:3001/companies");
			setCompanies(response.data);
		};
		getCompanies();
	}, [companies]);

	return (
		<>
			{companies.length > 0 ? (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Nome</th>
							<th>CNPJ</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{companies.map((company) => (
							<tr key={company.id}>
								<td>{company.name}</td>
								<td>{company.cnpj}</td>
								{/* Botão de abrir modal */}
								<td>
									<Button variant="primary" onClick={handleShow}>
										Launch static backdrop modal
									</Button>
								</td>

								<td>
									<button
										className="btn btn-danger"
										onClick={() => {
											axios.delete(`http://localhost:3001/companies/${company.id}`).then(() => {
												axios.get("http://localhost:3001/companies").then((response) => {
													setCompanies(response.data);
												});
											});
										}}
									>
										Excluir
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			) : (
				<p>Nenhuma empresa cadastrada</p>
			)}
			<Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
				<Modal.Header closeButton>
					<Modal.Title>Modal title</Modal.Title>
				</Modal.Header>
				<Modal.Body>I will not close if you click outside me. Don't even try to press escape key.</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default RegisteredComapanies;
