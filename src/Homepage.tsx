import { invoke } from "@tauri-apps/api/core";
import { useNavigate } from "react-router-dom";
import { Redirect, Switch } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const openExternal = async () => {
    await invoke("open_external_window");
  };

  const openCustomWindow = async () => {
    try {
      // Generate a unique label (e.g., timestamp + random number)
      const label = `window-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await invoke("open_custom_window", {
        label,
        path: "/products/electronics/123?page=5&sort=name-asc",
      });
    } catch (error) {
      console.error("Error opening window:", error);
    }
  };

  const complexNavigation = () => {
    // Both path and query parameters
    navigate({
      pathname: "/products/electronics/123",
      search: "?page=5&sort=name-asc",
    });
  };

  return (
    <div>
      <h1>Home Page (Main Window)</h1>

      <button onClick={openExternal}>Open External Page in New Window</button>
      <button onClick={() => complexNavigation()}>Search Laptops</button>
      <button onClick={openCustomWindow}>Custom Window</button>
      <Switch>
        {/* other routes */}
        <Redirect exact from="/" to="/login" />
      </Switch>
    </div>
  );
}
