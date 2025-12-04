import { useEffect } from 'react';
import { spatialSDK } from '../services/spatial-sdk-simulator';
import { useSceneStore } from '../store/sceneStore';
import { usePackingStore } from '../store/packingStore';

export const useSceneDetection = () => {
  const { 
    sceneData, 
    isScanningScene, 
    setSceneData, 
    setScanningScene,
    setError 
  } = useSceneStore();
  
  const { setDetectedSuitcase } = usePackingStore();

  useEffect(() => {
    // Actualizar detección de maleta cuando cambien los datos de escena
    if (sceneData) {
      const hasSuitcase = sceneData.volumes.some(volume => 
        volume.label === 'suitcase' && volume.confidence > 0.7
      );
      setDetectedSuitcase(hasSuitcase);
    }
  }, [sceneData, setDetectedSuitcase]);

  const startSceneScan = async () => {
    try {
      console.log('Iniciando escaneo de escena...');
      setScanningScene(true);
      setError(null);

      // Obtener planos y volúmenes
      const [planes, volumes] = await Promise.all([
        spatialSDK.getScenePlanes(),
        spatialSDK.getSceneVolumes(),
      ]);

      const sceneData = {
        planes,
        volumes,
        timestamp: Date.now(),
        isScanning: false,
      };

      setSceneData(sceneData);
      setScanningScene(false);
      
      console.log('Escaneo completado:', {
        planes: planes.length,
        volumes: volumes.length,
      });
      
    } catch (error) {
      console.error('Error al escanear escena:', error);
      setError('Error al escanear el entorno');
      setScanningScene(false);
    }
  };

  const getSuitcaseVolume = () => {
    if (!sceneData) return null;
    return sceneData.volumes.find(volume => volume.label === 'suitcase');
  };

  const getFloorPlane = () => {
    if (!sceneData) return null;
    return sceneData.planes.find(plane => plane.label === 'floor');
  };

  return {
    sceneData,
    isScanningScene,
    startSceneScan,
    getSuitcaseVolume,
    getFloorPlane,
  };
};