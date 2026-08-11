/** User as returned by dummyjson.com/users */
export interface ApiUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  image: string
  address: { city: string; state: string }
  company: { department: string; title: string }
}

/** Comment as returned by dummyjson.com/comments */
export interface ApiComment {
  id: number
  body: string
  postId: number
  user: { id: number; username: string; fullName: string }
}

export interface Conversation {
  id: number
  user: ApiUser
  preview: string
  time: string
  unread: number
}

export interface Message {
  id: number
  text: string
  direction: 'in' | 'out'
  time: string
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error'
