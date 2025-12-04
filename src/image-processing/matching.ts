export function matchFeatures(cv: any, descCamera: any, descRef: any) {
  const matcher = new cv.BFMatcher(cv.NORM_HAMMING, true);
  const matches = new cv.DMatchVector();

  matcher.match(descCamera, descRef, matches);
  return matches;
}

export function filterMatches(matches: any, maxDist = 40) {
  const good: any[] = [];

  for (let i = 0; i < matches.size(); i++) {
    const m = matches.get(i);
    if (m.distance < maxDist) good.push(m);
  }
  return good;
}
