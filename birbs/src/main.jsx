import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import DiscordRedirect from './DiscordRedirect'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<App/>}></Route>
        <Route path='/discord-redirect' element={<DiscordRedirect/>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
