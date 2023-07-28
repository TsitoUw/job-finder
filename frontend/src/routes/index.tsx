import { lazy, startTransition } from "react";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/container/ProtectedRoute";

const Home = lazy(() => import("../views/home/Home"));
const Search = lazy(() => import("../views/search/SearchView"));
const CompanyView = lazy(() => import("../views/company/CompanyView"));
const JobView = lazy(() => import("../views/job/JobView"));
const Signup = lazy(() => import("../views/signup/Signup"));
const Signin = lazy(() => import("../views/signin/Signin"));

startTransition;
export default createBrowserRouter([
  {
    path: "",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        path: "",
        element: <Home />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: ":company_slug",
        element: <CompanyView />,
      },
      {
        path: ":company_slug/:job_id",
        element: <JobView />,
      },
    ],
  },
  {
    path: "signin",
    element: <ProtectedRoute reversed={true} />,
    children: [
      {
        index: true,
        path: "",
        element: <Signin />,
      },
    ],
  },
  {
    path: "signup",
    element: <ProtectedRoute reversed={true} />,
    children: [
      {
        index: true,
        path: "",
        element: <Signup />,
      },
    ],
  },
]);
