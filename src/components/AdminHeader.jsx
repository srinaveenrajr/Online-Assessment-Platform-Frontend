import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // if stored
    navigate("/login");
  };

  const goHome = () => {
    navigate("/admin/dashboard");
  };

  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center h-[100px] ">
      <h1 className="text-lg font-semibold">Admin Panel</h1>

      <div className="flex gap-3">
        {/* ✅ HOME BUTTON */}
        <button
          onClick={goHome}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          Home
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
