import express from 'express';
import axios from 'axios';

import './externalService';

const app = express();
const port = 3000;

app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const [session, media, context] = await Promise.all([
      axios.get(`https://api.veriff.internal/sessions/${sessionId}`),
      axios.get(`https://api.veriff.internal/sessions/${sessionId}/media`),
      axios.get(`https://api.veriff.internal/media-context/${sessionId}`)
    ]);

    return res.status(200).json({
      session: session.data,
      media: media.data,
      context: context.data
    });
  } catch (error: any) {
    console.error('Error happened', error);
    return res.status(error.response.status).json({ message: error.response.data });
  }
});

app.listen(port, () => {
  console.info(`Service is listening at http://localhost:${port}`);
});
