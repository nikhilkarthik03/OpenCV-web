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
  viewH: number
) {
  const sx = viewW / procW;
  const sy = viewH / procH;

  ctx.strokeStyle = "rgba(0,255,0,0.6)";
  ctx.lineWidth = 1;

  matches.forEach((m) => {
    const cam = kpCam.get(m.queryIdx); // camera point
    const ref = kpRef.get(m.trainIdx); // reference point (in reference image space)

    const x1 = cam.pt.x * sx;
    const y1 = cam.pt.y * sy;

    // NOTE:
    // We don’t draw ref.x/ref.y directly because reference image
    // isn’t displayed. Instead we draw a short line showing direction.

    const angle = Math.atan2(ref.pt.y - cam.pt.y, ref.pt.x - cam.pt.x);
    const len = 20;

    const x2 = x1 + Math.cos(angle) * len;
    const y2 = y1 + Math.sin(angle) * len;

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
