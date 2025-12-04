export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface HandJoint {
  id: string;
  position: Vector3D;
  rotation: Vector3D;
  confidence: number;
}

export interface HandData {
  joints: HandJoint[];
  isTracked: boolean;
  handType: 'left' | 'right';
}

export interface GestureData {
  type: 'palm_open' | 'pinch' | 'fist' | 'point';
  confidence: number;
  handType: 'left' | 'right';
  timestamp: number;
}