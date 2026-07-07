export const MAP_CENTER = {
  lng: 48,
  lat: 27
};
export const MAP_SPAN = {
  lng: 70,
  lat: 38
}; // how wide/tall the view is in degrees
export const MAP_SIZE = {
  w: 2000,
  h: 1200
}; // internal SVG units

export function formatEta(min) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
export function projectLL(lng, lat) {
  const x = (lng - MAP_CENTER.lng) / MAP_SPAN.lng * MAP_SIZE.w + MAP_SIZE.w / 2;
  const y = -((lat - MAP_CENTER.lat) / MAP_SPAN.lat) * MAP_SIZE.h + MAP_SIZE.h / 2;
  return {
    x,
    y
  };
}
export const LAND_PATHS = ["M 38,24 L 42,33 L 48,36 L 55,38 L 60,33 L 59,27 L 54,22 L 48,19 L 42,20 Z", "M 28,40 L 35,42 L 42,41 L 44,38 L 42,35 L 38,34 L 34,35 L 30,37 Z", "M 26,31 L 32,33 L 35,30 L 34,25 L 30,22 L 25,23 L 23,27 Z", "M 44,33 L 52,36 L 58,35 L 62,32 L 60,28 L 54,27 L 48,28 L 45,30 Z", "M 66,30 L 72,28 L 76,23 L 74,18 L 69,17 L 66,21 L 65,26 Z", "M 40,14 L 46,15 L 48,11 L 45,8  L 41,10 Z"];
export function landPathToSvg(path) {
  return path.replace(/([ML])\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/g, (_, cmd, lng, lat) => {
    const p = projectLL(parseFloat(lng), parseFloat(lat));
    return `${cmd} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  });
}
