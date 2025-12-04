import { GestureRecognitionInterface } from '../types/services.types';
import { HandData, GestureData } from '../types/hand.types';

/**
 * Servicio de reconocimiento de gestos
 * Analiza los datos de las manos y detecta gestos específicos
 */
export class GestureRecognitionService implements GestureRecognitionInterface {
  private sensitivity = 0.7;
  private calibrationData: any = null;

  constructor() {
    console.log('[GestureRecognition] Servicio inicializado');
  }

  detectGestures(handData: HandData[]): GestureData[] {
    const gestures: GestureData[] = [];
    const timestamp = Date.now();

    handData.forEach(hand => {
      if (!hand.isTracked || hand.joints.length < 21) {
        return;
      }

      // Detectar gestos para cada mano
      const palmOpen = this.detectPalmOpen(hand.joints);
      const pinch = this.detectPinch(hand.joints);
      const fist = this.detectFist(hand.joints);
      const point = this.detectPoint(hand.joints);

      // Seleccionar el gesto con mayor confianza
      const gestureTypes = [
        { type: 'palm_open' as const, confidence: palmOpen },
        { type: 'pinch' as const, confidence: pinch },
        { type: 'fist' as const, confidence: fist },
        { type: 'point' as const, confidence: point },
      ];

      const bestGesture = gestureTypes.reduce((prev, current) => 
        prev.confidence > current.confidence ? prev : current
      );

      if (bestGesture.confidence > this.sensitivity) {
        gestures.push({
          type: bestGesture.type,
          confidence: bestGesture.confidence,
          handType: hand.handType,
          timestamp,
        });
      }
    });

    return gestures;
  }

  private detectPalmOpen(joints: any[]): number {
    // Lógica simplificada para detectar palma abierta
    // En una implementación real, esto sería mucho más complejo
    const palmJoint = joints[0]; // Base de la palma
    const fingerTips = [joints[4], joints[8], joints[12], joints[16], joints[20]]; // Yemas de los dedos

    let confidence = 0;
    let extendedFingers = 0;

    fingerTips.forEach(tip => {
      const distance = this.calculateDistance(palmJoint.position, tip.position);
      if (distance > 0.1) { // Dedo extendido
        extendedFingers++;
      }
    });

    confidence = extendedFingers / 5; // 5 dedos extendidos = 100% confianza
    return Math.min(confidence, 1);
  }

  private detectPinch(joints: any[]): number {
    // Detectar pellizco entre pulgar e índice
    const thumbTip = joints[4];
    const indexTip = joints[8];

    const distance = this.calculateDistance(thumbTip.position, indexTip.position);
    
    // Cuanto más cerca están, más probable es un pellizco
    const maxDistance = 0.1;
    const confidence = Math.max(0, 1 - (distance / maxDistance));
    
    return confidence;
  }

  private detectFist(joints: any[]): number {
    // Detectar puño (dedos cerrados)
    const palmJoint = joints[0];
    const fingerTips = [joints[4], joints[8], joints[12], joints[16], joints[20]];

    let closedFingers = 0;

    fingerTips.forEach(tip => {
      const distance = this.calculateDistance(palmJoint.position, tip.position);
      if (distance < 0.08) { // Dedo cerca de la palma
        closedFingers++;
      }
    });

    return closedFingers / 5;
  }

  private detectPoint(joints: any[]): number {
    // Detectar señalar con índice extendido
    const indexTip = joints[8];
    const indexBase = joints[5];
    const middleTip = joints[12];

    // Índice debe estar extendido, medio debe estar doblado
    const indexExtended = this.calculateDistance(indexBase.position, indexTip.position) > 0.08;
    const middleCurled = this.calculateDistance(joints[0].position, middleTip.position) < 0.08;

    return indexExtended && middleCurled ? 0.9 : 0;
  }

  private calculateDistance(pos1: any, pos2: any): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  calibrate(): void {
    console.log('[GestureRecognition] Calibrando sistema...');
    // Aquí iría la lógica de calibración
    this.calibrationData = { timestamp: Date.now() };
  }

  setSensitivity(sensitivity: number): void {
    this.sensitivity = Math.max(0, Math.min(1, sensitivity));
    console.log(`[GestureRecognition] Sensibilidad ajustada a: ${this.sensitivity}`);
  }
}

// Exportar instancia única
export const gestureService = new GestureRecognitionService();