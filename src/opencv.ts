export class OpenCVwasm {
  private ready: Promise<void>;
  private module: any;

  constructor() {
    this.ready = this.initialize();
  }

  private async initialize(): Promise<void> {
    // Wait until the HTML bootstraps OpenCV
    await (window as any).cvReadyPromise;

    this.module = (window as any).cv;

    if (!this.module || !this.module.Mat) {
      throw new Error("OpenCV module did not initialize properly");
    }

    console.log("OpenCV WASM initialized (wrapper)");
  }

  async waitReady() {
    return this.ready;
  }

  get cv() {
    return this.module;
  }
}
