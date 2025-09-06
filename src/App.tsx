import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

// TODO
// 10 memes random utk splash screen e.g sonic sabar,something demanding word of affirmation
// tab media player and tab add music
// runnin background playing music
// add music input link and cutting timer
// sqlite database for datatabase incase needed

import ExternalPage from "./External";
import Product from "./Product";
import Login from "./Login";
// import TabComponent from "./Vvimanp";
// import SongList from "./SongList";
// import MediaPlayer from "./MediaPlayer";
import Todo from "./Todo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/todos" replace />,
  },
  {
    path: "/external",
    element: <ExternalPage />,
  },
  {
    path: "/products/:category/:productId",
    element: <Product />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/todos",
    element: <Todo />,
  },
  // {
  //   path: "/media",
  //   element: (
  //     <TabComponent
  //       tab1={<SongList />}
  //       tab2={<MediaPlayer />}
  //       tab1Label="Song List"
  //       tab2Label="Player"
  //     />
  //   ),
  // },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
