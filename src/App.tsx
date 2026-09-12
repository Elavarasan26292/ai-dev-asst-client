import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { applyTheme, defaultTheme } from "./config/themes";

export default function App() {
  useEffect(() => {
    // Apply user's saved theme if logged in, otherwise default
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      applyTheme(user.theme || defaultTheme);
    } else {
      applyTheme(defaultTheme);
    }
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
