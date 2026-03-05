

type EulerRotation = {
  yawDeg: number; // rotation clockwise, degrees
};

type OverlayOptions = {
  scale?: number;
  opacity?: number;
  zIndex?: number;
  interactive?: boolean;
};

export function rotatedOverlayFromCenter(
  L: any,
  imageUrl: string,
  center: L.LatLngExpression,
  widthMeters: number,
  heightMeters: number,
  rotation: EulerRotation,
  options: OverlayOptions = {}
) {
  const scale = options.scale ?? 1;
  const yawRad = (rotation.yawDeg * Math.PI) / 180;

  const cx = L.latLng(center);

  // meters → degrees (approx, good for small areas)
  const metersPerDegLat = 111320;
  const metersPerDegLng =
    111320 * Math.cos((cx.lat * Math.PI) / 180);

  const hw = (widthMeters * scale) / 2;
  const hh = (heightMeters * scale) / 2;

  function rotate(dx: number, dy: number) {
    return {
      x: dx * Math.cos(yawRad) - dy * Math.sin(yawRad),
      y: dx * Math.sin(yawRad) + dy * Math.cos(yawRad),
    };
  }

  function offsetLatLng(dxMeters: number, dyMeters: number) {
    const r = rotate(dxMeters, dyMeters);
    return L.latLng(
      cx.lat + r.y / metersPerDegLat,
      cx.lng + r.x / metersPerDegLng
    );
  }

  const topLeft = offsetLatLng(-hw, hh);
  const topRight = offsetLatLng(hw, hh);
  const bottomLeft = offsetLatLng(-hw, -hh);

  return L.imageOverlay.rotated(
    imageUrl,
    topLeft,
    topRight,
    bottomLeft,
    {
      opacity: options.opacity ?? 0.8,
      zIndex: options.zIndex ?? 400,
      interactive: options.interactive ?? false,
    }
  );
}