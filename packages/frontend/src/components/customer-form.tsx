import { useState } from "react";

type SuccessResponse = {
  id: number
};

export const CustomerForm = () => {
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState<number|null>(null);

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
        <form className="w-full max-w-lg" onSubmit={submit}>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                        Item Name
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="subject" type="text" required/>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                        E-mail
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" name="createdByEmail" type="email" required/>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                        Message
                    </label>
                    <textarea className=" no-resize appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-48 resize-none" id="message" name="description" required></textarea>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <button className="shadow bg-teal-400 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                        Send
                    </button>
              <div className="">{lastId ? `Your ticket number is ${lastId}` : ""}</div>
            </div>
        </form>
    );
};
