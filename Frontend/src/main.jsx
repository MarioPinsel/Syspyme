import ReactDom from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Router from './Router.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";

const queryClient = new QueryClient()

ReactDom.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Router />
      <ReactQueryDevtools />
    </AuthProvider>
  </QueryClientProvider>,
)