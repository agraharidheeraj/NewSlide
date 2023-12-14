import "./App.css";
import { theme } from "./components/chakraUi/theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomeSection/HomePage";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import Slides from "./pages/SlidesSection/Slides";
import { Provider } from "react-redux";
import store from "./components/ReduxStore/Store";
import ViewSlides from "./pages/SlidesSection/ViewSlides";
import SlideShow from "./pages/SlidesSection/SlideShow";

function App() {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/presentation/:UserId/create/:id"
                element={<Slides />}
              />
              <Route path="/presentation/view" element={<ViewSlides />} />
              <Route
                path="/presentation/:UserId/slideshow"
                element={<SlideShow />}
              />
            </Routes>
          </Router>
        </Provider>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
