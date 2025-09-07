import axios from 'axios';

// Create a RestTemplate-like service for making HTTP requests
class RestTemplate {
  private baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  async get<T>(url: string, headers?: Record<string, string>): Promise<{ data: T }> {
    const response = await axios.get<T>(this.baseURL + url, { headers });
    return { data: response.data };
  }

  async post<T, R>(url: string, data: T, headers?: Record<string, string>): Promise<{ data: R }> {
    const response = await axios.post<R>(this.baseURL + url, data, { headers });
    return { data: response.data };
  }

  async put<T, R>(url: string, data: T, headers?: Record<string, string>): Promise<{ data: R }> {
    const response = await axios.put<R>(this.baseURL + url, data, { headers });
    return { data: response.data };
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<{ data: T }> {
    const response = await axios.delete<T>(this.baseURL + url, { headers });
    return { data: response.data };
  }

  async patch<T, R>(url: string, data: T, headers?: Record<string, string>): Promise<{ data: R }> {
    const response = await axios.patch<R>(this.baseURL + url, data, { headers });
    return { data: response.data };
  }

  // Method to exchange with different HTTP methods
  async exchange<T, R>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    entity: { data?: T; headers?: Record<string, string> },
    responseType?: any
  ): Promise<{ data: R }> {
    const config = {
      headers: entity.headers,
    };

    let response;
    switch (method) {
      case 'GET':
        response = await axios.get<R>(this.baseURL + url, config);
        break;
      case 'POST':
        response = await axios.post<R>(this.baseURL + url, entity.data, config);
        break;
      case 'PUT':
        response = await axios.put<R>(this.baseURL + url, entity.data, config);
        break;
      case 'DELETE':
        response = await axios.delete<R>(this.baseURL + url, config);
        break;
      case 'PATCH':
        response = await axios.patch<R>(this.baseURL + url, entity.data, config);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return { data: response.data };
  }
}

export default RestTemplate;
