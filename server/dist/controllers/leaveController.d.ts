import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const applyLeave: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyLeaves: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllLeaves: (req: Request, res: Response) => Promise<void>;
export declare const approveLeave: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const cancelLeave: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLeaveBalance: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getLeaveStats: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=leaveController.d.ts.map