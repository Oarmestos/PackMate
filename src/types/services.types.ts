import { HandData } from './hand.types';
import { Plane, Volume } from './scene.types';
import { GestureData } from './hand.types';

export interface NativeBridgeInterface {
  startPassthrough(): Promise<boolean>;
  stopPassthrough(): Promise<boolean>;
  getHandJoints(): Promise<HandData[]>;
  getScenePlanes(): Promise<Plane[]>;
  getSceneVolumes(): Promise<Volume[]>;
  isSupported(): Promise<boolean>;
}

export interface AudioServiceInterface {
  playSound(type: 'success' | 'error' | 'click' | 'drop'): void;
  setVolume(volume: number): void;
  mute(): void;
  unmute(): void;
}

export interface GestureRecognitionInterface {
  detectGestures(handData: HandData[]): GestureData[];
  calibrate(): void;
  setSensitivity(sensitivity: number): void;
}