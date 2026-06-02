import axios, { AxiosRequestConfig } from 'axios'

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type ServiceParams = AxiosRequestConfig & { method: HttpMethod }

// Minimal wrapper to match the patterns in help.md. For this demo the service
// just forwards to axios. In a real app replace baseURL and add interceptors.
export default async function service(cfg: ServiceParams) {
  const axiosCfg: AxiosRequestConfig = {
    method: cfg.method,
    url: cfg.url,
    params: cfg.params,
    data: cfg.data,
  }
  if ('cancelToken' in cfg) {
    axiosCfg.cancelToken = cfg.cancelToken
  }
  const resp = await axios(axiosCfg)
  return resp
}

export { axios }
