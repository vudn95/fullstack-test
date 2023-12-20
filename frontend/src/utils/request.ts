import axios, { AxiosRequestConfig } from "axios";

interface RequestOptions extends AxiosRequestConfig {
  headers?: Record<string, string>;
}

const defaultHeader: Record<string, string> = {
  "Content-Type": "application/json",
};

export const request = (
  opts: RequestOptions = {},
  optsHeader: Record<string, string> = defaultHeader
) => {
  /*
  |--------------------------------------------------
  | Custom axios api
  |--------------------------------------------------
  */

  const defaultOptions: RequestOptions = {
    ...opts,
    headers: {
      ...defaultHeader,
      ...optsHeader,
    },
  };

  return axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    ...defaultOptions,
  });
};

export default request;
