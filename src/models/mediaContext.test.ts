import { retriableHttpRequest } from "../httpService";
import { getMergedMediaContext } from "./mediaContext";

jest.mock("../httpService");

describe("getMergedMediaContext", () => {
  it("should return the merged media context", async () => {
    const mockMedia = [
      { id: "1", mimeType: "image/png" },
      { id: "2", mimeType: "image/jpeg" },
    ];

    const mockMediaContext = [
      { mediaId: "1", context: "ID_FRONT", probability: 0.8 },
      { mediaId: "2", context: "ID_BACK", probability: 0.9 },
    ];

    (retriableHttpRequest as jest.Mock).mockResolvedValueOnce(mockMedia);
    (retriableHttpRequest as jest.Mock).mockResolvedValueOnce(mockMediaContext);

    const result = await getMergedMediaContext("123");

    expect(result).toEqual({
      ID_FRONT: [
        {
          mediaId: "1",
          context: "ID_FRONT",
          probability: 0.8,
          mimeType: "image/png",
        },
      ],
      ID_BACK: [
        {
          mediaId: "2",
          context: "ID_BACK",
          probability: 0.9,
          mimeType: "image/jpeg",
        },
      ],
    });
  });
});
