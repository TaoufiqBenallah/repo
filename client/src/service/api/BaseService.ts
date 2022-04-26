import axios, {AxiosPromise, AxiosRequestConfig} from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_API_ENDPOINT;

if (axios.interceptors) {
  const errorHandler = (error: any) => {
    return Promise.reject({...error});
  };

  const successHandler = (response: any) => {
    return response;
  };

  axios.interceptors.response.use(
    (response) => successHandler(response),
    (error) => errorHandler(error),
  );
}

export default class BaseService {
  static get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return axios.get(url, config);
  }

  static post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return axios.post(url, data, config);
  }
}
