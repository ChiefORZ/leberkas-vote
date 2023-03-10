/* eslint-disable no-underscore-dangle */
import { NextApiRequest, NextApiResponse } from 'next';
import { getPlaiceholder, IGetPlaiceholderReturn } from 'plaiceholder';

const plaiceholderApiRoute = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {
    query: { imageUrl, strategy = 'base64', size = 10 },
    method,
  } = req;

  const _imageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
  const _strategy = Array.isArray(strategy) ? strategy[0] : strategy;
  const _size = Array.isArray(size)
    ? parseInt(size[0], 10)
    : parseInt(size as string, 10);

  if (method === 'GET' && imageUrl && strategy && size) {
    const result: IGetPlaiceholderReturn = await getPlaiceholder(_imageUrl, {
      size: _size,
    });

    return res.status(200).json({ [_strategy]: result[_strategy] });
  }

  res.status(400).send('Did not provide a valid imageUrl');
};

export default plaiceholderApiRoute;
