import axios from 'axios';
import { ApiGetSessionResponse } from '../../src/models/mediaContext';

describe('GET http://localhost:3000/api/sessions/:sessionId', () => {
  it('should return session with media', async () => {
    const response = await axios.get('http://localhost:3000/api/sessions/90d61876-b99a-443e-994c-ba882c8558b6');
    expect(response.status).toEqual(200);

    expect((response.data as ApiGetSessionResponse)?.back.length).toEqual(1)
    expect((response.data as ApiGetSessionResponse)?.front.length).toEqual(3)

    expect(Object.keys((response.data as ApiGetSessionResponse)?.back[0])).toEqual([
      'id',
      'mediaId',
      'context',
      'probability',
      'mimeType'
    ]);
  });
});
