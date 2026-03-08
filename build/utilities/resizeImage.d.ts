export interface ResizeOptions {
    filename: string;
    width: number;
    height: number;
}
export interface ResizeResult {
    success: boolean;
    outputPath?: string;
    error?: string;
}
export declare const resizeImage: (options: ResizeOptions) => Promise<ResizeResult>;
//# sourceMappingURL=resizeImage.d.ts.map