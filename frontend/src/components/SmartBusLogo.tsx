interface SmartBusLogoProps {
  className?: string;
  size?: number;
}

export function SmartBusLogo({ className = "", size = 32 }: SmartBusLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Bus body */}
      <rect
        x="8"
        y="16"
        width="48"
        height="32"
        rx="6"
        fill="currentColor"
        className="text-primary"
      />
      
      {/* Bus windows */}
      <rect
        x="12"
        y="20"
        width="12"
        height="8"
        rx="2"
        fill="currentColor"
        className="text-background"
      />
      <rect
        x="26"
        y="20"
        width="12"
        height="8"
        rx="2"
        fill="currentColor"
        className="text-background"
      />
      <rect
        x="40"
        y="20"
        width="12"
        height="8"
        rx="2"
        fill="currentColor"
        className="text-background"
      />
      
      {/* Bus door */}
      <rect
        x="12"
        y="32"
        width="8"
        height="12"
        rx="2"
        fill="currentColor"
        className="text-background"
      />
      
      {/* Door handle */}
      <circle
        cx="18"
        cy="38"
        r="1"
        fill="currentColor"
        className="text-primary"
      />
      
      {/* Front lights */}
      <circle
        cx="52"
        cy="24"
        r="2"
        fill="currentColor"
        className="text-accent"
      />
      <circle
        cx="52"
        cy="32"
        r="2"
        fill="currentColor"
        className="text-accent"
      />
      
      {/* Wheels */}
      <circle
        cx="16"
        cy="50"
        r="6"
        fill="currentColor"
        className="text-muted-foreground"
      />
      <circle
        cx="48"
        cy="50"
        r="6"
        fill="currentColor"
        className="text-muted-foreground"
      />
      
      {/* Wheel centers */}
      <circle
        cx="16"
        cy="50"
        r="3"
        fill="currentColor"
        className="text-muted"
      />
      <circle
        cx="48"
        cy="50"
        r="3"
        fill="currentColor"
        className="text-muted"
      />
      
      {/* Smart tech indicator - WiFi symbol */}
      <path
        d="M32 12C36.4 12 40.4 13.6 43.6 16.4L42.2 17.8C39.4 15.4 35.8 14 32 14C28.2 14 24.6 15.4 21.8 17.8L20.4 16.4C23.6 13.6 27.6 12 32 12Z"
        fill="currentColor"
        className="text-primary"
      />
      <path
        d="M32 6C38.6 6 44.8 8.4 49.6 12.8L48.2 14.2C44 10.2 38.2 8 32 8C25.8 8 20 10.2 15.8 14.2L14.4 12.8C19.2 8.4 25.4 6 32 6Z"
        fill="currentColor"
        className="text-primary opacity-60"
      />
      <circle
        cx="32"
        cy="15"
        r="1.5"
        fill="currentColor"
        className="text-primary"
      />
    </svg>
  );
}