export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface Plane {
  id: string;
  normal: Vector3D;
  center: Vector3D;
  size: { width: number; height: number };
  label: 'floor' | 'wall' | 'ceiling' | 'table';
  confidence: number;
}

export interface Volume {
  id: string;
  center: Vector3D;
  size: { width: number; height: number; depth: number };
  label: 'suitcase' | 'box' | 'storage' | 'furniture';
  confidence: number;
  bounds: {
    min: Vector3D;
    max: Vector3D;
  };
}

export interface SceneData {
  planes: Plane[];
  volumes: Volume[];
  timestamp: number;
  isScanning: boolean;
}