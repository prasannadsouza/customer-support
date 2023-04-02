export type CreateTicket = {
  subject: string
  description: string
  createdByEmail: string
};

export type CreateTicketSucces = {
  id: number
};

export type ResolveTicket = {
  resolution: string
};
