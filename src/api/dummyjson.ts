import { fetchJson } from './client'
import type { ApiComment, ApiUser } from '../types'

interface UsersResponse {
  users: ApiUser[]
  total: number
}

interface CommentsResponse {
  comments: ApiComment[]
  total: number
}

const USER_FIELDS =
  'id,firstName,lastName,email,phone,image,address,company'

export function getUsers(limit = 12, signal?: AbortSignal) {
  return fetchJson<UsersResponse>(
    `/users?limit=${limit}&select=${USER_FIELDS}`,
    signal,
  )
}

export function searchUsers(query: string, signal?: AbortSignal) {
  return fetchJson<UsersResponse>(
    `/users/search?q=${encodeURIComponent(query)}&select=${USER_FIELDS}`,
    signal,
  )
}

/** Each conversation pulls a distinct slice of comments so threads differ per chat. */
export function getComments(conversationId: number, signal?: AbortSignal) {
  const skip = (conversationId % 20) * 10
  return fetchJson<CommentsResponse>(
    `/comments?limit=10&skip=${skip}`,
    signal,
  )
}
