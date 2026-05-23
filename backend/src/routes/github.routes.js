import { Router } from 'express';
import * as githubController from '../controllers/github.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// All GitHub integration endpoints are protected by JWT check
router.use(protect);

router.post('/connect', githubController.connectGitHub);
router.post('/disconnect', githubController.disconnectGitHub);
router.get('/repos', githubController.getRepos);
router.post('/add-repo', githubController.addRepo);
router.post('/sync/:repoId', githubController.syncRepo);

export default router;
