import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const createAnnouncement: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllAnnouncements: (req: Request, res: Response) => Promise<void>;
export declare const getAnnouncementsForUser: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAnnouncementById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateAnnouncement: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAnnouncement: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=announcementController.d.ts.map