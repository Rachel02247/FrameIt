
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './router'
import { Provider } from 'react-redux'
import store from './global-states/store'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import createTheme from '@mui/material/styles/createTheme'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#666699',
      // '#e60060', 
    },
    secondary: {
      main: '#a3a3c2', 
      // main: '#f088b6', 
    }
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
