import {BrowserRouter, Routes, Route} from "react-router-dom"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import ResetPasswordRequest from "./pages/ResetPassword"
import ResetPasswordForm from "./components/ResetPasswordForm"
import Navbar from "./components/Navbar"
const App = () => {
  return (
    <>
    
    <BrowserRouter>
    <Navbar/>
    <Routes>

      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/reset-password" element={<ResetPasswordRequest/>}/>
      <Route path="/reset-password/:resetToken" element={<ResetPasswordForm/>}/>
      <Route path="/dashboard" element={<Dashboard/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App