import { createBrowserRouter } from "react-router";
import { Login } from "./components/Login";
import { StudentDashboard } from "./components/StudentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { ParentDashboard } from "./components/ParentDashboard";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/student",
    Component: StudentDashboard,
  },
  {
    path: "/teacher",
    Component: TeacherDashboard,
  },
  {
    path: "/parent",
    Component: ParentDashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
