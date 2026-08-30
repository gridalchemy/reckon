import { BrowserRouter, Route, Routes } from "react-router-dom"

import AppShell from "@/components/layout/AppShell"
import AboutRoute from "@/routes/about"
import HomeRoute from "@/routes/home"
import LibraryRoute from "@/routes/library"
import ReckoningRoute from "@/routes/reckoning"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomeRoute />} />
          <Route path="library" element={<LibraryRoute />} />
          <Route path="reckoning" element={<ReckoningRoute />} />
          <Route path="about" element={<AboutRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
