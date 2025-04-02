import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { GeneralProvider } from './context/GeneralProvider';
import { FiltersProvider } from './assets/Context/FiltersContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <GeneralProvider>
  <Routes>
  <Route path="/*" element={<App />}/>
  </Routes>
    </GeneralProvider>
  </BrowserRouter>,
)
