import Footer from "@/app/components/home-components/Footer";
import Login from "@/app/components/login-components/login";
import Navbar from "@/app/components/login-components/navbar";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Login />
      <Footer />
    </div>
  );
};

export default LoginPage;
