export type Token = {
  access_token: string
  role: string
  id: number
}


export type NewUser = {
  email: string
  password: string
  role: string
};


export type FrontendUser = {
  email: string
  role: string
  id: number
};
