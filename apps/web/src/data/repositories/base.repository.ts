import axios, { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export abstract class BaseRepository {
  protected readonly http: AxiosInstance = api;
}
