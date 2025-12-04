import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert,
  TouchableOpacity, // Importar TouchableOpacity
} from 'react-native';
import { PackingList } from './src/components/packing-list/PackingList';
import { WelcomeScreen } from './src/components/screens/WelcomeScreen';
import { ScanningScreen } from './src/components/screens/ScanningScreen';
import { SuitcaseOutline } from './src/components/scene-overlay/SuitcaseOutline';
import { ControlButton } from './src/components/ui/ControlButton';
import { StatusIndicator } from './src/components/ui/StatusIndicator';
import { FloatingItem } from './src/components/scene-overlay/FloatingItem';
import { ContextualHint } from './src/components/ui/ContextualHint';
import { CompletionScreen } from './src/components/screens/CompletionScreen';
import { ListSelectorScreen } from './src/components/screens/ListSelectorScreen';
import { useHandTracking } from './src/hooks/useHandTracking';
import { useSceneDetection } from './src/hooks/useSceneDetection';
import { usePackingList } from './src/hooks/usePackingList';
import { usePackingStore } from './src/store/packingStore';
// Meta Spatial SDK - Modo HÍBRIDO (real en Quest, simulación en móvil)
import { spatialSDK } from './src/services/meta-spatial-sdk';

const { width, height } = Dimensions.get('window');

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showListSelector, setShowListSelector] = useState(false);

  // Hooks personalizados
  const {
    handData,
    isTrackingHands,
    isPalmOpen,
    isPinching,
    startHandTracking,
    stopHandTracking,
  } = useHandTracking();

  const {
    sceneData,
    isScanningScene,
    startSceneScan,
    getSuitcaseVolume,
  } = useSceneDetection();

  const {
    isDraggingItem,
    draggedItem,
    handleDropOnSuitcase,
    isAllPacked,
  } = usePackingList();

  // Estado derivado
  const suitcaseVolume = getSuitcaseVolume();
  // La lista debe ser visible siempre que estemos en modo empaque (no bienvenida, no selector, no escaneo)
  const isPackingListVisible = !showWelcome && !showListSelector && !isScanningScene;

  useEffect(() => {
    // Inicializar la aplicación
    const initializeApp = async () => {
      try {
        // Verificar soporte del dispositivo
        const isSupported = await spatialSDK.isSupported();
        if (!isSupported) {
          console.warn('Dispositivo no compatible con Meta Spatial SDK');
        }

        setIsAppReady(true);
      } catch (error) {
        console.error('Error al inicializar:', error);
      }
    };

    initializeApp();
  }, []);

  const handleStartPacking = async () => {
    console.log('🚀 Iniciando proceso de empaque');
    setShowWelcome(false);
    setShowListSelector(true);
  };

  const handleListSelected = async () => {
    console.log('✅ Lista seleccionada, iniciando escaneo');
    setShowListSelector(false);

    // Iniciar passthrough (cámara)
    await spatialSDK.startPassthrough();

    // Iniciar escaneo de escena
    startSceneScan();

    // Iniciar seguimiento de manos
    startHandTracking();
  };

  const handleBackFromListSelector = () => {
    console.log('🔙 Regresando a bienvenida desde selector');
    setShowListSelector(false);
    setShowWelcome(true);
  };

  const handleBackFromScanning = () => {
    console.log('🔙 Regresando a selector desde escaneo');
    stopHandTracking();
    spatialSDK.stopPassthrough();
    setShowListSelector(true);
  };

  const handleEditList = (listId: string) => {
    console.log('✏️ Editar lista ID:', listId);
    const list = usePackingStore.getState().lists.find(l => l.id === listId);
    if (list) {
      console.log('📝 Lista a editar:', list.name);
      // TODO: Implementar modal de edición en el futuro
      Alert.alert('Editar Lista', `${list.name}\n\n(Funcionalidad en desarrollo)`);
    }
  };

  const handleReset = () => {
    console.log('🔄 App: Reiniciando sesión de empaque');
    // Reiniciar estado pero volver al selector de listas, no a la bienvenida
    stopHandTracking();
    spatialSDK.stopPassthrough();
    setShowListSelector(true);
    setShowWelcome(false);
  };

  const handleBackFromPacking = () => {
    console.log('🔙 Regresando a selector desde empaque');
    handleReset();
  };

  // Determinar estado actual
  const getCurrentStatus = () => {
    if (showWelcome) return 'idle';
    if (isScanningScene) return 'scanning';
    if (suitcaseVolume) return 'detected';
    if (isTrackingHands) return 'tracking';
    return 'error';
  };

  if (!isAppReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Iniciando PackMate...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />

      {/* Pantalla de bienvenida */}
      {showWelcome && (
        <WelcomeScreen onStart={handleStartPacking} />
      )}

      {/* Pantalla de selección de lista */}
      {showListSelector && !showWelcome && (
        <ListSelectorScreen
          lists={usePackingStore.getState().lists}
          selectedListId={usePackingStore.getState().selectedListId}
          onSelectList={(listId) => usePackingStore.getState().selectList(listId)}
          onCreateList={() => usePackingStore.getState().createNewList('Nueva Lista')}
          onStartPacking={handleListSelected}
          onEditList={handleEditList}
          onDeleteList={(listId) => usePackingStore.getState().deleteList(listId)}
          onBack={handleBackFromListSelector}
        />
      )}

      {/* Pantalla de Escaneo */}
      {isScanningScene && !showWelcome && !showListSelector && (
        <ScanningScreen onBack={handleBackFromScanning} />
      )}

      {/* Indicador de estado (solo en pantalla de empaque, no en selector) */}
      {/* Indicador de estado (solo si NO hay maleta detectada, para evitar redundancia y superposición) */}
      {!showWelcome && !showListSelector && !isScanningScene && !suitcaseVolume && (
        <View style={styles.statusContainer}>
          <StatusIndicator
            status={getCurrentStatus()}
            message={
              isTrackingHands ? 'Siguiendo manos...' :
                'Listo para comenzar'
            }
          />
        </View>
      )}

      {/* Controles (solo en pantalla de empaque, no en selector ni bienvenida) */}
      {!showWelcome && !showListSelector && (
        <View style={styles.controlsContainer}>
          <ControlButton
            title="Reiniciar"
            onPress={handleReset}
            variant="secondary"
          />
          {!isScanningScene && !suitcaseVolume && (
            <ControlButton
              title="Reescanear"
              onPress={startSceneScan}
              variant="secondary"
            />
          )}
        </View>
      )}

      {/* Lista de empaque (visible en modo empaque) */}
      {isPackingListVisible && (
        <>
          {/* Botón de regreso específico para la vista de empaque - Estilo minimalista */}
          <TouchableOpacity
            style={styles.minimalBackButton}
            onPress={handleBackFromPacking}
            activeOpacity={0.7}
          >
            <Text style={styles.minimalBackButtonText}>← Atrás</Text>
          </TouchableOpacity>

          <View style={styles.packingListContainer}>
            <PackingList isVisible={true} />
          </View>
        </>
      )}

      {/* Contorno de la maleta detectada (solo si no está en bienvenida ni selector) */}
      {suitcaseVolume && !showWelcome && !showListSelector && (
        <SuitcaseOutline
          volume={suitcaseVolume}
          isDragging={isDraggingItem}
          onDrop={handleDropOnSuitcase}
        />
      )}

      {/* Item arrastrado (siguiendo el dedo) - solo si no está en bienvenida ni selector) */}
      {isDraggingItem && draggedItem && !showWelcome && !showListSelector && (
        <>
          <FloatingItem
            item={draggedItem}
            position={{
              x: width * 0.6, // Simular posición dinámica (en producción usaría coordenadas reales)
              y: height * 0.5,
            }}
          />
          <ContextualHint
            message="Release to place in virtual suitcase"
            icon="👜"
          />
        </>
      )}

      {/* Mensaje de finalización - solo cuando realmente todo esté empacado */}
      {isAllPacked && !showWelcome && !showListSelector && !isScanningScene && (
        <CompletionScreen onReset={handleReset} />
      )}

      {/* Información de depuración (solo en desarrollo) */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Manos: {handData.length} | Gestos: {isPalmOpen ? 'Palma' : isPinching ? 'Pellizco' : 'Ninguno'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#00FFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00FFFF',
    marginBottom: 20,
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  statusContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 80, // Aumentado para evitar conflicto con navegación del sistema
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1000,
  },
  packingListContainer: {
    position: 'absolute',
    left: 20,
    top: height * 0.25, // Subir un poco
    zIndex: 2000, // Asegurar que esté por encima de todo (SuitcaseOutline tiene 100)
  },
  minimalBackButton: {
    position: 'absolute',
    top: 50, // Aumentado para librar la barra de estado/iconos
    left: 20,
    zIndex: 2000,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.3)', // Fondo sutil para legibilidad
    borderRadius: 8,
  },
  minimalBackButtonText: {
    fontSize: 16,
    color: '#0dccf2',
    fontWeight: '600',
  },


  debugInfo: {
    position: 'absolute',
    top: 50, // Mover arriba para no estorbar abajo
    right: 20, // A la derecha
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
    zIndex: 3000,
  },
  debugText: {
    color: '#00FFFF',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default App;
