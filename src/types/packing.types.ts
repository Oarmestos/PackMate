export interface PackingItem {
  id: string;
  name: string;
  category: 'clothing' | 'documents' | 'electronics' | 'toiletries' | 'other';
  packed: boolean;
  position?: Vector3D;
  icon?: string;
  quantity?: number;
}

export interface PackingList {
  id: string;
  name: string;
  items: PackingItem[];
  createdAt: Date;
  updatedAt: Date;
  icon?: string;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}