export function serializeFeatures(keypoints: any, descriptors: any) {
  const arr = [];

  for (let i = 0; i < keypoints.size(); i++) {
    const kp = keypoints.get(i);
    arr.push({
      x: kp.pt.x,
      y: kp.pt.y,
      size: kp.size,
      angle: kp.angle,
      response: kp.response,
      octave: kp.octave,
      class_id: kp.class_id,
    });
  }

  return JSON.stringify({
    keypoints: arr,
    rows: descriptors.rows,
    cols: descriptors.cols,
    data: Array.from(descriptors.data),
  });
}

export function deserializeFeatures(cv: any, json: string) {
  const obj = JSON.parse(json);

  const keypoints = new cv.KeyPointVector();

  for (const kp of obj.keypoints) {
    keypoints.push_back({
      pt: { x: kp.x, y: kp.y },
      size: kp.size,
      angle: kp.angle,
      response: kp.response,
      octave: kp.octave ?? 0,
      class_id: kp.class_id ?? -1,
    });
  }

  const descriptors = new cv.Mat(obj.rows, obj.cols, cv.CV_8U);
  descriptors.data.set(obj.data);

  return { keypoints, descriptors };
}
