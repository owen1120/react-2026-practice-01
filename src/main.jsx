import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import "./index.css";

import { Provider } from "react-redux";
import { store } from "./store/store";

import router from "./router";

import ToastMessage from './components/ToastMessage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ToastMessage />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)