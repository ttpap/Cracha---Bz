export default function Logo({ size = 56, className = "", ring = false }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.jpeg"
      alt="BZ"
      width={size}
      height={size}
      className={`rounded-full object-cover ${ring ? "ring-2 ring-white/70 shadow-md" : ""} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
