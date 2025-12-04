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
