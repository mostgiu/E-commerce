import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css'
import TokenContextProvider from './components/Context/TokenContext.jsx'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CartContextProvider from './components/Context/CartContext.jsx'
import 'flowbite/dist/flowbite.css';
import { Provider } from 'react-redux'
import { store } from './components/Redux/store.js'
createRoot(document.getElementById('root')).render(
  <TokenContextProvider>
    <Provider store={store}>
    <CartContextProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </CartContextProvider>
  </Provider>
  </TokenContextProvider>
)
 