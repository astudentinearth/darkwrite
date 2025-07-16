import { useLocalStore } from "@/context/local-state";
import { useSettingsStore } from "@/context/settings-store";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useStartup = () => {
  const [actionPerformed, setActionPerformed] = useState(false);
  const setRoute = useLocalStore((s) => s.setRoute);
  const location = useLocation();
  const settingsInitialized = useSettingsStore((s) => s.initialized);
  const preference = useSettingsStore((s) => s.settings.startup.behavior);
  const nav = useNavigate();
  useEffect(() => {
    setRoute(location.pathname);
  }, [location.pathname]);
  useEffect(() => {
    if (!settingsInitialized) return; // we don't know the preference
    if (actionPerformed) return; // we already accomplished our duty.

    // we will read from localStorage manunally to perform startup action
    const localState = localStorage.getItem("local-state");
    if (!localState) return; // there is no state, we don't care
    const obj = _.attempt(() => JSON.parse(localState));
    if (obj instanceof Error) return; // we ignore whatever key that was
    if (!("state" in obj)) return;
    _.attempt(() => {
      const route = obj.state.route;
      if (!route) return;
      switch (preference) {
        case "HOME_PAGE": {
          nav("/");
          setActionPerformed(true);
          return;
        }
        case "LAST_SESSION": {
          nav(route);
          setActionPerformed(true);
          return;
        }
      }
    });
  }, [preference, settingsInitialized]);
};
