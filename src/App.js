import "./App.css";
import { theme } from "./components/chakraUi/theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomeSection/HomePage";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "./pages/HeaderSection/Navbar";
import { RecoilRoot } from "recoil";
import Slides from "./pages/SlidesSection/Slides";
import { Provider } from "react-redux";
import store from "./components/ReduxStore/Store";
import ViewSlides from "./pages/SlidesSection/ViewSlides";

function App() {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/presentation/:UserId/create/:id" element={<Slides />} />
              <Route path="/presentation/view" element={<ViewSlides />} />
            </Routes>
          </Router>
        </Provider>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;