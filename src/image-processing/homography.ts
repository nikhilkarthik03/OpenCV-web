export function computeHomography(
  cv: any,
  kpCam: any,
  kpRef: any,
  matches: any[]
) {
  if (matches.length < 4) return null;

  const ptsCam = [];
  const ptsRef = [];

  matches.forEach((m) => {
    ptsCam.push(kpCam.get(m.queryIdx).pt);
    ptsRef.push(kpRef.get(m.trainIdx).pt);
  });

  const camMat = cv.matFromArray(
    ptsCam.length,
    1,
    cv.CV_32FC2,
    ptsCam.flatMap((p) => [p.x, p.y])
  );
  const refMat = cv.matFromArray(
    ptsRef.length,
    1,
    cv.CV_32FC2,
    ptsRef.flatMap((p) => [p.x, p.y])
  );

  const mask = new cv.Mat();
  const H = cv.findHomography(camMat, refMat, cv.RANSAC, 5, mask);

  camMat.delete();
  refMat.delete();
  mask.delete();

  return H;
}
