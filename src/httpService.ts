import axios, { AxiosRequestConfig } from "axios";

export async function retriableHttpRequest(
  options: AxiosRequestConfig,
  maxRetries = 5,
  doubleTimeoutOnRetry = true
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let retries = 0;
    let success = false;

    while (retries < maxRetries && !success) {
      try {
        let timeoutMs = options.timeout ? options.timeout : 1000;
        timeoutMs = doubleTimeoutOnRetry
          ? timeoutMs * (retries + 1)
          : timeoutMs;

        const response = await axios({
          ...options,
          timeout: timeoutMs,
        });
        success = true;
        resolve(response.data);
      } catch (err: any) {
        const status = err?.response?.status || 500;
        console.error(`Error Status: ${status}`);
      }
      retries++;
    }
    console.log(`Too many request retries.`);
    reject();
  });
}
