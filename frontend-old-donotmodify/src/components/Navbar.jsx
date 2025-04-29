import { useNavigate } from "react-router-dom";

const Navbar = () => {
let navigate = useNavigate(); 
const routeChange = () =>{ 
  let path = '/login'; 
  navigate(path);
}


    return (
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] z-30 backdrop-blur-md bg-white/10 border border-white/20 rounded-full flex justify-between items-center px-10 py-6 text-white shadow-md">
        {/* Left Corner */}
        <div className="text-3xl font-bold">EATO</div>
  
        {/* Centered Navigation */}
        <nav className="flex gap-6 text-base absolute left-1/2 transform -translate-x-1/2">
          {["Features", "Pricing", "Careers", "Help"].map((item) => (
            <a key={item} href="#" className="hover:text-yellow-400 ">
              {item}
            </a>
          ))}
        </nav>
  
        {/* Right Corner Button */}
        <div>
          <button className="bg-yellow-400 text-black px-4 py-2 rounded-full hover:bg-yellow-500 transition-colors" onClick={routeChange}>
            Sign Up
          </button>
        </div>
      </header>
    );
  };
  
  export default Navbar;
  