import { useCallback } from "react";
import { usePocket } from "../../context/pocketBaseContext";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../components/parts/Navbar";

export default function Signup() {
  const { register } = usePocket();
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e: any) => {
      e?.preventDefault();

      const [fullname, email, password] = e?.target;

      fullname.value = fullname?.value?.trim();
      email.value = email?.value?.trim();

      try {
        await register!(fullname.value, email.value, password.value);
        navigate("/signin");
      } catch (error: any) {
        console.log(error.response ? error.response : error);
      }
    },
    [register]
  );

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Navbar />

      <form className="p-2 flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold pt-2 px-1 mt-10">Signup</h2>
        <p className="text-sm pb-2 px-1">Find your dream job.</p>

        <input
          type="text"
          name="name"
          placeholder="Name*"
          className="p-2 bg-slate-300 rounded-md"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email*"
          className="p-2 bg-slate-300 rounded-md"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password*"
          className="p-2 bg-slate-300 rounded-md"
          required
        />

        <div className="w-full flex item-center justify-center mt-2">
          <button
            className="bg-emerald-400 w-full p-2 rounded-md text-white font-bold"
            type="submit"
          >
            SIGN UP
          </button>
        </div>
        <p className="text-sm mt-2">
          <Link to="/signin">Log in</Link> with your account
        </p>
      </form>
    </div>
  );
}
