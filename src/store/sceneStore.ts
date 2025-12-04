import { create } from 'zustand';
import { HandData, GestureData } from '../types/hand.types';
import { SceneData, Volume } from '../types/scene.types';

interface SceneStore {
  // Hand tracking data
  handData: HandData[];
  isTrackingHands: boolean;
  
  // Scene detection data
  sceneData: SceneData | null;
  isScanningScene: boolean;
  
  // Gesture recognition
  detectedGestures: GestureData[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setHandData: (data: HandData[]) => void;
  setTrackingHands: (tracking: boolean) => void;
  setSceneData: (data: SceneData) => void;
  setScanningScene: (scanning: boolean) => void;
  setDetectedGestures: (gestures: GestureData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed values
  getLeftHand: () => HandData | undefined;
  getRightHand: () => HandData | undefined;
  hasDetectedSuitcase: () => boolean;
  getSuitcaseVolume: () => Volume | undefined;
}

export const useSceneStore = create<SceneStore>((set, get) => ({
  handData: [],
  isTrackingHands: false,
  sceneData: null,
  isScanningScene: false,
  detectedGestures: [],
  isLoading: false,
  error: null,

  setHandData: (data) => set({ handData: data }),
  setTrackingHands: (tracking) => set({ isTrackingHands: tracking }),
  setSceneData: (data) => set({ sceneData: data }),
  setScanningScene: (scanning) => set({ isScanningScene: scanning }),
  setDetectedGestures: (gestures) => set({ detectedGestures: gestures }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getLeftHand: () => {
    const state = get();
    return state.handData.find(hand => hand.handType === 'left');
  },

  getRightHand: () => {
    const state = get();
    return state.handData.find(hand => hand.handType === 'right');
  },

  hasDetectedSuitcase: () => {
    const state = get();
    if (!state.sceneData) return false;
    return state.sceneData.volumes.some(volume => 
      volume.label === 'suitcase' || volume.label === 'storage'
    );
  },

  getSuitcaseVolume: () => {
    const state = get();
    if (!state.sceneData) return undefined;
    return state.sceneData.volumes.find(volume => 
      volume.label === 'suitcase' || volume.label === 'storage'
    );
  },
}));