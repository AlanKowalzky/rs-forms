import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store';
import MainPage from './components/pages/MainPage';
// Usuwamy importy formularzy, ponieważ będą renderowane w modalach
// import UncontrolledForm from './components/pages/UncontrolledForm';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          {/* Usuwamy Route dla formularzy */}
          {/* <Route path="/uncontrolled-form" element={<UncontrolledForm />} /> */}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
