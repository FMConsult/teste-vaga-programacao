// Using axios to create a new instance of the api service with a base url
import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3001",
});

export default api;
