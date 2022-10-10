// Form component
import Form from "../../components/Form/Form";

// Bootstrap components
import { Table, Button } from "react-bootstrap";

// React and react-router-dom hooks
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// API
import api from "../../services/api/api";

const Home = () => {
	const [companies, setCompanies] = useState([]);

	// Function to get the companies from the API and update the companies in the page
	const getCompanies = async () => {
		const response = await api.get("/companies");
		setCompanies(response.data);
	};

	// Function to delete a company from the API
	const deleteCompany = async (id) => {
		await api.delete(`/companies/${id}`);
		getCompanies();
	};

	// ! This useEffect is responsible for updating the companies in the page, but I think it's not the best way to do it because it's making a request to the API every time :(
	useEffect(() => {
		getCompanies();
	}, [companies]);

	return (
		<>
			<Form legend="Formulário de cadastro" />
			<p className="h4 text-center">Empresas cadastradas</p>
			{companies.length > 0 ? (
				<>
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
									<td>
										<Link to={`/company/${company.id}`}>
											<Button className="w-100" varian="primary">
												Editar
											</Button>
										</Link>
									</td>
									<td>
										<Button className="w-100" variant="danger" onClick={() => deleteCompany(company.id)}>
											Excluir
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</>
			) : (
				<p className="text-center">Nenhuma empresa cadastrada</p>
			)}
		</>
	);
};

export default Home;
