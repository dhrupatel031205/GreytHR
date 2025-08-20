import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
}
export declare const getAllEmployees: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getEmployeeById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEmployeeByUserId: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createEmployee: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateEmployee: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteEmployee: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDepartments: (req: Request, res: Response) => Promise<void>;
export declare const getDesignations: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=employeeController.d.ts.map