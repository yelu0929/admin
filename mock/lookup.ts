import { Request, Response } from 'express';

export const lookup = {
  edu: [
    {label: '高中', value: '1'},
    {label: '本科', value: '2'},
    {label: '硕士', value: '3'},
    {label: '博士', value: '4'},
  ],
}

export default {
  'GET /services/lookup/:code': (req: Request, res: Response) => {
    const { code } = req.params
    res.send({ status: 'ok', data: lookup[code] || [] });
  },
}