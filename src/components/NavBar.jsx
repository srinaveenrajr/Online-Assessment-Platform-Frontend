import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-black text-white p-4 flex justify-between">
      <h1 className="font-bold">Online Assessment</h1>
      <button className="bg-red-600 px-3 py-1 rounded" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
