import { Config } from "../utils/config";

export async function computeReferenceFeatures(
  cv: any,
  imgEl: HTMLImageElement
) {
  const imgRGBA = cv.imread(imgEl);
  const imgGray = new cv.Mat();
  cv.cvtColor(imgRGBA, imgGray, cv.COLOR_RGBA2GRAY);

  const keypoints = new cv.KeyPointVector();
  const descriptors = new cv.Mat();

  const detector = Config.DETECTOR === "BRISK" ? new cv.BRISK() : new cv.ORB();
  detector.detectAndCompute(imgGray, new cv.Mat(), keypoints, descriptors);

  imgGray.delete();
  imgRGBA.delete();
  detector.delete();

  return { keypoints, descriptors };
}
