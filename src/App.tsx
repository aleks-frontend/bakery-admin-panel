import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { OrdersPage } from "./app/OrdersPage"
import { Header } from "./components/Header"

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
      <div className="min-h-screen">
        <Header />
        <OrdersPage />
      </div>
    </QueryClientProvider>
  )
}

export default App
