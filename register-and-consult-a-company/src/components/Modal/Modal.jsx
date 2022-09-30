import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const Teste = (id) => {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);

	const handleShow = () => setShow(true);

	useEffect(() => {
		console.log(id);
	}, [id]);

	return (
		<Modal show={show}>
			<Modal.Header closeButton>
				<Modal.Title>Modal heading</Modal.Title>
			</Modal.Header>
			<Modal.Body></Modal.Body>
			<Modal.Footer>
				<Button variant="secondary">Cancelar</Button>
				<Button variant="primary">Save Changes</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default Teste;
