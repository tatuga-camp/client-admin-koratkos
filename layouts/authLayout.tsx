import { ReactNode } from "react";
import Footer from "../components/footers/Footer";
import Navbar from "../components/navbars/Navbar";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default AuthLayout;
