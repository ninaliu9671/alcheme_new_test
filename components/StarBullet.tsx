type Props = {
  size?: number;
  className?: string;
};

export default function StarBullet({ size = 16, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M12 2.5l2.7 6.3 6.8.6-5.2 4.5 1.6 6.6L12 17l-5.9 3.5 1.6-6.6L2.5 9.4l6.8-.6L12 2.5z"
        fill="#E8B931"
        stroke="#0F0F0F"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
