import { NativeBridgeInterface } from '../types/services.types';
import { HandData, HandJoint } from '../types/hand.types';
import { Plane, Volume, SceneData } from '../types/scene.types';

/**
 * Simulador del Meta Spatial SDK
 * Esta clase simula las funciones del Meta Spatial SDK para desarrollo sin hardware
 * En producción, esto se reemplazará con el módulo nativo real
 */
export class SpatialSDKSimulator implements NativeBridgeInterface {
  private isPassthroughActive = false;
  private isHandTrackingActive = false;
  private mockHandData: HandData[] = [];
  private mockSceneData: SceneData | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Datos simulados de manos
    this.mockHandData = [
      {
        handType: 'left',
        isTracked: true,
        joints: this.generateHandJoints('left'),
      },
      {
        handType: 'right',
        isTracked: true,
        joints: this.generateHandJoints('right'),
      },
    ];

    // Datos simulados de escena
    this.mockSceneData = {
      planes: [
        {
          id: 'floor-1',
          normal: { x: 0, y: 1, z: 0 },
          center: { x: 0, y: 0, z: 0 },
          size: { width: 2, height: 2 },
          label: 'floor',
          confidence: 0.95,
        },
      ],
      volumes: [
        {
          id: 'suitcase-1',
          center: { x: 0.5, y: 0.3, z: -1 },
          size: { width: 0.6, height: 0.4, depth: 0.3 },
          label: 'suitcase',
          confidence: 0.1, // Iniciar con baja confianza (no detectado)
          bounds: {
            min: { x: 0.2, y: 0.1, z: -1.15 },
            max: { x: 0.8, y: 0.5, z: -0.85 },
          },
        },
      ],
      timestamp: Date.now(),
      isScanning: false,
    };
  }

  private generateHandJoints(handType: 'left' | 'right'): HandJoint[] {
    const joints: HandJoint[] = [];
    const baseX = handType === 'left' ? -0.3 : 0.3;

    // Generar 21 articulaciones simuladas por mano
    for (let i = 0; i < 21; i++) {
      joints.push({
        id: `${handType}-joint-${i}`,
        position: {
          x: baseX + (Math.random() - 0.5) * 0.1,
          y: Math.random() * 0.2 + 0.5,
          z: -0.5 + (Math.random() - 0.5) * 0.1,
        },
        rotation: { x: 0, y: 0, z: 0 },
        confidence: 0.9 + Math.random() * 0.1,
      });
    }

    return joints;
  }

  async startPassthrough(): Promise<boolean> {
    console.log('[SpatialSDK] Iniciando passthrough...');
    this.isPassthroughActive = true;

    // Simular escaneo de escena
    if (this.mockSceneData) {
      this.mockSceneData.isScanning = true;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('[SpatialSDK] Passthrough activado');
        if (this.mockSceneData) {
          this.mockSceneData.isScanning = false;
        }
        resolve(true);
      }, 2000);
    });
  }

  async stopPassthrough(): Promise<boolean> {
    console.log('[SpatialSDK] Deteniendo passthrough...');
    this.isPassthroughActive = false;
    return Promise.resolve(true);
  }

  async getHandJoints(): Promise<HandData[]> {
    // Simular movimiento de manos
    if (this.isHandTrackingActive) {
      this.mockHandData.forEach(hand => {
        hand.joints.forEach(joint => {
          // Añadir pequeña variación a las posiciones
          joint.position.x += (Math.random() - 0.5) * 0.01;
          joint.position.y += (Math.random() - 0.5) * 0.01;
          joint.position.z += (Math.random() - 0.5) * 0.01;
        });
      });
    }

    return Promise.resolve(this.mockHandData);
  }

  async getScenePlanes(): Promise<Plane[]> {
    return Promise.resolve(this.mockSceneData?.planes || []);
  }

  async getSceneVolumes(): Promise<Volume[]> {
    return Promise.resolve(this.mockSceneData?.volumes || []);
  }

  async isSupported(): Promise<boolean> {
    // En modo simulación, siempre retornamos true
    // En producción, esto verificaría la disponibilidad del hardware
    return Promise.resolve(true);
  }

  // Métodos adicionales para simulación
  startHandTracking(): void {
    console.log('[SpatialSDK] Iniciando seguimiento de manos...');
    this.isHandTrackingActive = true;
  }

  stopHandTracking(): void {
    console.log('[SpatialSDK] Deteniendo seguimiento de manos...');
    this.isHandTrackingActive = false;
  }

  simulateGesture(gestureType: 'palm_open' | 'pinch' | 'fist'): void {
    console.log(`[SpatialSDK] Simulando gesto: ${gestureType}`);
    // Aquí podríamos modificar las posiciones de las articulaciones para simular gestos
  }

  simulateSuitcaseDetection(detected: boolean): void {
    if (this.mockSceneData && this.mockSceneData.volumes.length > 0) {
      this.mockSceneData.volumes[0].confidence = detected ? 0.9 : 0.1;
      console.log(`[SpatialSDK] Detección de maleta: ${detected ? 'SÍ' : 'NO'}`);
    }
  }
}

// Exportar instancia única
export const spatialSDK = new SpatialSDKSimulator();