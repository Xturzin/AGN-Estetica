import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  className?: string;
}

export function Skeleton({ width = "100%", height = 16, radius = 6, className }: SkeletonProps) {
  return (
    <span
      className={`${styles.skeleton} ${className ?? ""}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: typeof radius === "number" ? `${radius}px` : radius,
      }}
    />
  );
}

export function SkeletonRows({ count = 3, height = 16, gap = 10 }: { count?: number; height?: number; gap?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height={height} />
      ))}
    </div>
  );
}