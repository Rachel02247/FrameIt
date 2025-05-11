
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { router } from './router'
import { Provider } from 'react-redux'
import store from './component/global-states/store'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import theme from './theme'

// export const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#666699',
//     },
//     secondary: {
//       main: '#a3a3c2', 
//     }
//   },
// });
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
