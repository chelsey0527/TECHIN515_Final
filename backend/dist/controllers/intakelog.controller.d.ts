import { Request, Response } from "express";
export declare const getIntakelogData: (req: Request, res: Response) => Promise<void>;
export declare const scheduleDailyIntakeLogs: (user_id: any) => Promise<void>;
