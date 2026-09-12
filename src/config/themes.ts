export interface Theme {
  name: string;
  colors: {
    primary: string;
    "primary-light": string;
    "primary-dark": string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    "text-primary": string;
    "text-secondary": string;
    error: string;
  };
}

export const themes: Record<string, Theme> = {
  ocean: {
    name: "Ocean",
    colors: {
      primary: "#0284c7",
      "primary-light": "#38bdf8",
      "primary-dark": "#075985",
      secondary: "#0ea5e9",
      accent: "#67e8f9",
      background: "#f0f9ff",
      surface: "#ffffff",
      "text-primary": "#0c4a6e",
      "text-secondary": "#64748b",
      error: "#ef4444",
    },
  },
  forest: {
    name: "Forest",
    colors: {
      primary: "#059669",
      "primary-light": "#34d399",
      "primary-dark": "#065f46",
      secondary: "#10b981",
      accent: "#6ee7b7",
      background: "#f0fdf4",
      surface: "#ffffff",
      "text-primary": "#064e3b",
      "text-secondary": "#6b7280",
      error: "#ef4444",
    },
  },
  sunset: {
    name: "Sunset",
    colors: {
      primary: "#ea580c",
      "primary-light": "#fb923c",
      "primary-dark": "#c2410c",
      secondary: "#f97316",
      accent: "#fdba74",
      background: "#fff7ed",
      surface: "#ffffff",
      "text-primary": "#431407",
      "text-secondary": "#78716c",
      error: "#ef4444",
    },
  },
  lavender: {
    name: "Lavender",
    colors: {
      primary: "#7c3aed",
      "primary-light": "#a78bfa",
      "primary-dark": "#5b21b6",
      secondary: "#8b5cf6",
      accent: "#c4b5fd",
      background: "#f5f3ff",
      surface: "#ffffff",
      "text-primary": "#2e1065",
      "text-secondary": "#6b7280",
      error: "#ef4444",
    },
  },
  rose: {
    name: "Rose",
    colors: {
      primary: "#e11d48",
      "primary-light": "#fb7185",
      "primary-dark": "#9f1239",
      secondary: "#f43f5e",
      accent: "#fda4af",
      background: "#fff1f2",
      surface: "#ffffff",
      "text-primary": "#4c0519",
      "text-secondary": "#71717a",
      error: "#ef4444",
    },
  },
  slate: {
    name: "Slate",
    colors: {
      primary: "#475569",
      "primary-light": "#94a3b8",
      "primary-dark": "#1e293b",
      secondary: "#64748b",
      accent: "#cbd5e1",
      background: "#f8fafc",
      surface: "#ffffff",
      "text-primary": "#0f172a",
      "text-secondary": "#64748b",
      error: "#ef4444",
    },
  },
  midnight: {
    name: "Midnight",
    colors: {
      primary: "#3730a3",
      "primary-light": "#6366f1",
      "primary-dark": "#1e1b4b",
      secondary: "#4f46e5",
      accent: "#a5b4fc",
      background: "#eef2ff",
      surface: "#ffffff",
      "text-primary": "#1e1b4b",
      "text-secondary": "#6b7280",
      error: "#ef4444",
    },
  },
};

export const defaultTheme = "ocean";

export function applyTheme(themeName: string): void {
  const theme = themes[themeName] || themes[defaultTheme];
  const root = document.documentElement;

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
}
