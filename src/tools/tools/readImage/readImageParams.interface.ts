export type ReadImageSource = 'path' | 'screen' | 'browser';

export interface ReadImageRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ReadImageParams {
  source: ReadImageSource;
  path?: string;
  region?: ReadImageRegion;
  detail?: 'low' | 'high' | 'auto';
  maxBytes?: number;
}

