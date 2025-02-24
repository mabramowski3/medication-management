
import './App.css'
import MedicationManager from './components/medication-manager/medication-manager'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <MedicationManager/>
    </QueryClientProvider>
  )
}

export default App
