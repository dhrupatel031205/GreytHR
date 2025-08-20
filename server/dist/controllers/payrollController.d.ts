import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const generatePayroll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPayrollByEmployee: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getAllPayrolls: (req: Request, res: Response) => Promise<void>;
export declare const getPayrollById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updatePayroll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const processPayroll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markPayrollAsPaid: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const bulkGeneratePayroll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPayrollStats: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=payrollController.d.ts.map