import * as React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { SearchProvider } from "./context/search";
import { CartProvider } from "./context/cart";
import "antd/dist/reset.css";
import { CurrencyProvider } from "./context/CurrencyChange";
import CurrencySelector from "./components/Layout/ChangeCurr";
import { ChakraProvider } from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <AuthProvider>
      <SearchProvider>
        <CurrencyProvider>
          <CartProvider>
            <BrowserRouter>
              {/* <CurrencySelector/> */}
              <App />
            </BrowserRouter>
          </CartProvider>
        </CurrencyProvider>
      </SearchProvider>
    </AuthProvider>
  </ChakraProvider>
);

reportWebVitals();
