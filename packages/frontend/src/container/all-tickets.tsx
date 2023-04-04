import { useContext, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useSwr from 'swr';
import { Spinner } from '../components';
import { LoginContext, useWrappedFetch } from '../model/user';

export type Ticket = {
  id: number
  subject: string
  description: string
  assignedTo: { email: string, id: number }
  createdAt: string
  updatedAt: Date
  resolved: boolean
  resolution: string
  createdByEmail: string
}

export const TicketList = () => {
  const { data, error, isLoading, mutate } = useSwr<Ticket[]>('/api/tickets');
  const [assignLoading, setAssignLoading] = useState(false);
  const wrappedFetch = useWrappedFetch();
  const { token } = useContext(LoginContext);
  const navigate = useNavigate();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);
    return <div>Failed to get tickets</div>
  }

  if (!data) {
    return <div>No Data</div>
  }

  const loading = isLoading || assignLoading;

  const assignToMe = async (id: number) => {
    if (loading) {
      return;
    }

    setAssignLoading(true);
    try {
      const url = `/api/tickets/${id}`;
      const resp = await wrappedFetch(url, {
        method: "PUT"
      });
      if (!resp.ok) {
        return;
      }

      mutate();
    }
    catch (ex: any) {
      console.log(ex);
      return;
    }
    finally {
      setAssignLoading(false);
    }

    navigate(`/support/${id}`);
  }

  const getButtonColor = (active: boolean) => {
    const color = active ? "blue" : "green";
    return `bg-${color}-600 text-gray-100 px-3 py-1 rounded-md hover:bg-${color}-500`;
  }

  const assigned = data?.find(item => item.assignedTo?.id === token?.id && item.resolved === false) ?? false;

  if (assigned) {
    return <Navigate to={`/support/${assigned.id}`} />
  }

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
              <th className="px-4 py-2 text-gray-300 text-left">Item</th>
              <th className="px-4 py-2 text-gray-300 text-left">Created At</th>
              <th className="px-4 py-2 text-gray-300 text-left">Assigned To</th>
              <th className="px-4 py-2 text-gray-300 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data ? data.map((item) => (
              <tr key={item.id} className="bg-gray-700 hover:bg-gray-600">
                <td className="px-4 py-2 text-gray-300">{item.id}</td>
                <td className="px-4 py-2 text-gray-300">{item.subject}</td>
                <td className="px-4 py-2 text-gray-300">{new Date(Date.parse(item.createdAt)).toLocaleString()}</td>
                <td className="px-4 py-2 text-gray-300">{item.assignedTo?.email}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={!!item.assignedTo ? () => assignToMe(item.id) : () => navigate(`/support/${item.id}`)}
                    className={getButtonColor(!!item.assignedTo)}>
                    {!!item.assignedTo ? (item.resolved ? "Done" : "In Progress") : "Handle"}
                  </button>
                </td>
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AllTickets = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <TicketList />
    </div>
  )
};
