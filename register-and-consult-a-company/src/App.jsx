// CSS
import "./App.css";

// Bootstrap components
import { Container } from "react-bootstrap";

// React-router-dom
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./pages/Home/Home";
import Company from "./pages/Company/Company";

function App() {
	return (
		<main>
			<Container className="d-flex flex-column gap-5">
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/company/:id" element={<Company />} />
						<Route path="*" element={<Navigate to="/" />} />
					</Routes>
				</BrowserRouter>
			</Container>
		</main>
	);
}

export default App;
