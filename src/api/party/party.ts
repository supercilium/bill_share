import { Router } from 'express';

export const partyRouter = Router()

partyRouter.get('/:id', async (req, res, next) => {
  console.log(req.params);
});
