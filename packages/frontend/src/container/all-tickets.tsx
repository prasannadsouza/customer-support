import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AlertMessage, AllTicketsResult } from "shared";
import useSwr from "swr";
import { Spinner } from "../components";
import { Pagination } from "../components/pagination";
import { LoginContext, useWrappedFetch } from "../model/user";
import { PageAlert } from "../components/page-alert";

export type Ticket = {
  id: number;
  subject: string;
  description: string;
  assignedTo: { email: string; id: number };
  createdAt: string;
  updatedAt: Date;
  resolved: boolean;
  resolution: string;
  createdByEmail: string;
};

export const TicketList = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const { data, error, isLoading, mutate } = useSwr<AllTicketsResult>(
    `/api/tickets?pageNo=${pageNumber}`
  );
  const [assignLoading, setAssignLoading] = useState(false);
  const wrappedFetch = useWrappedFetch();
  const { token } = useContext(LoginContext);
  const navigate = useNavigate();
  const [alertData, setShowAlert] = useState<AlertMessage | null>(null);

  const closeMessage = () => {
    setShowAlert(null);
  };

  if (isLoading) {
    return <div className="text-red-100">Loading...</div>;
  }

  if (error) {
    console.log(error);
    return <div className="text-red-100">Failed to get tickets</div>;
  }

  if (!data) {
    return <div>No Data</div>;
  }

  const loading = isLoading || assignLoading;

  const tryAssignTicket = async (item: Ticket) => {
    if (item.assignedTo == null) return await assignToMe(item.id);
    navigate(`/support/${item.id}`);
  };

  const assignToMe = async (id: number) => {
    if (loading) {
      return;
    }

    setAssignLoading(true);
    try {
      const url = `/api/tickets/${id}`;
      const resp = await wrappedFetch(url, {
        method: "PUT",
      });
      if (!resp.ok) {
        setShowAlert({ isError: true, message: resp.statusText });
        return;
      }

      mutate();
    } catch (ex: any) {
      console.log(ex);
      return;
    } finally {
      setAssignLoading(false);
    }

    navigate(`/support/${id}`);
  };

  const getButtonColor = (active: boolean) => {
    const color = active ? "blue" : "green";
    return `bg-${color}-600 text-gray-100 px-3 py-1 rounded-md hover:bg-${color}-500`;
  };

  const assigned =
    data?.tickets.find(
      (item) => item.assignedTo?.id === token?.id && item.resolved === false
    ) ?? false;

  if (assigned) {
    return <Navigate to={`/support/${assigned.id}`} />;
  }

  return (
    <div className="w-full max-w-4xl p-4">
      <div
        className={`absolute inset-0 rounded-md bg-black bg-opacity-50 z-10 flex justify-center items-center ${
          loading ? "block" : "hidden"
        }`}
      >
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
            {data
              ? data.tickets.map((item) => (
                  <tr key={item.id} className="bg-gray-700 hover:bg-gray-600">
                    <td className="px-4 py-2 text-gray-300">{item.id}</td>
                    <td className="px-4 py-2 text-gray-300">{item.subject}</td>
                    <td className="px-4 py-2 text-gray-300">
                      {new Date(Date.parse(item.createdAt)).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-gray-300">
                      {item.assignedTo?.email}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => tryAssignTicket(item)}
                        className={getButtonColor(!!item.assignedTo)}
                      >
                        {!!item.assignedTo
                          ? item.resolved
                            ? "Done"
                            : "In Progress"
                          : "Handle"}
                      </button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
      <Pagination
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        count={data?.count}
      />
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

export const AllTickets = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <TicketList />
    </div>
  );
};
