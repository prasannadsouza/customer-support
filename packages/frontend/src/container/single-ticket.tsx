import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertMessage, ResolveTicket } from "shared";
import useSwr, { useSWRConfig } from 'swr';
import { Spinner } from "../components";
import { LoginContext, useWrappedFetch } from "../model/user";
import { Ticket } from "./all-tickets";
import { PageAlert } from "../components/page-alert";

export const SingleTicket = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { data, error, isLoading } = useSwr<Ticket>(`/api/tickets/${id}`);
  const { mutate } = useSWRConfig();
  const { token } = useContext(LoginContext);
  const wrappedFetch = useWrappedFetch();
  const navigate = useNavigate();
  const [alertData, setShowAlert] = useState<AlertMessage | null>(null);

  const closeMessage = () => {
    setShowAlert(null);
  };

  if (isLoading) {
    return <div className='text-red-100'>Loading</div>
  }

  if (error) {
    console.log(error);
    return <div className='text-red-100'>{error.message}</div>
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (loading || isLoading) {
      return;
    }

    setLoading(true);
    try {
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries()) as ResolveTicket;
      console.log(data);
      const url = `/api/tickets/${id}/resolve`;
      const resp = await wrappedFetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!resp.ok) {
        setShowAlert({ isError: true, message: resp.statusText });
        return;
      }
    }
    catch (ex: any) {
      console.log(ex);
    }
    finally {
      setLoading(false);
    }
    mutate('/api/tickets', [], { revalidate: true });
    navigate('/support');
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="relative bg-gray-900 p-6 w-full max-w-lg rounded-md space-y-4"
      >
        <div className={`absolute inset-0 rounded-md bg-black bg-opacity-50 z-10 flex justify-center items-center ${loading ? 'block' : 'hidden'}`} >
          <Spinner />
        </div>
        <div>
          <label className="block text-gray-600 mb-2" htmlFor="itemList">
            Item Name
          </label>
          <input
            disabled
            className="w-full p-2 rounded-md bg-gray-800 text-gray-500"
            value={data?.subject}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-2" htmlFor="email">
            Created At
          </label>
          <input
            disabled
            className="w-full p-2 rounded-md bg-gray-800 text-gray-500"
            value={new Date(Date.parse(data?.createdAt ?? "")).toLocaleString()}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            disabled
            className="w-full p-2 rounded-md bg-gray-800 text-gray-500"
            value={data?.createdByEmail}
          />
        </div>
        <div>
          <label className="block text-gray-600 mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className="w-full p-2 rounded-md bg-gray-800 text-gray-500"
            disabled
            value={data?.description}
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-300 mb-2" htmlFor="message">
            Resolution
          </label>
          {data?.resolved || data?.assignedTo?.id != token?.id ? <textarea
            id="message"
            className="w-full p-2 rounded-md bg-gray-700 text-gray-300 h-32"
            name="resolution"
            disabled
            value={data?.resolution}
          ></textarea> : <textarea
            id="message"
            className="w-full p-2 rounded-md bg-gray-700 text-gray-300 h-32"
            name="resolution"
          ></textarea>}
        </div>
        {data?.assignedTo === null || data?.resolved ? null : <button
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-green-600 text-gray-100 font-semibold hover:bg-green-500"
          disabled={data?.assignedTo?.id != token?.id}
        >
          {data?.assignedTo?.id == token?.id ? "Resolve" : `Assigned to ${data?.assignedTo?.email}`}
        </button>}

      </form>
      <div
        className={`absolute inset-0 rounded-md bg-black bg-opacity-70  flex items-center justify-center h-screen ${
          alertData ? "block" : "hidden"
        }`}
      >
        <PageAlert alertMessage={alertData} closeMessage={closeMessage} />
      </div>
    </div>
  );
};
