export declare enum ColorBrightnessType {
    Light = 0,
    Dark = 1,
}
export declare class Colors {
    static hexToRGB(color: string): {
        r: number;
        g: number;
        b: number;
    };
    static getBrightnessType(color: string): ColorBrightnessType;
}
