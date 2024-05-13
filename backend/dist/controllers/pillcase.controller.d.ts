import { Request, Response } from 'express';
export declare const getAllPillcase: (req: Request, res: Response) => Promise<void>;
export declare const getPillcaseById: (req: Request, res: Response) => Promise<void>;
export declare const createPillcase: (req: Request, res: Response) => Promise<void>;
export declare const updatePillcaseById: (req: Request, res: Response) => Promise<void>;
