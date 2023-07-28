import Search from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { usePocket } from "../../context/pocketBaseContext";
import { ExitToApp } from "@mui/icons-material";

export default function Navbar() {
  const { user, logout } = usePocket();
  const navigate = useNavigate();

  async function handleLogout() {
    if (confirm("Are you sure?")) {
      logout!();
      navigate("/signin");
    }
  }

  return (
    <nav className="navbar | text-2xl  p-2 px-4 flex bg-emerald-400 items-center justify-between text-white ">
      <div className="flex items-center">
        <div className="bg-sky-500 p-2 flex items-center justify-center rounded-lg ">
          <Search fontSize="inherit" />
        </div>
        <h1 className="font-mono font-bold p-2 flex items-center">finder</h1>
      </div>
      <div className="">
        {user && (
          <button onClick={handleLogout}>
            <ExitToApp />
          </button>
        )}
      </div>
    </nav>
  );
}
