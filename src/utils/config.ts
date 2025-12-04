export class Config {
  static readonly DEFAULT_IMAGE_URL: string =
    "https://storage.googleapis.com/zingcam/flam/app/misc/tota.jpeg";

  static readonly DEFAULT_VIDEO_URL: string =
    "https://zingcam.cdn.flamapp.com/original/videos/k206fn7phs46f4bpp2wdosrz.MP4";

  static readonly FPS_UPDATE_INTERVAL: number = 0.5; // seconds

  static readonly FPS_THRESHOLDS: { LOW: number; MEDIUM: number } = {
    LOW: 20,
    MEDIUM: 40,
  };
}
