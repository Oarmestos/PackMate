# Guía de Integración con Meta Quest - Meta Spatial SDK

## 📋 Resumen

Esta guía detalla los pasos necesarios para integrar PackMate con el Meta Spatial SDK y convertir la simulación actual en una aplicación de Realidad Mixta funcional para Meta Quest.

## 🎯 Objetivos de Integración

1. **Activar Passthrough** - Ver el mundo real
2. **Detección de Escena** - Identificar maletas y planos
3. **Hand Tracking** - Seguimiento de manos sin controles
4. **Interacción Nativa** - Gestos reales en 3D

## 🔧 Configuración del Entorno

### Prerequisitos

```bash
# Software necesario
- Android Studio Arctic Fox o superior
- Meta Quest Developer Hub
- Meta Spatial SDK v0.8.0+
- React Native CLI
- Java 11+
- CMake 3.18+

# Hardware
- Meta Quest 2, Quest 3 o Quest Pro
- Cable USB-C para desarrollo
```

### Instalación del Meta Spatial SDK

1. **Descargar el SDK**
   - Obtener el SDK desde el portal de desarrolladores de Meta
   - Extraer el archivo `.aar` del SDK

2. **Configurar Android Studio**
   ```gradle
   // android/app/build.gradle
   android {
       compileSdkVersion 33
       
       defaultConfig {
           minSdkVersion 29  // Importante: mínimo API 29
           targetSdkVersion 33
       }
   }
   
   dependencies {
       implementation(name: 'spatial-sdk-0.8.0', ext: 'aar')
       implementation 'com.meta.spatial:core:0.8.0'
       // ... otras dependencias
   }
   ```

3. **Configurar permisos en AndroidManifest.xml**
   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   <uses-permission android:name="com.oculus.permission.HAND_TRACKING" />
   <uses-permission android:name="com.oculus.permission.USE_SCENE" />
   <uses-permission android:name="com.oculus.permission.RECORD_AUDIO" />
   ```

## 🏗️ Implementación del Módulo Nativo

### 1. Crear el Módulo Nativo Principal

```java
// android/app/src/main/java/com/packmate/SpatialSDKModule.java

package com.packmate;

import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.meta.spatial.sdk.*;
import android.content.Context;

@ReactModule(name = SpatialSDKModule.NAME)
public class SpatialSDKModule extends ReactContextBaseJavaModule {
    public static final String NAME = "SpatialSDKModule";
    
    private SceneManager sceneManager;
    private HandTrackingManager handTrackingManager;
    private PassthroughManager passthroughManager;
    private boolean isInitialized = false;

    public SpatialSDKModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void initialize(Promise promise) {
        try {
            Context context = getReactApplicationContext();
            
            // Inicializar managers del Spatial SDK
            sceneManager = new SceneManager(context);
            handTrackingManager = new HandTrackingManager(context);
            passthroughManager = new PassthroughManager(context);
            
            isInitialized = true;
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("INIT_ERROR", "Error al inicializar Spatial SDK", e);
        }
    }

    @ReactMethod
    public void startPassthrough(Promise promise) {
        if (!isInitialized) {
            promise.reject("NOT_INITIALIZED", "SDK no inicializado");
            return;
        }
        
        try {
            passthroughManager.startPassthrough();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("PASSTHROUGH_ERROR", "Error al iniciar passthrough", e);
        }
    }

    @ReactMethod
    public void stopPassthrough(Promise promise) {
        try {
            if (passthroughManager != null) {
                passthroughManager.stopPassthrough();
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("PASSTHROUGH_ERROR", "Error al detener passthrough", e);
        }
    }

    @ReactMethod
    public void startSceneDetection(Promise promise) {
        try {
            sceneManager.startSceneDetection(new SceneDetectionCallback() {
                @Override
                public void onSceneDetected(SceneData sceneData) {
                    // Enviar evento a JavaScript
                    WritableMap params = Arguments.createMap();
                    params.putArray("planes", convertPlanesToJS(sceneData.getPlanes()));
                    params.putArray("volumes", convertVolumesToJS(sceneData.getVolumes()));
                    
                    sendEvent("SceneDetected", params);
                }
                
                @Override
                public void onError(String error) {
                    promise.reject("SCENE_ERROR", error);
                }
            });
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("SCENE_ERROR", "Error al iniciar detección de escena", e);
        }
    }

    @ReactMethod
    public void startHandTracking(Promise promise) {
        try {
            handTrackingManager.startHandTracking(new HandTrackingCallback() {
                @Override
                public void onHandsUpdated(HandData[] hands) {
                    WritableMap params = Arguments.createMap();
                    params.putArray("hands", convertHandsToJS(hands));
                    
                    sendEvent("HandsUpdated", params);
                }
            });
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("HAND_TRACKING_ERROR", "Error al iniciar hand tracking", e);
        }
    }

    @ReactMethod
    public void stopHandTracking(Promise promise) {
        try {
            if (handTrackingManager != null) {
                handTrackingManager.stopHandTracking();
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("HAND_TRACKING_ERROR", "Error al detener hand tracking", e);
        }
    }

    private void sendEvent(String eventName, WritableMap params) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    // Métodos auxiliares para conversión de datos
    private WritableArray convertPlanesToJS(Plane[] planes) {
        WritableArray array = Arguments.createArray();
        for (Plane plane : planes) {
            WritableMap planeMap = Arguments.createMap();
            planeMap.putString("id", plane.getId());
            planeMap.putString("label", plane.getLabel());
            planeMap.putDouble("confidence", plane.getConfidence());
            
            // Convertir posición y rotación
            WritableMap position = Arguments.createMap();
            position.putDouble("x", plane.getPosition().x);
            position.putDouble("y", plane.getPosition().y);
            position.putDouble("z", plane.getPosition().z);
            planeMap.putMap("position", position);
            
            array.pushMap(planeMap);
        }
        return array;
    }

    private WritableArray convertVolumesToJS(Volume[] volumes) {
        WritableArray array = Arguments.createArray();
        for (Volume volume : volumes) {
            WritableMap volumeMap = Arguments.createMap();
            volumeMap.putString("id", volume.getId());
            volumeMap.putString("label", volume.getLabel());
            volumeMap.putDouble("confidence", volume.getConfidence());
            
            // Convertir centro y tamaño
            WritableMap center = Arguments.createMap();
            center.putDouble("x", volume.getCenter().x);
            center.putDouble("y", volume.getCenter().y);
            center.putDouble("z", volume.getCenter().z);
            volumeMap.putMap("center", center);
            
            array.pushMap(volumeMap);
        }
        return array;
    }

    private WritableArray convertHandsToJS(HandData[] hands) {
        WritableArray array = Arguments.createArray();
        for (HandData hand : hands) {
            WritableMap handMap = Arguments.createMap();
            handMap.putString("handType", hand.getHandType());
            handMap.putBoolean("isTracked", hand.isTracked());
            
            // Convertir articulaciones
            WritableArray joints = Arguments.createArray();
            for (Joint joint : hand.getJoints()) {
                WritableMap jointMap = Arguments.createMap();
                jointMap.putString("id", joint.getId());
                
                WritableMap position = Arguments.createMap();
                position.putDouble("x", joint.getPosition().x);
                position.putDouble("y", joint.getPosition().y);
                position.putDouble("z", joint.getPosition().z);
                jointMap.putMap("position", position);
                
                joints.pushMap(jointMap);
            }
            handMap.putArray("joints", joints);
            
            array.pushMap(handMap);
        }
        return array;
    }
}
```

### 2. Registrar el Módulo

```java
// android/app/src/main/java/com/packmate/SpatialSDKPackage.java

package com.packmate;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SpatialSDKPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new SpatialSDKModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
```

### 3. Actualizar MainApplication.java

```java
// android/app/src/main/java/com/packmate/MainApplication.java

import com.packmate.SpatialSDKPackage;

@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new SpatialSDKPackage()); // Agregar nuestro paquete
    return packages;
}
```

## 🔄 Actualizar el Servicio en React Native

### Reemplazar el Simulador

```typescript
// src/services/meta-spatial-sdk.ts

import { NativeModules, NativeEventEmitter } from 'react-native';
import { NativeBridgeInterface } from '../types/services.types';
import { HandData, SceneData } from '../types';

export class MetaSpatialSDK implements NativeBridgeInterface {
    private nativeModule = NativeModules.SpatialSDKModule;
    private eventEmitter: NativeEventEmitter;

    constructor() {
        this.eventEmitter = new NativeEventEmitter(this.nativeModule);
        this.setupEventListeners();
    }

    async initialize(): Promise<boolean> {
        return await this.nativeModule.initialize();
    }

    async startPassthrough(): Promise<boolean> {
        return await this.nativeModule.startPassthrough();
    }

    async stopPassthrough(): Promise<boolean> {
        return await this.nativeModule.stopPassthrough();
    }

    async startSceneDetection(): Promise<boolean> {
        return await this.nativeModule.startSceneDetection();
    }

    async startHandTracking(): Promise<boolean> {
        return await this.nativeModule.startHandTracking();
    }

    async stopHandTracking(): Promise<boolean> {
        return await this.nativeModule.stopHandTracking();
    }

    async isSupported(): Promise<boolean> {
        // Verificar disponibilidad del hardware
        return await this.nativeModule.isSupported();
    }

    private setupEventListeners() {
        // Escuchar eventos de escena detectada
        this.eventEmitter.addListener('SceneDetected', (data) => {
            // Procesar datos de escena
            this.processSceneData(data);
        });

        // Escuchar eventos de manos actualizadas
        this.eventEmitter.addListener('HandsUpdated', (data) => {
            // Procesar datos de manos
            this.processHandData(data);
        });
    }

    private processSceneData(data: any) {
        // Convertir datos nativos a nuestros tipos TypeScript
        const sceneData: SceneData = {
            planes: data.planes.map(this.convertPlaneFromNative),
            volumes: data.volumes.map(this.convertVolumeFromNative),
            timestamp: Date.now(),
            isScanning: false
        };

        // Actualizar store o emitir evento
        // useSceneStore.getState().setSceneData(sceneData);
    }

    private processHandData(data: any) {
        const handData: HandData[] = data.hands.map(this.convertHandFromNative);
        // Actualizar store o emitir evento
        // useSceneStore.getState().setHandData(handData);
    }

    private convertPlaneFromNative(plane: any) {
        return {
            id: plane.id,
            label: plane.label,
            confidence: plane.confidence,
            position: plane.position,
            // ... otras propiedades
        };
    }

    private convertVolumeFromNative(volume: any) {
        return {
            id: volume.id,
            label: volume.label,
            confidence: volume.confidence,
            center: volume.center,
            // ... otras propiedades
        };
    }

    private convertHandFromNative(hand: any) {
        return {
            handType: hand.handType,
            isTracked: hand.isTracked,
            joints: hand.joints.map(this.convertJointFromNative)
        };
    }

    private convertJointFromNative(joint: any) {
        return {
            id: joint.id,
            position: joint.position,
            // ... otras propiedades
        };
    }
}
```

## 🎨 Renderizado 3D Nativo

### Crear Vista Nativa para Contornos

```java
// android/app/src/main/java/com/packmate/SceneOverlayView.java

package com.packmate;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.view.View;

public class SceneOverlayView extends View {
    private Paint outlinePaint;
    private Paint fillPaint;
    private Path outlinePath;
    private boolean isActive = false;

    public SceneOverlayView(Context context) {
        super(context);
        init();
    }

    private void init() {
        outlinePaint = new Paint();
        outlinePaint.setColor(Color.CYAN);
        outlinePaint.setStyle(Paint.Style.STROKE);
        outlinePaint.setStrokeWidth(5);
        outlinePaint.setAntiAlias(true);

        fillPaint = new Paint();
        fillPaint.setColor(Color.argb(30, 0, 255, 255));
        fillPaint.setStyle(Paint.Style.FILL);
    }

    public void setOutline(Path path) {
        this.outlinePath = path;
        invalidate();
    }

    public void setActive(boolean active) {
        this.isActive = active;
        if (active) {
            outlinePaint.setColor(Color.GREEN);
            fillPaint.setColor(Color.argb(50, 0, 255, 0));
        } else {
            outlinePaint.setColor(Color.CYAN);
            fillPaint.setColor(Color.argb(30, 0, 255, 255));
        }
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        
        if (outlinePath != null) {
            canvas.drawPath(outlinePath, fillPaint);
            canvas.drawPath(outlinePath, outlinePaint);
        }
    }
}
```

## 📊 Optimización de Rendimiento

### 1. Gestión de Memoria
```java
// Liberar recursos cuando no se usen
@Override
public void onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy();
    
    if (sceneManager != null) {
        sceneManager.release();
        sceneManager = null;
    }
    
    if (handTrackingManager != null) {
        handTrackingManager.release();
        handTrackingManager = null;
    }
    
    if (passthroughManager != null) {
        passthroughManager.release();
        passthroughManager = null;
    }
}
```

### 2. Rate Limiting
```java
// Limitar la frecuencia de actualizaciones
private static final long UPDATE_INTERVAL = 16; // ~60 FPS
private long lastUpdateTime = 0;

private boolean shouldUpdate() {
    long currentTime = System.currentTimeMillis();
    if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
        lastUpdateTime = currentTime;
        return true;
    }
    return false;
}
```

## 🧪 Testing en Dispositivo Real

### 1. Configurar Quest para Desarrollo
```bash
# Habilitar modo desarrollador en Quest
# Instalar Meta Quest Developer Hub
# Conectar Quest por USB
# Aceptar diálogo de depuración USB
```

### 2. Instalar APK de Desarrollo
```bash
# Construir APK de debug
npm run android

# O instalar directamente
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. Verificar Logs
```bash
# Ver logs del dispositivo
adb logcat | grep -i "packmate\|spatial"
```

## 📋 Checklist de Integración

### Preparación ✅
- [ ] Android Studio configurado
- [ ] Meta Quest Developer Hub instalado
- [ ] Dispositivo Quest en modo desarrollador
- [ ] Spatial SDK descargado

### Implementación ✅
- [ ] Módulo nativo creado
- [ ] Servicios de simulación reemplazados
- [ ] Permisos configurados
- [ ] Manejo de eventos implementado
- [ ] Optimización de rendimiento aplicada

### Testing ✅
- [ ] APK instalado en dispositivo
- [ ] Passthrough funcional
- [ ] Hand tracking detectando gestos
- [ ] Scene detection encontrando maletas
- [ ] Interacción completa probada

## 🚨 Problemas Comunes y Soluciones

### 1. "SDK no inicializado"
**Solución**: Asegurarse de llamar `initialize()` antes de otros métodos

### 2. Hand tracking no funciona
**Solución**: Verificar que los permisos estén concedidos en el dispositivo

### 3. Scene detection lento
**Solución**: Optimizar el intervalo de actualización y usar hilos separados

### 4. Memoria insuficiente
**Solución**: Implementar liberación de recursos y usar debouncing

## 📞 Soporte

Para problemas con el Spatial SDK:
- Documentación oficial de Meta
- Foros de desarrolladores de Meta
- Soporte técnico de Meta Quest

---

**Nota**: Esta guía asume que tienes acceso al Meta Spatial SDK y las herramientas de desarrollo de Meta Quest. Algunos detalles pueden variar según la versión del SDK.