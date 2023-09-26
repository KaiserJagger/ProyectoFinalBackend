import { Router } from 'express'

export const router = Router()

router.get('*',(req, res) => {
    res.status(404).render("errors/404");
});

export default router;