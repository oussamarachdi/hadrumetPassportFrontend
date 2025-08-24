import useAdminLogin from "@/hooks/useAdminLogin";

const AdminLogin = () => {
  const { error, loading, handleSubmit, setUsername, setPassword } = useAdminLogin();
  return (
    <div className="h-screen flex flex-col mx-6 items-center justify-center">
      <div className="w-full max-w-md bg-white px-6 py-4 rounded-2xl shadow-xl flex flex-col ">
        <div className="flex items-center justify-center  mb-4">
          <h1 className="text-2xl font-bold text-blue-950 text-center">
            Admin Login
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="px-4 py-2 rounded-lg border-2 border-blue-950 text-black"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded-lg border-2 border-blue-950 text-black"
            required
          />
          <button
            type="submit"
            className="bg-blue-950 text-white py-2 rounded-lg font-semibold tracking-wide"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 