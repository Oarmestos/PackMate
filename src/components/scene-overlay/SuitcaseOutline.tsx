import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Volume } from '../../types/scene.types';

interface SuitcaseOutlineProps {
  volume: Volume;
  isDragging: boolean;
  onDrop?: () => void;
}

const { width, height } = Dimensions.get('window');

export const SuitcaseOutline: React.FC<SuitcaseOutlineProps> = ({
  volume,
  isDragging,
  onDrop,
}) => {
  // Convertir coordenadas 3D a posición en pantalla
  // Esto es una simplificación - en la implementación real usaríamos proyección 3D
  const screenPosition = {
    left: width * 0.5 + (volume.center.x * 100),
    top: height * 0.6 + (volume.center.y * 100),
    width: volume.size.width * 200,
    height: volume.size.height * 200,
  };

  return (
    <View style={[styles.container, {
      left: screenPosition.left - screenPosition.width / 2,
      top: screenPosition.top - screenPosition.height / 2,
      width: screenPosition.width,
      height: screenPosition.height,
    }]}>
      {/* Contorno de la maleta */}
      <View style={[
        styles.outline,
        isDragging && styles.outlineActive,
      ]}>
        {/* Esquinas del contorno */}
        <View style={[styles.corner, styles.cornerTopLeft]} />
        <View style={[styles.corner, styles.cornerTopRight]} />
        <View style={[styles.corner, styles.cornerBottomLeft]} />
        <View style={[styles.corner, styles.cornerBottomRight]} />
        
        {/* Etiqueta de identificación */}
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>Maleta Detectada</Text>
          <Text style={styles.confidenceText}>
            {Math.round(volume.confidence * 100)}% confianza
          </Text>
        </View>
      </View>

      {/* Indicador de drop zone cuando se está arrastrando */}
      {isDragging && (
        <View style={styles.dropZone}>
          <Text style={styles.dropText}>Suelta aquí</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
  },
  outline: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: '#00FFFF',
    borderStyle: 'dashed',
    borderRadius: 10,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineActive: {
    borderColor: '#00FF00',
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    borderStyle: 'solid',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#00FFFF',
  },
  cornerTopLeft: {
    top: -3,
    left: -3,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTopRight: {
    top: -3,
    right: -3,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBottomLeft: {
    bottom: -3,
    left: -3,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBottomRight: {
    bottom: -3,
    right: -3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  labelContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00FFFF',
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confidenceText: {
    color: '#00FFFF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  dropZone: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    backgroundColor: 'rgba(0, 255, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  dropText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});