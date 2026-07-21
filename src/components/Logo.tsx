interface LogoProps {
  size?: number;
}

// Placeholder shape (magnifier + rising bar chart) standing in for the final asset.
// Every stroke/fill uses currentColor so it always follows whatever color the wrapper
// tile sets, rather than carrying its own fixed hue — asset drop-in should keep that
// same convention so it stays on the app's cyan tone automatically.
export default function Logo({ size = 18 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.8" />
      <line
        x1="14.5"
        y1="14.5"
        x2="20"
        y2="20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="6.7" y="10" width="1.6" height="3" rx="0.4" fill="currentColor" />
      <rect x="9.2" y="8" width="1.6" height="5" rx="0.4" fill="currentColor" />
      <rect x="11.7" y="6" width="1.6" height="7" rx="0.4" fill="currentColor" />
    </svg>
  );
}
