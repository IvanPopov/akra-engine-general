module akra {

    export interface IBinReader {
        constructor (pBuffer: ArrayBufferView, pOptions?: { byteOffset?: number; byteLength?: number;}): void;
        
        string(): string;
        stringArray(): string[];
        
        bool(): number;
        
        uint32(): number;
        uint16(): number;
        uint8(): number;
        uint8Array(): Uint8Array;
        uin16Aray(): Uint16Array;
        uint32Array(): Uint32Array;

        int32(): number;
        int16(): number;
        int8(): number;
        int8Array(): Int8Array;
        int16Array(): Int16Array;
        int32Array(): Int32Array;

        float32(): number;
        float64(): number;
        float32Array(): Float32Array;
        float64Array(): Float64Array;
    }
}