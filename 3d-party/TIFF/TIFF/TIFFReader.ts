/// <reference path="IBinReader.ts" />

export module akra {
    export var assert: Function = console.assert;
    export var warning: Function = console.warn;
    export var error: Function = console.error;
    export var trace: Function = console.log;
    /*
    export interface ITIFFReader {
        isLittleEndian(): bool;
        hasTowel(): bool;
        parse(pBuffer: ArrayBuffer): void;
    }*/

    var TIFF_FIELD_TAG_NAMES = {
        // TIFF Baseline
        0x013B: 'Artist',
        0x0102: 'BitsPerSample',
        0x0109: 'CellLength',
        0x0108: 'CellWidth',
        0x0140: 'ColorMap',
        0x0103: 'Compression',
        0x8298: 'Copyright',
        0x0132: 'DateTime',
        0x0152: 'ExtraSamples',
        0x010A: 'FillOrder',
        0x0121: 'FreeByteCounts',
        0x0120: 'FreeOffsets',
        0x0123: 'GrayResponseCurve',
        0x0122: 'GrayResponseUnit',
        0x013C: 'HostComputer',
        0x010E: 'ImageDescription',
        0x0101: 'ImageLength',
        0x0100: 'ImageWidth',
        0x010F: 'Make',
        0x0119: 'MaxSampleValue',
        0x0118: 'MinSampleValue',
        0x0110: 'Model',
        0x00FE: 'NewSubfileType',
        0x0112: 'Orientation',
        0x0106: 'PhotometricInterpretation',
        0x011C: 'PlanarConfiguration',
        0x0128: 'ResolutionUnit',
        0x0116: 'RowsPerStrip',
        0x0115: 'SamplesPerPixel',
        0x0131: 'Software',
        0x0117: 'StripByteCounts',
        0x0111: 'StripOffsets',
        0x00FF: 'SubfileType',
        0x0107: 'Threshholding',
        0x011A: 'XResolution',
        0x011B: 'YResolution',

        // TIFF Extended
        0x0146: 'BadFaxLines',
        0x0147: 'CleanFaxData',
        0x0157: 'ClipPath',
        0x0148: 'ConsecutiveBadFaxLines',
        0x01B1: 'Decode',
        0x01B2: 'DefaultImageColor',
        0x010D: 'DocumentName',
        0x0150: 'DotRange',
        0x0141: 'HalftoneHints',
        0x015A: 'Indexed',
        0x015B: 'JPEGTables',
        0x011D: 'PageName',
        0x0129: 'PageNumber',
        0x013D: 'Predictor',
        0x013F: 'PrimaryChromaticities',
        0x0214: 'ReferenceBlackWhite',
        0x0153: 'SampleFormat',
        0x022F: 'StripRowCounts',
        0x014A: 'SubIFDs',
        0x0124: 'T4Options',
        0x0125: 'T6Options',
        0x0145: 'TileByteCounts',
        0x0143: 'TileLength',
        0x0144: 'TileOffsets',
        0x0142: 'TileWidth',
        0x012D: 'TransferFunction',
        0x013E: 'WhitePoint',
        0x0158: 'XClipPathUnits',
        0x011E: 'XPosition',
        0x0211: 'YCbCrCoefficients',
        0x0213: 'YCbCrPositioning',
        0x0212: 'YCbCrSubSampling',
        0x0159: 'YClipPathUnits',
        0x011F: 'YPosition',

        // EXIF
        0x9202: 'ApertureValue',
        0xA001: 'ColorSpace',
        0x9004: 'DateTimeDigitized',
        0x9003: 'DateTimeOriginal',
        0x8769: 'Exif IFD',
        0x9000: 'ExifVersion',
        0x829A: 'ExposureTime',
        0xA300: 'FileSource',
        0x9209: 'Flash',
        0xA000: 'FlashpixVersion',
        0x829D: 'FNumber',
        0xA420: 'ImageUniqueID',
        0x9208: 'LightSource',
        0x927C: 'MakerNote',
        0x9201: 'ShutterSpeedValue',
        0x9286: 'UserComment',

        // IPTC
        0x83BB: 'IPTC',

        // ICC
        0x8773: 'ICC Profile',

        // XMP
        0x02BC: 'XMP',

        // GDAL
        0xA480: 'GDAL_METADATA',
        0xA481: 'GDAL_NODATA',

        // Photoshop
        0x8649: 'Photoshop',
    };

    var TIFF_FIELD_TYPE_NAMES = {
        0x0001: 'BYTE',
        0x0002: 'ASCII',
        0x0003: 'SHORT',
        0x0004: 'LONG',
        0x0005: 'RATIONAL',
        0x0006: 'SBYTE',
        0x0007: 'UNDEFINED',
        0x0008: 'SSHORT',
        0x0009: 'SLONG',
        0x000A: 'SRATIONAL',
        0x000B: 'FLOAT',
        0x000C: 'DOUBLE'
    };


    export class TIFFReader/* implements ITIFFReader*/ {
        private pTiffDataView: DataView;
        private bLittleEndian: bool;
        private pFileDirectories: any[] = [];
        private pCanvas: HTMLCanvasElement;

        constructor (pBuffer: ArrayBuffer = null) {

            if (pBuffer) {
                this.parse(pBuffer);
            }
        }

        private isLittleEndian(): bool {
            // Get byte order mark.
            var BOM: number = this.getBytes(2, 0);

            // Find out the endianness.
            if (BOM === 0x4949) {
                this.bLittleEndian = true;
            } else if (BOM === 0x4D4D) {
                this.bLittleEndian = false;
            } else {
                error("Invalid byte order value.");
            }

            return this.bLittleEndian;
        }

        private hasTowel(): bool {
            // Check for towel.
            if (this.getBytes(2, 2) !== 42) {
                error("You forgot your towel!");
                return false;
            }

            return true;
        }

        private makeRGBAFillValue(r:number, g:number, b:number, a:number = 1.0): string {
            return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
        }


        draw(pCanvas: HTMLCanvasElement = null/*<HTMLCanvasElement>document.createElement('canvas')*/): HTMLCanvasElement {
            this.pCanvas = pCanvas;
            return null;
        }

        parse(pBuffer: ArrayBuffer): ArrayBuffer {
            

            this.pTiffDataView = new DataView(pBuffer);
            this.bLittleEndian = this.isLittleEndian();

            if (!this.hasTowel()) {
                return;
            }

            var iFirstIFDByteOffset: number = this.getBytes(4, 4);

            this.pFileDirectories = this.parseFileDirectory(iFirstIFDByteOffset);

            var pFileDirectory: any = this.pFileDirectories[0];

            trace(pFileDirectory);

            var iImageWidth = pFileDirectory.ImageWidth.values[0];
            var iImageHeight = pFileDirectory.ImageLength.values[0];


            var iCompression: number = (pFileDirectory.Compression) ? pFileDirectory.Compression.values[0] : 1;

            var iSamplesPerPixel: number = pFileDirectory.SamplesPerPixel.values[0];

            var pBytesPerSampleValues: number[] = [];
            var iBytesPerPixel: number = 0;

            pFileDirectory.BitsPerSample.values.forEach(function (iBitsPerSample: number, i, pBitsPerSampleValues: number[]) {
                // XXX: Could we handle odd bit lengths?
                if (iBitsPerSample % 8 !== 0) {
                    error("Cannot handle sub-byte bits per sample");
                    return;
                }

                pBytesPerSampleValues[i] = iBitsPerSample / 8;
                iBytesPerPixel += pBytesPerSampleValues[i];
            }, this);
            console.log(pBytesPerSampleValues);
            var pStripOffsetValues: number[] = pFileDirectory.StripOffsets.values;
            var iNumStripOffsetValues: number = pStripOffsetValues.length;
            var pStripByteCountValues: number[];

            // StripByteCounts is supposed to be required, but see if we can recover anyway.
            if (pFileDirectory.StripByteCounts) {
                pStripByteCountValues = pFileDirectory.StripByteCounts.values;
            } else {
                console.log("Missing StripByteCounts!");

                // Infer StripByteCounts, if possible.
                if (iNumStripOffsetValues === 1) {
                    pStripByteCountValues = [iImageWidth * iImageHeight * iBytesPerPixel];
                } else {
                    error("Cannot recover from missing StripByteCounts");
                }
            }
            var pStrips = [];
            // Loop through strips and decompress as necessary.
            for (var i: number = 0; i < iNumStripOffsetValues; i++) {
                var iStripOffset = pStripOffsetValues[i];
                pStrips[i] = [];

                var iStripByteCount = pStripByteCountValues[i];

                // Loop through pixels.
                for (var j: number = 0, iJIncrement: number = 1, bGetHeader: bool = true, pPixel = [], iNumBytes = 0, iSample = 0, iCurrentSample = 0; j < iStripByteCount; j += iJIncrement) {
                    // Decompress strip.
                    switch (iCompression) {
                        // Uncompressed
                        case 1:
                            // Loop through samples (sub-pixels).
                            for (var m: number = 0, pPixel:number[] = []; m < iSamplesPerPixel; m++) {
                                var iSampleOffset: number = pBytesPerSampleValues[m] * m;

                                pPixel.push(this.getBytes(pBytesPerSampleValues[m], iStripOffset + j + iSampleOffset));
                            }

                            pStrips[i].push(pPixel);

                            iJIncrement = iBytesPerPixel;
                            break;

                        // CITT Group 3 1-Dimensional Modified Huffman run-length encoding
                        case 2:
                            error('compression <CITT Group 3 1-Dimensional Modified Huffman run-length encoding> unsupported.');
                            break;

                        // Group 3 Fax
                        case 3:
                            error('compression <Group 3 Fax> unsupported.');
                            break;

                        // Group 4 Fax
                        case 4:
                            error('compression <Group 4 Fax> unsupported.');
                            break;

                        // LZW
                        case 5:
                            error('compression <LZW> unsupported.');
                            break;

                        // Old-style JPEG (TIFF 6.0)
                        case 6:
                            error('compression <Old-style JPEG (TIFF 6.0)> unsupported.');
                            break;

                        // New-style JPEG (TIFF Specification Supplement 2)
                        case 7:
                            error('compression <New-style JPEG (TIFF Specification Supplement 2)> unsupported.');
                            break;

                        // PackBits
                        case 32773:
                            // Are we ready for a new block?
                            if (bGetHeader) {
                                bGetHeader = false;

                                var iBlockLength = 1;
                                var iIterations = 1;

                                // The header byte is signed.
                                var iHeader = this.pTiffDataView.getInt8(iStripOffset + j);

                                if ((iHeader >= 0) && (iHeader <= 127)) { // Normal pixels.
                                    iBlockLength = iHeader + 1;
                                } else if ((iHeader >= -127) && (iHeader <= -1)) { // Collapsed pixels.
                                    iIterations = -iHeader + 1;
                                } else /*if (header === -128)*/ { // Placeholder byte?
                                    bGetHeader = true;
                                }
                            } else {
                                var iCurrentByte = this.getBytes(1, iStripOffset + j);

                                // Duplicate bytes, if necessary.
                                for (var m = 0; m < iIterations; m++) {
                                    // We're reading one byte at a time, so we need to handle multi-byte samples.
                                    iCurrentSample = (iCurrentSample << (8 * iNumBytes)) | iCurrentByte;
                                    iNumBytes++;

                                    // Is our sample complete?
                                    if (iNumBytes === pBytesPerSampleValues[iSample]) {
                                        pPixel.push(iCurrentSample);
                                        iCurrentSample = iNumBytes = 0;
                                        iSample++;
                                    }

                                    // Is our pixel complete?
                                    if (iSample === iSamplesPerPixel) {
                                        pStrips[i].push(pPixel);

                                        pPixel = [];
                                        iSample = 0;
                                    }
                                }

                                iBlockLength--;

                                // Is our block complete?
                                if (iBlockLength === 0) {
                                    bGetHeader = true;
                                }
                            }

                            iJIncrement = 1;
                            break;

                        // Unknown compression algorithm
                        default:
                            // Do not attempt to parse the image data.
                            break;
                    }
                }

                //console.log( pStrips[i] );
            }


            if (1 /*|| pCanvas.getContext*/) {
         
                /*
                this.pCanvas.width = iImageWidth;
                this.pCanvas.height = iImageHeight;
                
                var pContext:CanvasRenderingContext2D = this.pCanvas.getContext("2d");

                // Set a default fill style.
                pContext.fillStyle = this.makeRGBAFillValue(255, 255, 255, 0);
                */
                // If RowsPerStrip is missing, the whole image is in one strip.
                if (pFileDirectory.RowsPerStrip) {
                    var iRowsPerStrip:number = pFileDirectory.RowsPerStrip.values[0];
                } else {
                    var iRowsPerStrip:number = iImageHeight;
                }

                var iNumStrips:number = pStrips.length;

                var iImageLengthModRowsPerStrip:number = iImageHeight % iRowsPerStrip;
                var iRowsInLastStrip:number = (iImageLengthModRowsPerStrip === 0) ? iRowsPerStrip : iImageLengthModRowsPerStrip;

                var iNumRowsInStrip:number = iRowsPerStrip;
                var iNumRowsInPreviousStrip:number = 0;

                var iPhotometricInterpretation:number = pFileDirectory.PhotometricInterpretation.values[0];

                var pExtraSamplesValues:number[] = [];
                var iNumExtraSamples:number = 0;
                var pColorMapValues: number[];
                var iColorMapSampleSize: number;

                if (pFileDirectory.ExtraSamples) {
                    pExtraSamplesValues = pFileDirectory.ExtraSamples.values;
                    iNumExtraSamples = pExtraSamplesValues.length;
                }

                if (pFileDirectory.ColorMap) {
                    pColorMapValues = pFileDirectory.ColorMap.values;
                    iColorMapSampleSize = Math.pow(2, pBytesPerSampleValues[0] * 8);
                }
               
                //pBytesPerSampleValues[0]

                // Loop through the strips in the image.
                for (var i:number = 0; i < iNumStrips; i++) {
                    // The last strip may be short.
                    if ((i + 1) === iNumStrips) {
                        iNumRowsInStrip = iRowsInLastStrip;
                    }

                    var iNumPixels = pStrips[i].length;
                    var yPadding = iNumRowsInPreviousStrip * i;
                    
                    // Loop through the rows in the strip.
                    for (var y:number = 0, j:number = 0; y < iNumRowsInStrip, j < iNumPixels; y++) {
                         
                        // Loop through the pixels in the row.
                        for (var x = 0; x < iImageWidth; x++, j++) {
                            var pPixelSamples = pStrips[i][j];

                            var iRed = 0;
                            var iGreen = 0;
                            var iBlue = 0;
                            var fOpacity = 1.0;

                            if (iNumExtraSamples > 0) {
                                for (var k:number = 0; k < iNumExtraSamples; k++) {
                                    if (pExtraSamplesValues[k] === 1) {
                                        fOpacity = pPixelSamples[3 + k] / 256;

                                        break;
                                    }
                                }
                            }

                            switch (iPhotometricInterpretation) {
                                // Bilevel or Grayscale
                                // WhiteIsZero
                                case 0:
                                    var iInvertValue = Math.pow(0x10, pBytesPerSampleValues[0] * 2);

                                    // Invert samples.
                                    pPixelSamples.forEach(function (sample, index, samples) { samples[index] = iInvertValue - sample; });

                                // Bilevel or Grayscale
                                // BlackIsZero
                                case 1:
                                    iRed = iGreen = iBlue = pPixelSamples[0];
                                    break;

                                // RGB Full Color
                                case 2:
                                    iRed = pPixelSamples[0];
                                    iGreen = pPixelSamples[1];
                                    iBlue = pPixelSamples[2];
                                    break;

                                // RGB Color Palette
                                case 3:
                                    if (pColorMapValues === undefined) {
                                        error("Palette image missing color map");
                                    }

                                    var iColorMapIndex:number = pPixelSamples[0];

                                    iRed = Math.floor(pColorMapValues[iColorMapIndex] / 256);
                                    iGreen = Math.floor(pColorMapValues[iColorMapSampleSize + iColorMapIndex] / 256);
                                    iBlue = Math.floor(pColorMapValues[(2 * iColorMapSampleSize) + iColorMapIndex] / 256);
                                    break;

                                // Transparency mask
                                case 4:
                                    break;

                                // CMYK
                                case 5:
                                    break;

                                // YCbCr
                                case 6:
                                    break;

                                // CIELab
                                case 8:
                                    break;

                                // Unknown Photometric Interpretation
                                default:
                                    break;
                            }
                            //console.log(iRed, iGreen, iBlue, fOpacity);
                            /*
                            pContext.fillStyle = this.makeRGBAFillValue(iRed, iGreen, iBlue, fOpacity);
                            pContext.fillRect(x, yPadding + y, 1, 1);*/
                        }
                    }

                    iNumRowsInPreviousStrip = iNumRowsInStrip;
                }
            }

            /* for (var i = 0, numFileDirectories = this.fileDirectories.length; i < numFileDirectories; i++) {
            // Stuff
            }*/

            return null;//this.pCanvas

        }

        get canvas(): HTMLCanvasElement {
            return this.pCanvas;
        }

        private getBytes(iNumBytes, iOffset): number {

            if (iNumBytes <= 0) {
                trace(iNumBytes, iOffset);
                error("No bytes requested");
            } else if (iNumBytes <= 1) {
                return this.pTiffDataView.getUint8(iOffset);
            } else if (iNumBytes <= 2) {
                return this.pTiffDataView.getUint16(iOffset, this.bLittleEndian);
            } else if (iNumBytes <= 3) {
                return this.pTiffDataView.getUint32(iOffset, this.bLittleEndian) >>> 8;
            } else if (iNumBytes <= 4) {
                return this.pTiffDataView.getUint32(iOffset, this.bLittleEndian);
            } else {
                trace(iNumBytes, iOffset);
                error("Too many bytes requested");
            }

            return 0;
        }

        private getFieldTagName(iFieldTag: number): string {
            var sFieldTagName: string;
            var sFieldTag: string = String(iFieldTag);

            if (sFieldTag in TIFF_FIELD_TAG_NAMES) {
                sFieldTagName = TIFF_FIELD_TAG_NAMES[sFieldTag];
            } else {
                warning("Unknown Field Tag:", iFieldTag);
                sFieldTagName = "Tag" + iFieldTag;
            }

            return sFieldTagName;
        }

        private getFieldTypeName(iFieldType: number): string {
            var sFieldTypeName: string;
            var sFieldType: string = String(iFieldType);

            if (sFieldType in TIFF_FIELD_TYPE_NAMES) {
                sFieldTypeName = TIFF_FIELD_TYPE_NAMES[sFieldType];
            }

            return sFieldTypeName;
        }

        private getFieldTypeLength(sFeildTypeName: string): number {
            var iFieldTypeLength: number;

            if (['BYTE', 'ASCII', 'SBYTE', 'UNDEFINED'].indexOf(sFeildTypeName) !== -1) {
                iFieldTypeLength = 1;
            } else if (['SHORT', 'SSHORT'].indexOf(sFeildTypeName) !== -1) {
                iFieldTypeLength = 2;
            } else if (['LONG', 'SLONG', 'FLOAT'].indexOf(sFeildTypeName) !== -1) {
                iFieldTypeLength = 4;
            } else if (['RATIONAL', 'SRATIONAL', 'DOUBLE'].indexOf(sFeildTypeName) !== -1) {
                iFieldTypeLength = 8;
            }

            return iFieldTypeLength;
        }

        private getFieldValues(sFieldTagName: string, sFieldTypeName: string, iTypeCount: number, iValueOffset: number): any[] {
            var pFieldValues: any[] = [];

            var iFieldTypeLength: number = this.getFieldTypeLength(sFieldTypeName);
            var iFieldValueSize = iFieldTypeLength * iTypeCount;
            var iValue;

            if (iFieldValueSize <= 4) {
                // The value is stored at the big end of the valueOffset.
                if (this.bLittleEndian === false) {
                    iValue = iValueOffset >>> ((4 - iFieldTypeLength) * 8);
                } else {
                    iValue = iValueOffset;
                }

                pFieldValues.push(iValue);
            } else {
                for (var i: number = 0; i < iTypeCount; i++) {
                    var iIndexOffset: number = iFieldTypeLength * i;

                    if (iFieldTypeLength >= 8) {
                        if (['RATIONAL', 'SRATIONAL'].indexOf(sFieldTypeName) !== -1) {
                            // Numerator
                            pFieldValues.push(this.getBytes(4, iValueOffset + iIndexOffset));
                            // Denominator
                            pFieldValues.push(this.getBytes(4, iValueOffset + iIndexOffset + 4));
                            // } else if (['DOUBLE'].indexOf(fieldTypeName) !== -1) {
                            // fieldValues.push(this.getBytes(4, valueOffset + indexOffset) + this.getBytes(4, valueOffset + indexOffset + 4));
                        } else {
                            trace(sFieldTypeName, iTypeCount, iFieldValueSize);
                            error("Can't handle this field type or size");
                        }
                    } else {
                        pFieldValues.push(this.getBytes(iFieldTypeLength, iValueOffset + iIndexOffset));
                    }
                }
            }

            if (sFieldTypeName === 'ASCII') {
                pFieldValues.forEach(function (e, i, a) { a[i] = String.fromCharCode(e); });
            }

            return pFieldValues;
        }

        private parseFileDirectory(iByteOffset: number): string[] {
            var iNumDirEntries: number = this.getBytes(2, iByteOffset);

            var pTiffFields: { type: string; values: string[]; }[] = [];

            for (var i: number = iByteOffset + 2, iEntryCount = 0; iEntryCount < iNumDirEntries; i += 12, iEntryCount++) {
                var iFieldTag: number = this.getBytes(2, i);
                var iFieldType: number = this.getBytes(2, i + 2);
                var iTypeCount: number = this.getBytes(4, i + 4);
                var iValueOffset: number = this.getBytes(4, i + 8);

                var sFieldTagName: string = this.getFieldTagName(iFieldTag);
                var sFieldTypeName: string = this.getFieldTypeName(iFieldType);

                var pFieldValues: number[] = this.getFieldValues(sFieldTagName, sFieldTypeName, iTypeCount, iValueOffset);

                // console.log( fieldTagName + ' (0x' + fieldTag.toString(16).toUpperCase() + ')', fieldTypeName + ' (' + fieldType + ')', typeCount, valueOffset, '0x' + valueOffset.toString(16).toUpperCase() );

                pTiffFields[sFieldTagName] = { 'type': sFieldTypeName, 'values': pFieldValues };
            }

            this.pFileDirectories.push(pTiffFields);

            var iNextIFDByteOffset = this.getBytes(4, i);

            if (iNextIFDByteOffset === 0x00000000) {
                return this.pFileDirectories;
            }

            return this.parseFileDirectory(iNextIFDByteOffset);
        }
    }
}