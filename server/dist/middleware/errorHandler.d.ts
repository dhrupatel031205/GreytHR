import { Request, Response, NextFunction } from 'express';
interface Error {
    statusCode?: number;
    message: string;
    stack?: string;
    name?: string;
    code?: number;
    keyValue?: any;
}
declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
export default errorHandler;
//# sourceMappingURL=errorHandler.d.ts.map