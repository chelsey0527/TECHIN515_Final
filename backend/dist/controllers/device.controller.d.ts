export declare function sendSignalToPillbox(): Promise<{
    success: boolean;
    message: string;
} | {
    success: boolean;
    message?: undefined;
}>;
