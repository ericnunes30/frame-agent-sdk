export class VisionNotSupportedError extends Error {
  public readonly name = 'VisionNotSupportedError';

  constructor(message = 'Model/provider does not support vision (image content)') {
    super(message);
  }
}

