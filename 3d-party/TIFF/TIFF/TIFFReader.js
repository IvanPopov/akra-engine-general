(function (akra) {
    akra.assert = console.assert;
    akra.warning = console.warn;
    akra.error = console.error;
    akra.trace = console.log;
    var TIFF_FIELD_TAG_NAMES = {
        315: 'Artist',
        258: 'BitsPerSample',
        265: 'CellLength',
        264: 'CellWidth',
        320: 'ColorMap',
        259: 'Compression',
        33432: 'Copyright',
        306: 'DateTime',
        338: 'ExtraSamples',
        266: 'FillOrder',
        289: 'FreeByteCounts',
        288: 'FreeOffsets',
        291: 'GrayResponseCurve',
        290: 'GrayResponseUnit',
        316: 'HostComputer',
        270: 'ImageDescription',
        257: 'ImageLength',
        256: 'ImageWidth',
        271: 'Make',
        281: 'MaxSampleValue',
        280: 'MinSampleValue',
        272: 'Model',
        254: 'NewSubfileType',
        274: 'Orientation',
        262: 'PhotometricInterpretation',
        284: 'PlanarConfiguration',
        296: 'ResolutionUnit',
        278: 'RowsPerStrip',
        277: 'SamplesPerPixel',
        305: 'Software',
        279: 'StripByteCounts',
        273: 'StripOffsets',
        255: 'SubfileType',
        263: 'Threshholding',
        282: 'XResolution',
        283: 'YResolution',
        326: 'BadFaxLines',
        327: 'CleanFaxData',
        343: 'ClipPath',
        328: 'ConsecutiveBadFaxLines',
        433: 'Decode',
        434: 'DefaultImageColor',
        269: 'DocumentName',
        336: 'DotRange',
        321: 'HalftoneHints',
        346: 'Indexed',
        347: 'JPEGTables',
        285: 'PageName',
        297: 'PageNumber',
        317: 'Predictor',
        319: 'PrimaryChromaticities',
        532: 'ReferenceBlackWhite',
        339: 'SampleFormat',
        559: 'StripRowCounts',
        330: 'SubIFDs',
        292: 'T4Options',
        293: 'T6Options',
        325: 'TileByteCounts',
        323: 'TileLength',
        324: 'TileOffsets',
        322: 'TileWidth',
        301: 'TransferFunction',
        318: 'WhitePoint',
        344: 'XClipPathUnits',
        286: 'XPosition',
        529: 'YCbCrCoefficients',
        531: 'YCbCrPositioning',
        530: 'YCbCrSubSampling',
        345: 'YClipPathUnits',
        287: 'YPosition',
        37378: 'ApertureValue',
        40961: 'ColorSpace',
        36868: 'DateTimeDigitized',
        36867: 'DateTimeOriginal',
        34665: 'Exif IFD',
        36864: 'ExifVersion',
        33434: 'ExposureTime',
        41728: 'FileSource',
        37385: 'Flash',
        40960: 'FlashpixVersion',
        33437: 'FNumber',
        42016: 'ImageUniqueID',
        37384: 'LightSource',
        37500: 'MakerNote',
        37377: 'ShutterSpeedValue',
        37510: 'UserComment',
        33723: 'IPTC',
        34675: 'ICC Profile',
        700: 'XMP',
        42112: 'GDAL_METADATA',
        42113: 'GDAL_NODATA',
        34377: 'Photoshop'
    };
    var TIFF_FIELD_TYPE_NAMES = {
        1: 'BYTE',
        2: 'ASCII',
        3: 'SHORT',
        4: 'LONG',
        5: 'RATIONAL',
        6: 'SBYTE',
        7: 'UNDEFINED',
        8: 'SSHORT',
        9: 'SLONG',
        10: 'SRATIONAL',
        11: 'FLOAT',
        12: 'DOUBLE'
    };
    var TIFFReader = (function () {
        function TIFFReader(pBuffer) {
            if (typeof pBuffer === "undefined") { pBuffer = null; }
            this.pFileDirectories = [];
            if(pBuffer) {
                this.parse(pBuffer);
            }
        }
        TIFFReader.prototype.isLittleEndian = function () {
            var BOM = this.getBytes(2, 0);
            if(BOM === 18761) {
                this.bLittleEndian = true;
            } else {
                if(BOM === 19789) {
                    this.bLittleEndian = false;
                } else {
                    akra.error("Invalid byte order value.");
                }
            }
            return this.bLittleEndian;
        };
        TIFFReader.prototype.hasTowel = function () {
            if(this.getBytes(2, 2) !== 42) {
                akra.error("You forgot your towel!");
                return false;
            }
            return true;
        };
        TIFFReader.prototype.makeRGBAFillValue = function (r, g, b, a) {
            if (typeof a === "undefined") { a = 1; }
            return "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
        };
        TIFFReader.prototype.draw = function (pCanvas) {
            if (typeof pCanvas === "undefined") { pCanvas = null; }
            this.pCanvas = pCanvas;
            return null;
        };
        TIFFReader.prototype.parse = function (pBuffer) {
            this.pTiffDataView = new DataView(pBuffer);
            this.bLittleEndian = this.isLittleEndian();
            if(!this.hasTowel()) {
                return;
            }
            var iFirstIFDByteOffset = this.getBytes(4, 4);
            this.pFileDirectories = this.parseFileDirectory(iFirstIFDByteOffset);
            var pFileDirectory = this.pFileDirectories[0];
            akra.trace(pFileDirectory);
            var iImageWidth = pFileDirectory.ImageWidth.values[0];
            var iImageHeight = pFileDirectory.ImageLength.values[0];
            var iCompression = (pFileDirectory.Compression) ? pFileDirectory.Compression.values[0] : 1;
            var iSamplesPerPixel = pFileDirectory.SamplesPerPixel.values[0];
            var pBytesPerSampleValues = [];
            var iBytesPerPixel = 0;
            pFileDirectory.BitsPerSample.values.forEach(function (iBitsPerSample, i, pBitsPerSampleValues) {
                if(iBitsPerSample % 8 !== 0) {
                    akra.error("Cannot handle sub-byte bits per sample");
                    return;
                }
                pBytesPerSampleValues[i] = iBitsPerSample / 8;
                iBytesPerPixel += pBytesPerSampleValues[i];
            }, this);
            var pStripOffsetValues = pFileDirectory.StripOffsets.values;
            var iNumStripOffsetValues = pStripOffsetValues.length;
            var pStripByteCountValues;
            if(pFileDirectory.StripByteCounts) {
                pStripByteCountValues = pFileDirectory.StripByteCounts.values;
            } else {
                console.log("Missing StripByteCounts!");
                if(iNumStripOffsetValues === 1) {
                    pStripByteCountValues = [
                        iImageWidth * iImageHeight * iBytesPerPixel
                    ];
                } else {
                    akra.error("Cannot recover from missing StripByteCounts");
                }
            }
            var pStrips = [];
            for(var i = 0; i < iNumStripOffsetValues; i++) {
                var iStripOffset = pStripOffsetValues[i];
                pStrips[i] = [];
                var iStripByteCount = pStripByteCountValues[i];
                for(var j = 0, iJIncrement = 1, bGetHeader = true, pPixel = [], iNumBytes = 0, iSample = 0, iCurrentSample = 0; j < iStripByteCount; j += iJIncrement) {
                    switch(iCompression) {
                        case 1: {
                            for(var m = 0, pPixel = []; m < iSamplesPerPixel; m++) {
                                var iSampleOffset = pBytesPerSampleValues[m] * m;
                                pPixel.push(this.getBytes(pBytesPerSampleValues[m], iStripOffset + j + iSampleOffset));
                            }
                            pStrips[i].push(pPixel);
                            iJIncrement = iBytesPerPixel;
                            break;

                        }
                        case 2: {
                            akra.error('compression <CITT Group 3 1-Dimensional Modified Huffman run-length encoding> unsupported.');
                            break;

                        }
                        case 3: {
                            akra.error('compression <Group 3 Fax> unsupported.');
                            break;

                        }
                        case 4: {
                            akra.error('compression <Group 4 Fax> unsupported.');
                            break;

                        }
                        case 5: {
                            akra.error('compression <LZW> unsupported.');
                            break;

                        }
                        case 6: {
                            akra.error('compression <Old-style JPEG (TIFF 6.0)> unsupported.');
                            break;

                        }
                        case 7: {
                            akra.error('compression <New-style JPEG (TIFF Specification Supplement 2)> unsupported.');
                            break;

                        }
                        case 32773: {
                            if(bGetHeader) {
                                bGetHeader = false;
                                var iBlockLength = 1;
                                var iIterations = 1;
                                var iHeader = this.pTiffDataView.getInt8(iStripOffset + j);
                                if((iHeader >= 0) && (iHeader <= 127)) {
                                    iBlockLength = iHeader + 1;
                                } else {
                                    if((iHeader >= -127) && (iHeader <= -1)) {
                                        iIterations = -iHeader + 1;
                                    } else {
                                        bGetHeader = true;
                                    }
                                }
                            } else {
                                var iCurrentByte = this.getBytes(1, iStripOffset + j);
                                for(var m = 0; m < iIterations; m++) {
                                    iCurrentSample = (iCurrentSample << (8 * iNumBytes)) | iCurrentByte;
                                    iNumBytes++;
                                    if(iNumBytes === pBytesPerSampleValues[iSample]) {
                                        pPixel.push(iCurrentSample);
                                        iCurrentSample = iNumBytes = 0;
                                        iSample++;
                                    }
                                    if(iSample === iSamplesPerPixel) {
                                        pStrips[i].push(pPixel);
                                        pPixel = [];
                                        iSample = 0;
                                    }
                                }
                                iBlockLength--;
                                if(iBlockLength === 0) {
                                    bGetHeader = true;
                                }
                            }
                            iJIncrement = 1;
                            break;

                        }
                        default: {
                            break;

                        }
                    }
                }
            }
            if(1) {
                if(pFileDirectory.RowsPerStrip) {
                    var iRowsPerStrip = pFileDirectory.RowsPerStrip.values[0];
                } else {
                    var iRowsPerStrip = iImageHeight;
                }
                var iNumStrips = pStrips.length;
                var iImageLengthModRowsPerStrip = iImageHeight % iRowsPerStrip;
                var iRowsInLastStrip = (iImageLengthModRowsPerStrip === 0) ? iRowsPerStrip : iImageLengthModRowsPerStrip;
                var iNumRowsInStrip = iRowsPerStrip;
                var iNumRowsInPreviousStrip = 0;
                var iPhotometricInterpretation = pFileDirectory.PhotometricInterpretation.values[0];
                var pExtraSamplesValues = [];
                var iNumExtraSamples = 0;
                var pColorMapValues;
                var iColorMapSampleSize;
                if(pFileDirectory.ExtraSamples) {
                    pExtraSamplesValues = pFileDirectory.ExtraSamples.values;
                    iNumExtraSamples = pExtraSamplesValues.length;
                }
                if(pFileDirectory.ColorMap) {
                    pColorMapValues = pFileDirectory.ColorMap.values;
                    iColorMapSampleSize = Math.pow(2, pBytesPerSampleValues[0] * 8);
                }
                for(var i = 0; i < iNumStrips; i++) {
                    if((i + 1) === iNumStrips) {
                        iNumRowsInStrip = iRowsInLastStrip;
                    }
                    var iNumPixels = pStrips[i].length;
                    var yPadding = iNumRowsInPreviousStrip * i;
                    for(var y = 0, j = 0; y < iNumRowsInStrip , j < iNumPixels; y++) {
                        for(var x = 0; x < iImageWidth; x++ , j++) {
                            var pPixelSamples = pStrips[i][j];
                            var iRed = 0;
                            var iGreen = 0;
                            var iBlue = 0;
                            var fOpacity = 1;
                            if(iNumExtraSamples > 0) {
                                for(var k = 0; k < iNumExtraSamples; k++) {
                                    if(pExtraSamplesValues[k] === 1) {
                                        fOpacity = pPixelSamples[3 + k] / 256;
                                        break;
                                    }
                                }
                            }
                            switch(iPhotometricInterpretation) {
                                case 0: {
                                    var iInvertValue = Math.pow(16, pBytesPerSampleValues[0] * 2);
                                    pPixelSamples.forEach(function (sample, index, samples) {
                                        samples[index] = iInvertValue - sample;
                                    });

                                }
                                case 1: {
                                    iRed = iGreen = iBlue = pPixelSamples[0];
                                    break;

                                }
                                case 2: {
                                    iRed = pPixelSamples[0];
                                    iGreen = pPixelSamples[1];
                                    iBlue = pPixelSamples[2];
                                    break;

                                }
                                case 3: {
                                    if(pColorMapValues === undefined) {
                                        akra.error("Palette image missing color map");
                                    }
                                    var iColorMapIndex = pPixelSamples[0];
                                    iRed = Math.floor(pColorMapValues[iColorMapIndex] / 256);
                                    iGreen = Math.floor(pColorMapValues[iColorMapSampleSize + iColorMapIndex] / 256);
                                    iBlue = Math.floor(pColorMapValues[(2 * iColorMapSampleSize) + iColorMapIndex] / 256);
                                    break;

                                }
                                case 4: {
                                    break;

                                }
                                case 5: {
                                    break;

                                }
                                case 6: {
                                    break;

                                }
                                case 8: {
                                    break;

                                }
                                default: {
                                    break;

                                }
                            }
                        }
                    }
                    iNumRowsInPreviousStrip = iNumRowsInStrip;
                }
            }
            return null;
        };
        Object.defineProperty(TIFFReader.prototype, "canvas", {
            get: function () {
                return this.pCanvas;
            },
            enumerable: true,
            configurable: true
        });
        TIFFReader.prototype.getBytes = function (iNumBytes, iOffset) {
            if(iNumBytes <= 0) {
                akra.trace(iNumBytes, iOffset);
                akra.error("No bytes requested");
            } else {
                if(iNumBytes <= 1) {
                    return this.pTiffDataView.getUint8(iOffset);
                } else {
                    if(iNumBytes <= 2) {
                        return this.pTiffDataView.getUint16(iOffset, this.bLittleEndian);
                    } else {
                        if(iNumBytes <= 3) {
                            return this.pTiffDataView.getUint32(iOffset, this.bLittleEndian) >>> 8;
                        } else {
                            if(iNumBytes <= 4) {
                                return this.pTiffDataView.getUint32(iOffset, this.bLittleEndian);
                            } else {
                                akra.trace(iNumBytes, iOffset);
                                akra.error("Too many bytes requested");
                            }
                        }
                    }
                }
            }
            return 0;
        };
        TIFFReader.prototype.getFieldTagName = function (iFieldTag) {
            var sFieldTagName;
            var sFieldTag = String(iFieldTag);
            if(sFieldTag in TIFF_FIELD_TAG_NAMES) {
                sFieldTagName = TIFF_FIELD_TAG_NAMES[sFieldTag];
            } else {
                akra.warning("Unknown Field Tag:", iFieldTag);
                sFieldTagName = "Tag" + iFieldTag;
            }
            return sFieldTagName;
        };
        TIFFReader.prototype.getFieldTypeName = function (iFieldType) {
            var sFieldTypeName;
            var sFieldType = String(iFieldType);
            if(sFieldType in TIFF_FIELD_TYPE_NAMES) {
                sFieldTypeName = TIFF_FIELD_TYPE_NAMES[sFieldType];
            }
            return sFieldTypeName;
        };
        TIFFReader.prototype.getFieldTypeLength = function (sFeildTypeName) {
            var iFieldTypeLength;
            if([
                'BYTE', 
                'ASCII', 
                'SBYTE', 
                'UNDEFINED'
            ].indexOf(sFeildTypeName) !== -1) {
                iFieldTypeLength = 1;
            } else {
                if([
                    'SHORT', 
                    'SSHORT'
                ].indexOf(sFeildTypeName) !== -1) {
                    iFieldTypeLength = 2;
                } else {
                    if([
                        'LONG', 
                        'SLONG', 
                        'FLOAT'
                    ].indexOf(sFeildTypeName) !== -1) {
                        iFieldTypeLength = 4;
                    } else {
                        if([
                            'RATIONAL', 
                            'SRATIONAL', 
                            'DOUBLE'
                        ].indexOf(sFeildTypeName) !== -1) {
                            iFieldTypeLength = 8;
                        }
                    }
                }
            }
            return iFieldTypeLength;
        };
        TIFFReader.prototype.getFieldValues = function (sFieldTagName, sFieldTypeName, iTypeCount, iValueOffset) {
            var pFieldValues = [];
            var iFieldTypeLength = this.getFieldTypeLength(sFieldTypeName);
            var iFieldValueSize = iFieldTypeLength * iTypeCount;
            var iValue;
            if(iFieldValueSize <= 4) {
                if(this.bLittleEndian === false) {
                    iValue = iValueOffset >>> ((4 - iFieldTypeLength) * 8);
                } else {
                    iValue = iValueOffset;
                }
                pFieldValues.push(iValue);
            } else {
                for(var i = 0; i < iTypeCount; i++) {
                    var iIndexOffset = iFieldTypeLength * i;
                    if(iFieldTypeLength >= 8) {
                        if([
                            'RATIONAL', 
                            'SRATIONAL'
                        ].indexOf(sFieldTypeName) !== -1) {
                            pFieldValues.push(this.getBytes(4, iValueOffset + iIndexOffset));
                            pFieldValues.push(this.getBytes(4, iValueOffset + iIndexOffset + 4));
                        } else {
                            akra.trace(sFieldTypeName, iTypeCount, iFieldValueSize);
                            akra.error("Can't handle this field type or size");
                        }
                    } else {
                        pFieldValues.push(this.getBytes(iFieldTypeLength, iValueOffset + iIndexOffset));
                    }
                }
            }
            if(sFieldTypeName === 'ASCII') {
                pFieldValues.forEach(function (e, i, a) {
                    a[i] = String.fromCharCode(e);
                });
            }
            return pFieldValues;
        };
        TIFFReader.prototype.parseFileDirectory = function (iByteOffset) {
            var iNumDirEntries = this.getBytes(2, iByteOffset);
            var pTiffFields = [];
            for(var i = iByteOffset + 2, iEntryCount = 0; iEntryCount < iNumDirEntries; i += 12 , iEntryCount++) {
                var iFieldTag = this.getBytes(2, i);
                var iFieldType = this.getBytes(2, i + 2);
                var iTypeCount = this.getBytes(4, i + 4);
                var iValueOffset = this.getBytes(4, i + 8);
                var sFieldTagName = this.getFieldTagName(iFieldTag);
                var sFieldTypeName = this.getFieldTypeName(iFieldType);
                var pFieldValues = this.getFieldValues(sFieldTagName, sFieldTypeName, iTypeCount, iValueOffset);
                pTiffFields[sFieldTagName] = {
                    'type': sFieldTypeName,
                    'values': pFieldValues
                };
            }
            this.pFileDirectories.push(pTiffFields);
            var iNextIFDByteOffset = this.getBytes(4, i);
            if(iNextIFDByteOffset === 0) {
                return this.pFileDirectories;
            }
            return this.parseFileDirectory(iNextIFDByteOffset);
        };
        return TIFFReader;
    })();
    akra.TIFFReader = TIFFReader;    
})(exports.akra || (exports.akra = {}));


