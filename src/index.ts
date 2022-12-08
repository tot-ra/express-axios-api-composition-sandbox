import express from 'express';

import './externalService';
import { getMergedMediaContext } from './models/mediaContext';

const app = express();
const port = 3000;

app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const filteredData = await getMergedMediaContext(sessionId);

    return res.status(200).json(filteredData);

  } catch (error: any) {
    console.error('Error happened', error);
    return res.status(error.response.status).json({ message: error.response.data });
  }
});

app.listen(port, () => {
  console.info(`Service is listening at http://localhost:${port}`);
});
