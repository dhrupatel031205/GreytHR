import express from 'express';
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementsForUser,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Employee routes
router.get('/my-announcements', getAnnouncementsForUser);
router.get('/:id', getAnnouncementById);

// HR/Admin routes
router.post('/', authorize('admin', 'hr'), createAnnouncement);
router.get('/', authorize('admin', 'hr'), getAllAnnouncements);
router.put('/:id', authorize('admin', 'hr'), updateAnnouncement);
router.delete('/:id', authorize('admin', 'hr'), deleteAnnouncement);

export default router;