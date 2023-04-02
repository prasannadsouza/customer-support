import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Token } from "shared";
import { Spinner } from "../components";
import { LoginContext } from "../model/user";

type UserLoginInfo = {
  email: string
  password: string
}

export const LoginPage = () => {
  const authContext = useContext(LoginContext);
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries()) as UserLoginInfo;
      console.log(data);
      const url = '/api/auth/login';
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!resp.ok) {
        return
      }

      const val = await resp.json() as Token;
      form.reset();
      authContext.setCurrentToken(val);
    }
    catch (ex: any) {
      console.log(ex);
    }
    finally {
      setLoading(false);
    }
  }

  if (authContext.token) {
    return <Navigate to="/support" replace={true} />
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <Link to="/" className="absolute top-10 right-10 bg-slate-700 p-4 rounded-md text-white hover:bg-slate-500 cursor-pointer">Home</Link>
      <form
        onSubmit={submit}
        className="bg-gray-900 p-6 w-full max-w-md rounded-md space-y-4"
      >
        <div className={`absolute inset-0 rounded-md bg-black bg-opacity-50 z-10 flex justify-center items-center ${loading ? 'block' : 'hidden'}`} >
          <Spinner />
        </div>
        <div>
          <label className="block text-gray-300 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full p-2 rounded-md bg-gray-700 text-gray-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full p-2 rounded-md bg-gray-700 text-gray-300"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-indigo-600 text-gray-100 font-semibold hover:bg-indigo-500"
        >
          Login
        </button>
      </form>
    </div>
  );
}
