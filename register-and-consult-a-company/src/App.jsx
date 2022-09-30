import { Container, Row, Col } from "react-bootstrap";
import "./App.css";
import RegisteredComapanies from "./components/RegisteredCompanies/RegisteredComapanies";

// Compoenent Form
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import Teste from "./components/Modal/Modal";

function App() {
	return (
		<main>
			<Container className="d-flex flex-column gap-5">
				<RegistrationForm />
				<RegisteredComapanies />
			</Container>
		</main>
	);
}

export default App;
