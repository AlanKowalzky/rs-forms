import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { store } from './store';
import MainPage from './components/pages/MainPage';
import UncontrolledForm from './components/pages/UncontrolledForm';
import ReactHookFormPage from './components/pages/ReactHookForm';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/uncontrolled-form" element={<UncontrolledForm />} />
          <Route path="/react-hook-form" element={<ReactHookFormPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;