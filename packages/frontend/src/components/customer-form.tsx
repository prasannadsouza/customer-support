import { useState } from "react";
import { AlertMessage, CreateTicket, CreateTicketSucces } from "shared";
import { Spinner } from "./spinner";
import { PageAlert } from "./page-alert";

const itemList = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

export const CustomerForm = () => {
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState<number | null>(null);
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
    setLastId(null);
    try {
      const form = e.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries()) as CreateTicket;
      console.log(data);
      const url = '/api/tickets';
      const resp = await fetch(url, {
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

      const val = await resp.json() as CreateTicketSucces;
      console.log(val);
      form.reset();
      setLastId(val.id);
    }
    catch (ex: any) {
      console.log(ex);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={submit}
        className="relative bg-gray-900 p-6 w-full max-w-lg rounded-md space-y-4"
      >
        <div className={`absolute inset-0 rounded-md bg-black bg-opacity-50 z-10 flex justify-center items-center ${loading ? 'block' : 'hidden'}`} >
          <Spinner />
        </div>
        <div>
          <label className="block text-gray-300 mb-2" htmlFor="itemList">
            Item List
          </label>
          <select
            id="itemList"
            className="w-full p-2 rounded-md bg-gray-700 text-gray-300"
            required
            name="subject"
          >
            <option value="">Select an item</option>
            {itemList.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-300 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="createdByEmail"
            className="w-full p-2 rounded-md bg-gray-700 text-gray-300"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            className="w-full p-2 rounded-md bg-gray-700 text-gray-300 h-32"
            required
            name="description"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md bg-indigo-600 text-gray-100 font-semibold hover:bg-indigo-500"
        >
          Send
        </button>
        {lastId ? <div className="w-full py-2 px-4 text-white">Your ticket number: {lastId}</div> : null}
        <div className={`absolute inset-0 rounded-md bg-black bg-opacity-70  flex items-center justify-center h-screen ${alertData ? 'block' : 'hidden'}`} >
          <PageAlert alertMessage={alertData}  closeMessage={closeMessage} />
        </div>
      </form>
    </>
  );
};
