import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import Weather from './components/Weather';
import Home from './pages/home/Home';
import Favorites from './pages/Favorites';
import RootLayout from './components/rootLayout/RootLayout'
import Error from './pages/Error';


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "/favorites", element: <Favorites /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
