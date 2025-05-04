import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
// import './index.scss';
import App from './App';
import Loader from './components/Loader';
import reportWebVitals from './reportWebVitals';
import { ApiProvider } from './context/ApiContext';
import { BookDetailsProvider } from './context/BookDetailsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ApiProvider> {}
      <BookDetailsProvider>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </BookDetailsProvider>
    </ApiProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
