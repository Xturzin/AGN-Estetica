import React from "react";

export const ICONS: Record<string, string> = {
  dashboard: "M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 13h7v7H4z",
  calendar: "M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 9.5h16M8 3v4M16 3v4",
  calendarCheck: "M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 9.5h16M8 3v4M16 3v4M9 15l2 2 4-4",
  check: "M5 12.5l4.2 4.2L19 7",
  checkCircle: "M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9zM8.5 12l2.5 2.5L16 9",
  users: "M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M20 19v-1.4a3.5 3.5 0 0 0-2.6-3.4M15.5 4.2a3.5 3.5 0 0 1 0 6.6",
  user: "M18 19.5v-1.5a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v1.5M12 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7",
  fileText: "M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9zM13 3v6h6M9 13h6M9 17h6",
  clipboard: "M9 4h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 12h6M9 16h4",
  image: "M4 5.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 16l4.5-4 3 2.5L15 10l5 5M8.5 9.5a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8",
  settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 14a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 0 1-4 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.4 14H3a2 2 0 0 1 0-4h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 4.6V4a2 2 0 0 1 4 0v.2a1.6 1.6 0 0 0 2.8 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.8h.3a2 2 0 0 1 0 4h-.2a1.6 1.6 0 0 0-1.3.9z",
  plus: "M12 5v14M5 12h14",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  bell: "M18 8.5a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0",
  chevronRight: "M9 5l7 7-7 7",
  chevronLeft: "M15 5l-7 7 7 7",
  chevronDown: "M5 9l7 7 7-7",
  chevronUp: "M5 15l7-7 7 7",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3.5 2",
  phone: "M16.5 21a16 16 0 0 1-14-14 2 2 0 0 1 2-2.2H7a1.5 1.5 0 0 1 1.5 1.3c.1.9.3 1.8.6 2.6a1.5 1.5 0 0 1-.4 1.6L7.5 11.5a13 13 0 0 0 5 5l1.2-1.2a1.5 1.5 0 0 1 1.6-.4c.8.3 1.7.5 2.6.6A1.5 1.5 0 0 1 19 17z",
  mail: "M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 7l8 6 8-6",
  mapPin: "M19 10c0 5.5-7 11-7 11s-7-5.5-7-11a7 7 0 0 1 14 0zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
  paperclip: "M20 11.5l-8.4 8.4a5 5 0 0 1-7-7l8.3-8.4a3.3 3.3 0 0 1 4.7 4.7l-8.4 8.3a1.7 1.7 0 0 1-2.3-2.3l7.7-7.8",
  upload: "M21 15v3.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V15M16 8l-4-4-4 4M12 4v12",
  download: "M21 15v3.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V15M8 11l4 4 4-4M12 15V3",
  sliders: "M4 7h10M18 7h2M4 17h2M10 17h10M14 4.5v5M6 14.5v5",
  logout: "M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3M16 16l4-4-4-4M20 12H9",
  moreH: "M5 12h.01M12 12h.01M19 12h.01",
  edit: "M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z",
  camera: "M4 8.5a2 2 0 0 1 2-2h1.5l1.2-2h6.6l1.2 2H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7",
  x: "M6 6l12 12M18 6L6 18",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  arrowUpRight: "M7 17L17 7M8 7h9v9",
  pulse: "M3 12h4l2.5-7 4 14L17 12h4",
  filter: "M3 5h18l-7 8.5V20l-4-2v-4.5z",
  shield: "M12 3l7 2.5v5c0 4.5-3 8.4-7 10.5-4-2.1-7-6-7-10.5v-5z",
  droplet: "M12 3.5s6 5.6 6 10.5a6 6 0 0 1-12 0c0-4.9 6-10.5 6-10.5z",
  alert: "M12 8v5M12 16.5h.01M10.3 3.9 2.4 18a1.9 1.9 0 0 0 1.7 2.9h15.8a1.9 1.9 0 0 0 1.7-2.9L13.7 3.9a1.9 1.9 0 0 0-3.4 0z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z",
  home: "M4 11l8-7 8 7M6 9.5V20h12V9.5",
  heart: "M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5c-2.2 4.6-9.2 9-9.2 9z",
  list: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM13 13h7v7h-7zM4 13h7v7H4z",
  folder: "M4 7a2 2 0 0 1 2-2h3.5l2 2.5H18a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z",
  filePdf: "M13 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9zM13 3v6h6",
  send: "M21 4L3 11l7 3 3 7z",
  dot: "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2",
  trendUp: "M3 17l6-6 4 4 8-8M15 7h6v6",
  refresh: "M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4",
  lock: "M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1zM8 11V8a4 4 0 0 1 8 0v3",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
  message: "M21 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-5.4A8 8 0 1 1 21 11.5z",
  scissors: "M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM8.7 8 20 18M14 10l6-5M8.7 16 12 13.5",
};

interface IconProps {
  name: string;
  size?: number;
  sw?: number;
  color?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, size = 20, sw = 1.6, color = "currentColor", style }: IconProps) {
  const d = ICONS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "0 0 auto", display: "block", ...style }}
    >
      {d.split("M").filter(Boolean).map((seg, i) => <path key={i} d={"M" + seg} />)}
    </svg>
  );
}

export default Icon;