import { Suspense } from "react"
import { Footer } from "@/components/ui/Footer"
import { Navbar } from "@/components/ui/Navbar"
import { NavigationMenu } from "@/components/ui/NavigationMenu"
import { Route, Routes } from "react-router-dom"
import { routes } from "./routes"

export const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <NavigationMenu />
      <Suspense fallback={<p role='status'>Loading…</p>}>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </Suspense>
      <Footer />
    </>
  )
}

export default AppRoutes
