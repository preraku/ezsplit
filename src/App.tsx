import { AppProvider } from './context/AppContext'
import { StepWizard } from './components/layout/StepWizard'

function App() {
  return (
    <AppProvider>
      <div className="max-w-md mx-auto min-h-screen">
        <StepWizard />
      </div>
    </AppProvider>
  )
}

export default App
