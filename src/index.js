import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Pages
import AttentionGrabber from './pages/AttentionGrabber';
import ProjectDetails from './pages/ProjectDetails';
import ProjectDetailsMenu from './pages/ProjectDetailsMenu';
import Transition from './pages/Transition';
import ProjectBasics from './pages/ProjectBasics';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AttentionGrabber />,
  },
  {
    path: "basics",
    element: <ProjectBasics />,
  },
  {
    path: "transition",
    element: <Transition />,
  },
  {
    path: "details/menu",
    element: <ProjectDetailsMenu />,
  },
  {
    path: "details/:detailsId",
    element: <ProjectDetails />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    {/* <App /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
