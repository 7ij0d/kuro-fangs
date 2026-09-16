import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CatalogFocusWorkspace from './pages/CatalogFocusWorkspace';
import { I18nProvider } from './components/I18nProvider';

const App = () => (
  <I18nProvider>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<CatalogFocusWorkspace />} />
      </Routes>
    </BrowserRouter>
  </I18nProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
