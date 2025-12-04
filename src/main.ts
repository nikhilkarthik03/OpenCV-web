import { OpenCVwasm } from "./opencv";
import { CameraManager } from "./renderer/camera";
import { FPSTracker } from "./utils/fps-tracker";

async function main() {
  const fpsValue = document.querySelector(".fps-value") as HTMLElement;
  const video = document.getElementById("video") as HTMLVideoElement;

  const cvLoader = new OpenCVwasm();

  const camera = new CameraManager(video);
  await camera.start();

  const fpsTracker = new FPSTracker(fpsValue);

  await cvLoader.startProcessingLoop(video, fpsTracker);
}

main();
