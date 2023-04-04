import { useContext, useState } from 'react';
import { FrontendUser } from 'shared';
import useSwr from 'swr';
import { LoginContext, useWrappedFetch } from '../model/user';
import { Spinner } from './spinner';

export const TeamList = () => {
  const { data, error, isLoading, mutate } = useSwr<FrontendUser[]>('/api/users');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { token } = useContext(LoginContext);
  const wrappedFetcher = useWrappedFetch();

  const removeUser = async (id: number) => {
    if (deleteLoading || isLoading) {
      return;
    }

    setDeleteLoading(true);
    try {
      const url = `/api/users/${id}`;
      const resp = await wrappedFetcher(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      if (!resp.ok) {
        return;
      }

      mutate();
    }
    catch (ex: any) {
      console.log(ex);
    }
    finally {
      setDeleteLoading(false);
    }
  };

  const loading = isLoading || deleteLoading;

  if (error) {
    return <div className="text-white">Unable to fetch users</div>
  }

  console.log(data);

  return (
    <div className="w-full max-w-4xl p-4">
      <div className={`absolute inset-0 rounded-md bg-black bg-opacity-50 z-10 flex justify-center items-center ${loading ? 'block' : 'hidden'}`} >
        <Spinner />
      </div>
      <div className="bg-gray-900 rounded-md shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-gray-300 text-left">ID</th>
              <th className="px-4 py-2 text-gray-300 text-left">Email</th>
              <th className="px-4 py-2 text-gray-300 text-left">Role</th>
              <th className="px-4 py-2 text-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data ? data.filter(item => item.id != token?.id).map((item) => (
              <tr key={item.id} className="bg-gray-700 hover:bg-gray-600">
                <td className="px-4 py-2 text-gray-300">{item.id}</td>
                <td className="px-4 py-2 text-gray-300">{item.email}</td>
                <td className="px-4 py-2 text-gray-300">{item.role}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => removeUser(item.id)}
                    className="bg-red-600 text-gray-100 px-3 py-1 rounded-md hover:bg-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
