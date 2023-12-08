import './App.css';
import { theme } from "./components/chakraUi/theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from './pages/HomeSection/HomePage';
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from './pages/HeaderSection/Navbar';
import { RecoilRoot } from 'recoil';
import CreateSlides from './pages/SlidesSection/Slides';

function App() {
  return (
    <RecoilRoot>
    <ChakraProvider theme={theme}>
    <Router>
       <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/presentation/:UserId" element={<CreateSlides/>} />
      </Routes>
    </Router>
  </ChakraProvider>
  </RecoilRoot>
  );
}

export default App;
