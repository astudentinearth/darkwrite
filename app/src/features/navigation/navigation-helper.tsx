import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationEventBus } from "./navigator";

export default function NavigationHelper() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubcribe = NavigationEventBus.subscribe(
      "onRouteChanged",
      ({ data }) => {
        navigate(data);
      },
    );
    return () => {
      unsubcribe();
    };
  }, [navigate]);

  return <></>;
}
