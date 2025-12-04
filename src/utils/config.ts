export class Config {
  static readonly DEFAULT_IMAGE_URL: string =
    // "https://storage.googleapis.com/zingcam/flam/app/misc/tota.jpeg";
    "https://storage.googleapis.com/bucket-fi-production-apps-0672ab2d/original/images/yj00exglip8d2hoa5h5cq3wa.png";

  static readonly DEFAULT_VIDEO_URL: string =
    "https://zingcam.cdn.flamapp.com/original/videos/k206fn7phs46f4bpp2wdosrz.MP4";

  static readonly FPS_UPDATE_INTERVAL: number = 0.5; // seconds

  static readonly DETECTOR: string = "ORB";

  static readonly STD_MIN_DIM: number = 300;

  static readonly FPS_THRESHOLDS: { LOW: number; MEDIUM: number } = {
    LOW: 20,
    MEDIUM: 40,
  };
}
