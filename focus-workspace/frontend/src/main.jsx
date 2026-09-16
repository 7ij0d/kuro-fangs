import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CatalogFocusWorkspace from './pages/CatalogFocusWorkspace';
import { I18nProvider } from './components/I18nProvider';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{color: 'red', background: 'white', padding: '20px', zIndex: 999999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
          <h1>Fatal Error in React</h1>
          <pre style={{whiteSpace: 'pre-wrap'}}>{this.state.error.message}</pre>
          <pre style={{whiteSpace: 'pre-wrap'}}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = () => (
  <ErrorBoundary>
    <I18nProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<CatalogFocusWorkspace />} />
        </Routes>
      </BrowserRouter>
    </I18nProvider>
  </ErrorBoundary>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
