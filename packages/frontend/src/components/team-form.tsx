import { useState } from "react";
import { AlertMessage, NewUser } from "shared";
import { useSWRConfig } from 'swr';
import { useWrappedFetch } from "../model/user";
import { Spinner } from "./spinner";
import { PageAlert } from "./page-alert";

const roleList = ['support', 'admin'];

export const TeamForm = () => {
  const [loading, setLoading] = useState(false);
  const wrappedFetch = useWrappedFetch();
  const { mutate } = useSWRConfig();
  const [alertData, setShowAlert] = useState<AlertMessage| null>(null);

  const closeMessage = () => {
    setShowAlert(null);
  }

  const submit = async (e: any) => {
    e.preventDefault();
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries()) as NewUser;
      console.log(data);
      const url = '/api/users';
      const resp = await wrappedFetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!resp.ok) {
        setShowAlert({isError:true,message:resp.statusText});
        return;
      }

      form.reset();
      mutate('/api/users');
    }
    catch (ex: any) {
      console.log(ex);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-gray-900 p-6 w-full flex flex-row flex-wrap justify-center items-center mt-4 gap-4">
      <div className={`absolute inset-0 rounded-md bg-black bg-opacity-50 z-10 flex justify-center items-center ${loading ? 'block' : 'hidden'}`} >
        <Spinner />
      </div>
      <input
        type="email"
        id="email"
        placeholder="Email"
        className="rounded-md bg-gray-700 text-gray-300"
        name="email"
        autoComplete="newemail"
        required
      />
      <input
        type="password"
        id="password"
        placeholder="Password"
        className="rounded-md bg-gray-700 text-gray-300"
        name="password"
        autoComplete="newpassword"
        required
      />
      <select
        id="role"
        className="rounded-md bg-gray-700 text-gray-300"
        required
        name="role"
      >
        <option value="">Select Role</option>
        {roleList.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="py-2 px-4 rounded-md bg-indigo-600 text-gray-100 font-semibold hover:bg-indigo-500"
      >
        Create User
      </button>
      <div className={`absolute inset-0 rounded-md bg-black bg-opacity-70  flex items-center justify-center h-screen ${alertData ? 'block' : 'hidden'}`} >
          <PageAlert alertMessage={alertData}  closeMessage={closeMessage} />
        </div>
    </form>
  );
};
