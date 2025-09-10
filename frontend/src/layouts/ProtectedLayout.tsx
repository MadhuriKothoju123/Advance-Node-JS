import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function ProtectedLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
