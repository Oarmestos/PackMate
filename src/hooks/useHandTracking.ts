import { useEffect, useState } from 'react';
import { HandData, GestureData } from '../types/hand.types';
import { spatialSDK } from '../services/spatial-sdk-simulator';
import { gestureService } from '../services/gesture-recognition';
import { useSceneStore } from '../store/sceneStore';

export const useHandTracking = () => {
  const { 
    handData, 
    isTrackingHands, 
    setHandData, 
    setTrackingHands,
    detectedGestures,
    setDetectedGestures 
  } = useSceneStore();
  
  const [isPalmOpen, setIsPalmOpen] = useState(false);
  const [isPinching, setIsPinching] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isTrackingHands) {
      // Actualizar datos de manos cada 16ms (~60 FPS)
      intervalId = setInterval(async () => {
        try {
          const handData = await spatialSDK.getHandJoints();
          setHandData(handData);
          
          // Detectar gestos
          const gestures = gestureService.detectGestures(handData);
          setDetectedGestures(gestures);
          
          // Actualizar estado de gestos
          const leftPalmOpen = gestures.some(g => 
            g.type === 'palm_open' && g.handType === 'left' && g.confidence > 0.7
          );
          const rightPinch = gestures.some(g => 
            g.type === 'pinch' && g.handType === 'right' && g.confidence > 0.7
          );
          
          setIsPalmOpen(leftPalmOpen);
          setIsPinching(rightPinch);
          
        } catch (error) {
          console.error('Error al obtener datos de manos:', error);
        }
      }, 16);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isTrackingHands, setHandData, setDetectedGestures]);

  const startHandTracking = () => {
    console.log('Iniciando seguimiento de manos...');
    spatialSDK.startHandTracking();
    setTrackingHands(true);
  };

  const stopHandTracking = () => {
    console.log('Deteniendo seguimiento de manos...');
    spatialSDK.stopHandTracking();
    setTrackingHands(false);
  };

  const getLeftHand = () => handData.find(hand => hand.handType === 'left');
  const getRightHand = () => handData.find(hand => hand.handType === 'right');

  return {
    handData,
    isTrackingHands,
    isPalmOpen,
    isPinching,
    detectedGestures,
    startHandTracking,
    stopHandTracking,
    getLeftHand,
    getRightHand,
  };
};