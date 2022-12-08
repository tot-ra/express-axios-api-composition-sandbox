import axios, { AxiosRequestConfig } from "axios";

export async function retriableHttpRequest(
  options: AxiosRequestConfig,
  maxRetries = 5,
  doubleTimeoutOnRetry = true
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        let timeoutMs = options.timeout ? options.timeout : 1000;
        timeoutMs = doubleTimeoutOnRetry
          ? timeoutMs * (retries + 1)
          : timeoutMs;

        const response = await axios({
          ...options,
          timeout: timeoutMs,
        });
        return resolve(response.data);
      } catch (err: any) {
        //console.log(err.message);
      }
      retries++;
    }
    return reject(`Too many request retries.`);
  });
}
