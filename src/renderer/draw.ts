export function drawKeypointsWithAngle(
  ctx: CanvasRenderingContext2D,
  keypoints: any,
  color = "yellow"
) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;

  const count = keypoints.size();

  for (let i = 0; i < count; i++) {
    const kp = keypoints.get(i);

    const x = kp.pt.x;
    const y = kp.pt.y;

    // Draw center dot
    ctx.fillRect(x - 1, y - 1, 2, 2);

    // Draw angle direction
    const angleRad = (kp.angle * Math.PI) / 180;
    const len = 8; // length of direction line

    const x2 = x + Math.cos(angleRad) * len;
    const y2 = y - Math.sin(angleRad) * len; // y is inverted in canvas

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

export function drawMatchLines(
  ctx: CanvasRenderingContext2D,
  kpCam: any,
  kpRef: any,
  matches: any[],
  procW: number,
  procH: number,
  viewW: number,
  viewH: number,
  refX: number,
  refY: number,
  refW: number,
  refH: number,
  refImgW: number,
  refImgH: number
) {
  const sxCam = viewW / procW;
  const syCam = viewH / procH;

  const sxRef = refW / refImgW; // scale reference keypoints into thumbnail
  const syRef = refH / refImgH;

  ctx.strokeStyle = "rgba(0,255,0,0.6)";
  ctx.lineWidth = 2;

  matches.forEach((m) => {
    const cam = kpCam.get(m.queryIdx);
    const ref = kpRef.get(m.trainIdx);

    // camera keypoint in full-screen canvas
    const x1 = cam.pt.x * sxCam;
    const y1 = cam.pt.y * syCam;

    // reference keypoint inside the thumbnail box
    const x2 = refX + ref.pt.x * sxRef;
    const y2 = refY + ref.pt.y * syRef;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });
}

export function drawHomography(
  ctx: CanvasRenderingContext2D,
  cv: any,
  H: any,
  w: number,
  h: number
) {
  const corners = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, w, 0, w, h, 0, h]);

  const projected = new cv.Mat();
  cv.perspectiveTransform(corners, projected, H);

  ctx.strokeStyle = "cyan";
  ctx.lineWidth = 3;

  ctx.beginPath();
  const arr = projected.data32F;

  ctx.moveTo(arr[0], arr[1]);
  ctx.lineTo(arr[2], arr[3]);
  ctx.lineTo(arr[4], arr[5]);
  ctx.lineTo(arr[6], arr[7]);
  ctx.closePath();
  ctx.stroke();

  corners.delete();
  projected.delete();
}
