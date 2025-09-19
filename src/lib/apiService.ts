import axiosInstance from "@/lib/axios";
import type { TEndpoint } from "@/types/superAdmin.types";

class ApiService {
  private withTokenAxios = axiosInstance;

  async callEndpoint(endpoint: TEndpoint, data?: any, config: any = {}) {
    const { method, url } = endpoint;

    try {
      let response: any;
      if (["get", "delete"].includes(method)) {
        response = await this.withTokenAxios[method as "get" | "delete"](
          url,
          config
        );
      } else {
        response = await this.withTokenAxios[
          method as "post" | "patch" | "put"
        ](url, data, config);
      }
      return response.data;
    } catch (error: any) {
      // Enhanced error handling with more context
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      const errorStatus = error.response?.status;

      console.error(`API Error [${method.toUpperCase()} ${url}]:`, {
        status: errorStatus,
        message: errorMessage,
        data: error.response?.data,
      });

      // Re-throw with additional context
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).status = errorStatus;
      (enhancedError as any).originalError = error;
      throw enhancedError;
    }
  }

  // Convenience methods
  async get(endpoint: TEndpoint, config?: any) {
    return this.callEndpoint(endpoint, undefined, config);
  }

  async post(endpoint: TEndpoint, data: any, config?: any) {
    return this.callEndpoint(endpoint, data, config);
  }

  async put(endpoint: TEndpoint, data: any, config?: any) {
    return this.callEndpoint(endpoint, data, config);
  }

  async patch(endpoint: TEndpoint, data?: any, config?: any) {
    return this.callEndpoint(endpoint, data, config);
  }

  async delete(endpoint: TEndpoint, config?: any) {
    return this.callEndpoint(endpoint, undefined, config);
  }
}

// Export a singleton instance
export const apiService = new ApiService();

// Also export the class for potential multiple instances
export default ApiService;
