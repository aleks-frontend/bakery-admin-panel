import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { OrdersPage } from "./app/OrdersPage"

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
      <OrdersPage />
    </QueryClientProvider>
  )
}

export default App
