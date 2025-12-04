// src/utils/fpsTracker.ts
import { Config } from "./config";

export class FPSTracker {
  private lastFrameTime = performance.now();
  private frameCount = 0;
  private fps = 0;
  private fpsUpdateInterval = Config.FPS_UPDATE_INTERVAL;
  private lastFpsUpdate = performance.now();
  private fpsValueElement: HTMLElement;

  constructor(fpsValueElement: HTMLElement) {
    this.fpsValueElement = fpsValueElement;
  }

  update(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    this.frameCount++;

    if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval * 1000) {
      this.fps = Math.round(
        (this.frameCount * 1000) / (currentTime - this.lastFpsUpdate)
      );
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;

      this.fpsValueElement.textContent = this.fps.toString();

      this.fpsValueElement.classList.remove("low", "medium");
      if (this.fps < Config.FPS_THRESHOLDS.LOW) {
        this.fpsValueElement.classList.add("low");
      } else if (this.fps < Config.FPS_THRESHOLDS.MEDIUM) {
        this.fpsValueElement.classList.add("medium");
      }
    }
  }

  getFPS(): number {
    return this.fps;
  }
}
