export enum DeviceMode {
  Desktop = "desktop",
  Mobile = "mobile",
}

export class CameraManager {
  private mode: DeviceMode;
  constructor(private video: HTMLVideoElement) {
    this.video.autoplay = true;
    this.video.muted = true;
    this.video.playsInline = true;
    this.mode = this.detectMode();
  }

  private detectMode(): DeviceMode {
    const ua = navigator.userAgent.toLowerCase();
    if (/mobi|android|iphone|ipad|ipod/.test(ua)) {
      return DeviceMode.Mobile;
    }
    return DeviceMode.Desktop;
  }

  async start(): Promise<void> {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    const STD_MIN_DIM = 300;

    // const screenRatio = STD_MIN_DIM / screenW;

    const width = this.mode === DeviceMode.Mobile ? screenH : screenW;
    const height = this.mode === DeviceMode.Mobile ? screenW : screenH;

    const constraints = {
      video: {
        facingMode: { ideal: "environment" },
        width,
        height,
      },
      audio: false,
    };

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
    }

    this.video.srcObject = stream;

    Object.assign(this.video.style, {
      width: "100vw",
      height: "100vh",
      objectFit: "cover",
      position: "fixed",
      top: "0",
      left: "0",
      zIndex: "-1",
    });

    await this.video.play();

    await new Promise<void>((resolve) => {
      if (this.video.videoWidth > 0) resolve();
      this.video.onloadedmetadata = () => resolve();
    });
  }
}
