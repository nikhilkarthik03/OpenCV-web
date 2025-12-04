import { OpenCVwasm } from "./opencv";
import { CameraManager } from "./renderer/camera";
import { drawKeypointsWithAngle } from "./renderer/draw";
import { FPSTracker } from "./utils/fps-tracker";

async function startProcessingLoop(
  cv: any,
  video: HTMLVideoElement,
  fpsTracker: FPSTracker
) {
  // Wait until video metadata is loaded
  await new Promise<void>((resolve) => {
    if (video.videoWidth > 0 && video.videoHeight > 0) return resolve();
    video.onloadedmetadata = () => resolve();
  });

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Allocate Mats
  const src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
  const gray = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC1);
  const rgba = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
  const keypoints = new cv.KeyPointVector();
  const orb = new cv.ORB(
    800, // nfeatures
    1.2, // scaleFactor
    1, // nlevels
    31, // edgeThreshold
    0, // firstLevel
    2, // WTA_K
    cv.ORB_HARRIS_SCORE,
    31, // patchSize
    20 // fastThreshold
  );
  const brisk = new cv.BRISK(60, 0);

  const descriptors = new cv.Mat();

  function loop() {
    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    src.data.set(imageData.data);

    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.cvtColor(gray, rgba, cv.COLOR_GRAY2RGBA);

    // Run ORB
    // orb.detectAndCompute(gray, new cv.Mat(), keypoints, descriptors);
    brisk.detectAndCompute(gray, new cv.Mat(), keypoints, descriptors);

    // Write processed image
    imageData.data.set(rgba.data);
    ctx.putImageData(imageData, 0, 0);

    // Draw keypoints on top of grayscale
    drawKeypointsWithAngle(ctx, keypoints, "yellow");

    fpsTracker.update();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

async function main() {
  const fpsValue = document.querySelector(".fps-value") as HTMLElement;
  const video = document.getElementById("video") as HTMLVideoElement;

  const cvLoader = new OpenCVwasm();
  await cvLoader.waitReady();
  const cv = cvLoader.cv;

  const camera = new CameraManager(video);
  await camera.start();

  const fpsTracker = new FPSTracker(fpsValue);

  startProcessingLoop(cv, video, fpsTracker);
}

main();
