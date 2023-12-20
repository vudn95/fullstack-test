import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { SignUp, SignIn, Profile } from "./pages";

const router = createBrowserRouter([
  {
    path: "/auth/signup",
    element: <SignUp />,
  },
  {
    path: "/auth/signin",
    element: <SignIn />,
  },
  {
    path: "/dashboard/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    element: <SignIn />,
    index: true,
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
