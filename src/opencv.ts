import { computeReferenceFeatures } from "./image-processing/query-processing";
import { drawKeypointsWithAngle } from "./renderer/draw";
import { Config } from "./utils/config";
import type { FPSTracker } from "./utils/fps-tracker";

export class OpenCVwasm {
  private ready: Promise<void>;
  private cv: any;

  constructor() {
    this.ready = this.initialize();
  }

  /* ------------------------------------------------------
     🚀 Initialize OpenCV WASM module
  -------------------------------------------------------*/
  private async initialize(): Promise<void> {
    await (window as any).cvReadyPromise;

    this.cv = (window as any).cv;
    if (!this.cv || !this.cv.Mat) {
      throw new Error("OpenCV module initialization failed");
    }

    console.log("OpenCV WASM Ready ✔");
  }

  async waitReady() {
    return this.ready;
  }

  private async processQueryImage() {
    const queryImage = new Image();
    queryImage.src = Config.DEFAULT_IMAGE_URL;
    queryImage.crossOrigin = "anonymous";

    queryImage.onload = async () => {
      const refFeatures = await computeReferenceFeatures(this.cv, queryImage);
      console.log("Reference features:", refFeatures);
    };
  }

  /* ------------------------------------------------------
     🟣 Compute processing resolution from STD_MIN_DIM
  -------------------------------------------------------*/
  private computeProcessingSize() {
    const MIN = Config.STD_MIN_DIM;
    const sw = window.innerWidth;
    const sh = window.innerHeight;

    // Determine which side is smaller
    if (sw < sh) {
      // Portrait
      const scale = MIN / sw;
      return {
        PROC_W: MIN,
        PROC_H: Math.round(sh * scale),
      };
    } else {
      // Landscape
      const scale = MIN / sh;
      return {
        PROC_W: Math.round(sw * scale),
        PROC_H: MIN,
      };
    }
  }

  /* ------------------------------------------------------
     🎞️ Internal: One frame processing (on procCanvas)
  -------------------------------------------------------*/
  private processFrame(
    video: HTMLVideoElement,
    viewCtx: CanvasRenderingContext2D,
    procCtx: CanvasRenderingContext2D,
    fps: FPSTracker,
    state: any,
    PROC_W: number,
    PROC_H: number,
    viewCanvas: HTMLCanvasElement
  ) {
    const { cv, src, gray, rgba, keypoints, descriptors, detector } = state;

    // Draw camera onto low-res processing canvas
    procCtx.drawImage(
      video,
      0,
      0,
      video.videoWidth,
      video.videoHeight,
      0,
      0,
      PROC_W,
      PROC_H
    );

    // Read pixels → WASM
    const imgData = procCtx.getImageData(0, 0, PROC_W, PROC_H);
    src.data.set(imgData.data);

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.cvtColor(gray, rgba, cv.COLOR_GRAY2RGBA);

    detector.detectAndCompute(gray, new cv.Mat(), keypoints, descriptors);

    /* ------------------------------------------------------
       DRAW VIEW CANVAS (HD)
    -------------------------------------------------------*/
    viewCtx.drawImage(
      video,
      0,
      0,
      video.videoWidth,
      video.videoHeight,
      0,
      0,
      viewCanvas.width,
      viewCanvas.height
    );

    /* ------------------------------------------------------
       UPSCALE keypoints → HD canvas
    -------------------------------------------------------*/
    const sx = viewCanvas.width / PROC_W;
    const sy = viewCanvas.height / PROC_H;

    for (let i = 0; i < keypoints.size(); i++) {
      const kp = keypoints.get(i);
      drawKeypointsWithAngle(
        viewCtx,
        {
          size: () => 1,
          get: () => ({
            pt: { x: kp.pt.x * sx, y: kp.pt.y * sy },
            angle: kp.angle,
          }),
        },
        "yellow"
      );
    }

    fps.update();
  }

  /* ------------------------------------------------------
     🟡 Start processing loop
  -------------------------------------------------------*/
  public async startProcessingLoop(
    video: HTMLVideoElement,
    fpsTracker: FPSTracker
  ) {
    await this.waitReady();
    await this.processQueryImage();

    const cv = this.cv;

    // Wait for video metadata
    await new Promise<void>((resolve) => {
      if (video.videoWidth > 0) return resolve();
      video.onloadedmetadata = () => resolve();
    });

    /* ------------------------------------------------------
       VIEW CANVAS (full screen)
    -------------------------------------------------------*/
    const viewCanvas = document.getElementById("canvas") as HTMLCanvasElement;

    const viewCtx = viewCanvas.getContext("2d")!;
    viewCanvas.width = window.innerWidth;
    viewCanvas.height = window.innerHeight;

    /* ------------------------------------------------------
       PROCESSING CANVAS (hidden, reduced resolution)
    -------------------------------------------------------*/
    const procCanvas = document.createElement("canvas");
    const procCtx = procCanvas.getContext("2d", { willReadFrequently: true })!;

    const { PROC_W, PROC_H } = this.computeProcessingSize();
    procCanvas.width = PROC_W;
    procCanvas.height = PROC_H;

    console.log("Processing canvas:", PROC_W, "x", PROC_H);

    /* ------------------------------------------------------
       Allocate Mats once
    -------------------------------------------------------*/
    const state = {
      cv,
      src: new cv.Mat(PROC_H, PROC_W, cv.CV_8UC4),
      gray: new cv.Mat(PROC_H, PROC_W, cv.CV_8UC1),
      rgba: new cv.Mat(PROC_H, PROC_W, cv.CV_8UC4),
      keypoints: new cv.KeyPointVector(),
      descriptors: new cv.Mat(),
      detector:
        Config.DETECTOR === "BRISK"
          ? new cv.BRISK(60, 0)
          : new cv.ORB(800, 1.2, 1, 31, 0, 2, cv.ORB_HARRIS_SCORE, 31, 20),
    };

    /* ------------------------------------------------------
       Animation loop
    -------------------------------------------------------*/
    const loop = () => {
      this.processFrame(
        video,
        viewCtx,
        procCtx,
        fpsTracker,
        state,
        PROC_W,
        PROC_H,
        viewCanvas
      );
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}
