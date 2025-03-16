
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './router'
import { Provider } from 'react-redux'
import store from './component/global-states/store'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import createTheme from '@mui/material/styles/createTheme'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1D1D1B', // צבע ראשי
    },
    secondary: {
      main: '#35a8e0', // צבע משני
    },
    warning: {
      main: '#f29100', // צבע משני
    },
    success: {
      main: '#93c01f', // צבע משני
    },
   
    
  },
});
function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>

    </>
  )
}

export default App
