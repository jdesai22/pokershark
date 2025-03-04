import { Slot } from "expo-router";
import { TailwindProvider } from "tailwindcss-react-native";

export default function Layout() {
  return (
    <TailwindProvider>
      <Slot />
    </TailwindProvider>
  );
}
