import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";

const SHAKE_THRESHOLD = 2.5;
const SHAKE_DEBOUNCE_MS = 3000;

export function useShakeReport() {
  const lastShake = useRef(0);
  const lastPosition = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    let mounted = true;

    const startListening = async () => {
      try {
        const { Accelerometer } = await import("expo-sensors");
        const isAvailable = await Accelerometer.isAvailableAsync();
        if (!isAvailable || !mounted) return;

        subscription = Accelerometer.addListener(
          (data: { x: number; y: number; z: number }) => {
            const { x, y, z } = data;
            const { x: lx, y: ly, z: lz } = lastPosition.current;
            const dx = Math.abs(x - lx);
            const dy = Math.abs(y - ly);
            const dz = Math.abs(z - lz);

            lastPosition.current = { x, y, z };

            if (dx + dy + dz > SHAKE_THRESHOLD) {
              const now = Date.now();
              if (now - lastShake.current < SHAKE_DEBOUNCE_MS) return;
              lastShake.current = now;

              Alert.alert(
                "Shake detected!",
                "Would you like to report an issue or send feedback?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Report Issue",
                    onPress: () => {
                      WebBrowser.openBrowserAsync(
                        "https://github.com/prjctimg/learn-p5/issues"
                      );
                    },
                  },
                ]
              );
            }
          }
        );
      } catch {
        // expo-sensors not available, skip shake detection
      }
    };

    startListening();

    return () => {
      mounted = false;
      if (subscription) subscription.remove();
    };
  }, []);
}
