/* eslint-disable @typescript-eslint/naming-convention */

import { NextApiRequest, NextApiResponse } from 'next';
import { GetPlaiceholderReturn, getPlaiceholder } from 'plaiceholder';

const plaiceholderApiRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { imageUrl, strategy = 'base64', size = 10 },
    method,
  } = req;

  const _imageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
  const _strategy = Array.isArray(strategy) ? strategy[0] : strategy;
  const _size = Array.isArray(size) ? parseInt(size[0], 10) : parseInt(size as string, 10);

  const buffer = await fetch(_imageUrl).then(async (r) => Buffer.from(await r.arrayBuffer()));

  if (method === 'GET' && imageUrl && strategy && size) {
    const result: GetPlaiceholderReturn = await getPlaiceholder(buffer, {
      size: _size,
    });

    return res.status(200).json({ [_strategy]: result[_strategy] });
  }

  res.status(400).send('Did not provide a valid imageUrl');
};

export default plaiceholderApiRoute;
