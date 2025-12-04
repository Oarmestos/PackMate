import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface StatusIndicatorProps {
  status: 'scanning' | 'detected' | 'tracking' | 'idle' | 'error';
  message?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'scanning':
        return {
          color: '#FFFF00',
          icon: '🔍',
          defaultMessage: 'Escaneando entorno...',
        };
      case 'detected':
        return {
          color: '#00FF00',
          icon: '✅',
          defaultMessage: 'Maleta detectada',
        };
      case 'tracking':
        return {
          color: '#00FFFF',
          icon: '👋',
          defaultMessage: 'Siguiendo manos',
        };
      case 'error':
        return {
          color: '#FF4444',
          icon: '❌',
          defaultMessage: 'Error',
        };
      default:
        return {
          color: '#CCCCCC',
          icon: '⏸️',
          defaultMessage: 'Inactivo',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.container, { borderColor: config.color }]}>
      <View style={[styles.iconContainer, { backgroundColor: config.color }]}>
        <Text style={styles.icon}>{config.icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.message, { color: config.color }]}>
          {message || config.defaultMessage}
        </Text>
        {status === 'scanning' && (
          <ActivityIndicator size="small" color={config.color} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 12,
    borderWidth: 2,
    margin: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
  },
});