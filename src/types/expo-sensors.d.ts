declare module "expo-sensors" {
  interface AccelerometerMeasurement {
    x: number;
    y: number;
    z: number;
  }
  export const Accelerometer: {
    isAvailableAsync(): Promise<boolean>;
    addListener(
      listener: (data: AccelerometerMeasurement) => void
    ): { remove: () => void };
    removeAllListeners(): void;
  };
}
