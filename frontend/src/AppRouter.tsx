import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthRoute from "./AuthRoute";
import { SignUp, SignIn, Profile } from "./pages";

const router = createBrowserRouter([
  {
    path: "/auth/signup",
    element: (
      <AuthRoute>
        <SignUp />
      </AuthRoute>
    ),
  },
  {
    path: "/auth/signin",
    element: (
      <AuthRoute>
        <SignIn />
      </AuthRoute>
    ),
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
