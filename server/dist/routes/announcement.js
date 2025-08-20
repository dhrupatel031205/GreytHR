"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const announcementController_1 = require("../controllers/announcementController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// All routes require authentication
router.use(auth_1.authenticate);
// Employee routes
router.get('/my-announcements', announcementController_1.getAnnouncementsForUser);
router.get('/:id', announcementController_1.getAnnouncementById);
// HR/Admin routes
router.post('/', (0, auth_1.authorize)('admin', 'hr'), announcementController_1.createAnnouncement);
router.get('/', (0, auth_1.authorize)('admin', 'hr'), announcementController_1.getAllAnnouncements);
router.put('/:id', (0, auth_1.authorize)('admin', 'hr'), announcementController_1.updateAnnouncement);
router.delete('/:id', (0, auth_1.authorize)('admin', 'hr'), announcementController_1.deleteAnnouncement);
exports.default = router;
//# sourceMappingURL=announcement.js.map