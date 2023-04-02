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


export type AllTicketsResult = {
  tickets: any[]
  count: number
}

export const Constants = {
  PageSize: 5
};

export const PageSize = () => 5;
