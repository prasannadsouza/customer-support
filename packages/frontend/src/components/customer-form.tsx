import { useState } from "react";

type SuccessResponse = {
  id: number
};

const itemList = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

export const CustomerForm = () => {
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState<number | null>(null);

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
      const data = Object.fromEntries(formData.entries());
      console.log(data);
      const url = '/api/tickets';
      const resp = await fetch(url, {
        method: "POST",
        headers: {

          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const val = await resp.json() as SuccessResponse;
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
    <form
      onSubmit={() => {}}
      className="bg-gray-900 p-6 w-full max-w-lg rounded-md space-y-4"
    >
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
    </form>
  );
};