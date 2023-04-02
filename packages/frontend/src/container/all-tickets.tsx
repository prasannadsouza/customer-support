import useSwr from 'swr';

export type Ticket = {
  id: number
  subject: string
  description: string
  assignedTo: string
  createdAt: Date
  updatedAt: Date
  resolved: boolean
  resolution: string
  createdByEmail: string
}

export const TicketList = () => {
    const { data, error, isLoading } = useSwr<Ticket[]>('/api/tickets');
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

    return (
        <table className="table-auto w-full overflow-y-auto">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Item</th>
                  <th>Date</th>
                  <th>Created By</th>
                  <th>Assigned To</th>
                  <th>Resolved</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody >
              {data.map(d => <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.subject}</td>
                      <td>{d.description}</td>
                      <td>{`${d.createdAt}`}</td>
                      <td>{d.createdByEmail}</td>
                      <td>{d.assignedTo}</td>
                      <td>{d.resolved ? "YES" : "NO"}</td>
                               <td>{!d.resolved && (d.assignedTo == "" || !d.assignedTo) ? <div className="p-4 rounded-md bg-slate-700 text-white hover:bg-slate-500">TAKE</div> : null}</td>
                    </tr>)}
            </tbody>
        </table>
    );
};

export const AllTickets = () => {
  return (
    <div className="flex-1 overflow-hidden">
      <TicketList/>
    </div>
  )
};
