import { BrowserRouter, Route, Routes } from "react-router-dom"

import AppShell from "@/components/layout/AppShell"
import AboutRoute from "@/routes/about"
import HomeRoute from "@/routes/home"
import LibraryRoute from "@/routes/library"
import ReckoningRoute from "@/routes/reckoning"

// DEV-only IndexedDB readback surface (Session 8a). The static import stays
// tree-shakable via the `import.meta.env.DEV` guard below — Vite strips the
// dead branch and its transitive dependencies from production builds. Both
// the route and this import get deleted in Session 9.
import DevDbRoute from "@/routes/dev-db"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomeRoute />} />
          <Route path="library" element={<LibraryRoute />} />
          <Route path="reckoning" element={<ReckoningRoute />} />
          <Route path="about" element={<AboutRoute />} />
          {import.meta.env.DEV ? (
            <Route path="dev/db" element={<DevDbRoute />} />
          ) : null}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
