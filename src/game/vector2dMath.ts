import { Vector2D } from "./components";

export const Vector2DMath = (() => {
  const sum = (A: Vector2D, B: Vector2D): Vector2D => {
    return new Vector2D(
      A.x + B.x,
      A.y + B.y
    )
  }
  const difference = (A: Vector2D, B: Vector2D): Vector2D => {
    return new Vector2D(
      A.x - B.x,
      A.y - B.y
    )
  }
  const scale = (A: Vector2D, s: number): Vector2D => {
    return new Vector2D(
      s * A.x,
      s * A.y
    )
  }
  const magnitude = (A: Vector2D): number => {
    return Math.sqrt(
      (A.x ** 2) + (A.y ** 2)
    )
  }
  const normalize = (A: Vector2D, s = 1): Vector2D => {
    if (!A.x && !A.y) {
      return A;
    }
    const mag = magnitude(A);
    return new Vector2D(
      s * A.x / mag,
      s * A.y / mag
    )
  }
  const distance = (A: Vector2D, B: Vector2D): number => {
    return magnitude(difference(A, B));
  }
  const distSquared = (A: Vector2D, B: Vector2D): number => {
    const { x, y } = difference(A, B);
    return (
      (x ** 2) + (y ** 2)
    )
  }
  const dotProduct = (A: Vector2D, B: Vector2D): number => {
    return (
      (A.x * B.x) + (A.y * B.y)
    )
  }
  const angleBetween = (A: Vector2D, B: Vector2D): number => {
    const dot = dotProduct(A, B);
    const A_mag = magnitude(A);
    const B_mag = magnitude(B);
    return Math.acos(
      dot / (A_mag * B_mag)
    )
  }

  return {
    sum,
    difference,
    scale,
    magnitude,
    normalize,
    distance,
    distSquared,
    dotProduct,
    angleBetween
  }
})();