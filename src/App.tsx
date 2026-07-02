import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { OrdersPage } from "./app/OrdersPage"
import { BreadTypesPage } from "./app/BreadTypesPage"
import { Header } from "./components/Header"
import "./i18n"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<OrdersPage />} />
            <Route path="/bread-types" element={<BreadTypesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
