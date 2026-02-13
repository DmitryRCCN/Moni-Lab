import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const client = axios.create({ baseURL, withCredentials: true })

export const auth = {
  async login(payload: { email?: string; username?: string; password: string }) {
    try {
      const res = await client.post('/auth/login', payload)
      return res.data
    } catch (error) {
      throw error
    }
  },
  async register(payload: { email: string; username: string; password: string }) {
    try {
      const res = await client.post('/auth/register', payload)
      return res.data
    } catch (error) {
      throw error
    }
  },
  async logout() {
    try {
      await client.post('/auth/logout')
      return true
    } catch {
      return false
    }
  },
}

export const user = {
  async me() {
    const res = await client.get('/usuario/me')
    return res.data
  },
  async update(id: string, body: Record<string, unknown>) {
    const res = await client.put(`/usuario/${id}`, body)
    return res.data
  },
}

export default client
