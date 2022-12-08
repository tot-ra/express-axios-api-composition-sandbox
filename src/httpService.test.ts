import { retriableHttpRequest } from "./httpService";
import axios from "axios";

jest.mock("axios");

describe("retriableHttpRequest", () => {
  it("should make a successful HTTP request", async () => {
    const mockData = { foo: "bar" };
    // @ts-ignore
    (axios as jest.Mock).mockResolvedValueOnce({ data: mockData });

    try {
      const result = await retriableHttpRequest({ url: "https://api.veriff.internal/sessions/123/media" });

      expect(result).toEqual(mockData);
    } catch (e) {
      expect(true).toBe(false);
    }
    expect(axios).toHaveBeenCalledTimes(1);
  });

  it("should make multiple HTTP requests and resolve on success", async () => {
    const mockData = { foo: "bar" };
    // @ts-ignore
    (axios as jest.Mock).mockRejectedValueOnce(new Error("Error"));
    // @ts-ignore
    (axios as jest.Mock).mockRejectedValueOnce(new Error("Error"));
    // @ts-ignore
    (axios as jest.Mock).mockResolvedValueOnce({ data: mockData });

    try {
      const result = await retriableHttpRequest({ url: "https://api.veriff.internal/sessions/123/media" });
      expect(result).toEqual(mockData);
    } catch (e) {
      expect(true).toBe(false);
    }
    expect(axios).toHaveBeenCalledTimes(3);
  });

  it("should reject after multiple failed HTTP requests", async () => {
    // @ts-ignore
    (axios as jest.Mock).mockRejectedValueOnce(new Error("Error"));
    // @ts-ignore
    (axios as jest.Mock).mockRejectedValueOnce(new Error("Error"));
    // @ts-ignore
    (axios as jest.Mock).mockRejectedValueOnce(new Error("Error"));
    // @ts-ignore
    (axios as jest.Mock).mockRejectedValueOnce(new Error("Error"));
    // @ts-ignore
    (axios as jest.Mock).mockRejectedValueOnce(new Error("Error"));

    // @ts-ignore
    (axios as jest.Mock).mockRejectedValueOnce(new Error("Error"));
    try {
      await retriableHttpRequest({ url: "https://api.veriff.internal/sessions/123/media" });
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e).toEqual("Too many request retries.");
    }
    expect(axios).toHaveBeenCalledTimes(5);
  });
});
