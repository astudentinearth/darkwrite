import { useAppSelector } from "@/features/store/hooks";
import { selectFonts } from "../store/theme-selectors";

export default function useFonts() {
  const fonts = useAppSelector(selectFonts);
  return fonts;
}
