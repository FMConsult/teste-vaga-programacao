import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CadastroStorage } from "./context/use-cadastro-context";
import { Cadastro } from "./pages/cadastro/Cadastro";
import { UpdateCadastro } from "./pages/update/Update";
import { GlobalStyle } from "./styles/global";

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <CadastroStorage>
          <Routes>
            <Route path="/" element={<Cadastro />} />
            <Route path="/:id" element={<UpdateCadastro/>} />
          </Routes>
        </CadastroStorage>
      </BrowserRouter>
    </>
  );
}

export default App;
