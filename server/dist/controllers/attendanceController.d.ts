import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const punchIn: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const punchOut: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTodayAttendance: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAttendanceHistory: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAttendanceReport: (req: Request, res: Response) => Promise<void>;
export declare const updateAttendance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDashboardStats: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=attendanceController.d.ts.map