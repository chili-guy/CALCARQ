import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Calculator from './pages/Calculator'
import Layout from './components/Layout'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={
          <Layout>
            <Outlet />
          </Layout>
        }>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
