package com.packmate

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.util.Log

// Meta Spatial SDK Imports - ACTIVADOS para producción
import com.meta.spatial.core.SpatialContext
import com.meta.spatial.runtime.PassthroughManager
import com.meta.spatial.runtime.HandTrackingManager
import com.meta.spatial.runtime.SceneManager
import com.meta.spatial.core.Pose
import com.meta.spatial.core.Vector3
import com.meta.spatial.core.Quaternion

/**
 * Módulo Nativo React Native para PackMate
 * 
 * Integra las funcionalidades del Meta Spatial SDK con soporte HÍBRIDO:
 * - Si está en Meta Quest: Usa el SDK real.
 * - Si está en Móvil (Android estándar): Usa simulación para testing.
 */
class PackMateModule(reactContext: ReactApplicationContext) : 
    ReactContextBaseJavaModule(reactContext) {

    private var spatialContext: SpatialContext? = null
    private var passthroughManager: PassthroughManager? = null
    private var handTrackingManager: HandTrackingManager? = null
    private var sceneManager: SceneManager? = null
    
    // Flag para controlar el modo simulación - DETECCIÓN AUTOMÁTICA
    private var isSimulationMode = true

    companion object {
        private const val MODULE_NAME = "PackMateModule"
        private const val TAG = "PackMateModule"
    }

    override fun getName(): String = MODULE_NAME

    override fun initialize() {
        super.initialize()
        
        // Detectar automáticamente si estamos en Meta Quest
        isSimulationMode = !isMetaQuestDevice()
        
        if (!isSimulationMode) {
            try {
                Log.i(TAG, "🎯 Dispositivo Meta Quest detectado, inicializando SDK real...")
                // Inicializar SDK real
                spatialContext = SpatialContext.getInstance(reactApplicationContext)
                passthroughManager = PassthroughManager.getInstance(spatialContext)
                handTrackingManager = HandTrackingManager.getInstance(spatialContext)
                sceneManager = SceneManager.getInstance(spatialContext)
                Log.i(TAG, "✅ Meta Spatial SDK inicializado correctamente")
            } catch (e: Exception) {
                Log.e(TAG, "⚠️ Error al inicializar SDK, usando simulación", e)
                isSimulationMode = true
            }
        } else {
            Log.w(TAG, "📱 Dispositivo móvil detectado, usando modo SIMULACIÓN")
        }
    }
    
    /**
     * Detecta si el dispositivo es un Meta Quest
     */
    private fun isMetaQuestDevice(): Boolean {
        val manufacturer = android.os.Build.MANUFACTURER.lowercase()
        val model = android.os.Build.MODEL.lowercase()
        val brand = android.os.Build.BRAND.lowercase()
        
        return manufacturer.contains("oculus") || 
               manufacturer.contains("meta") ||
               brand.contains("oculus") ||
               brand.contains("meta") ||
               model.contains("quest")
    }

    /**
     * Inicia el modo Passthrough
     */
    @ReactMethod
    fun startPassthrough(promise: Promise) {
        if (isSimulationMode) {
            // Simulación: Resolvemos inmediatamente
            Log.d(TAG, "📱 Simulando startPassthrough")
            promise.resolve(true)
            return
        }
        
        try {
            Log.d(TAG, "🎯 Iniciando passthrough real en Quest...")
            passthroughManager?.enable()
            Log.i(TAG, "✅ Passthrough activado correctamente")
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error al activar passthrough", e)
            promise.reject("PASSTHROUGH_ERROR", e.message, e)
        }
    }

    /**
     * Detiene el modo Passthrough
     */
    @ReactMethod
    fun stopPassthrough(promise: Promise) {
        if (isSimulationMode) {
            Log.d(TAG, "📱 Simulando stopPassthrough")
            promise.resolve(true)
            return
        }
        
        try {
            Log.d(TAG, "🎯 Deteniendo passthrough real...")
            passthroughManager?.disable()
            Log.i(TAG, "✅ Passthrough desactivado")
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error al desactivar passthrough", e)
            promise.reject("PASSTHROUGH_ERROR", e.message, e)
        }
    }

    /**
     * Obtiene los datos de las articulaciones de las manos
     */
    @ReactMethod
    fun getHandJoints(promise: Promise) {
        if (isSimulationMode) {
            // Simulación: Retornamos datos falsos de manos
            val handsArray = Arguments.createArray()
            handsArray.pushMap(createMockHandData("left"))
            handsArray.pushMap(createMockHandData("right"))
            promise.resolve(handsArray)
            return
        }
        
        try {
            // Implementación real con Meta SDK
            val hands = handTrackingManager?.getHandPoses() ?: emptyList()
            val handsArray = Arguments.createArray()
            
            hands.forEach { hand ->
                val handData = Arguments.createMap()
                handData.putString("handType", if (hand.isLeft) "left" else "right")
                handData.putBoolean("isTracked", hand.isTracked)
                
                val jointsArray = Arguments.createArray()
                hand.joints.forEachIndexed { index, joint ->
                    val jointMap = Arguments.createMap().apply {
                        putString("id", "${if (hand.isLeft) "left" else "right"}-joint-$index")
                        putMap("position", createVectorMap(
                            joint.position.x.toDouble(),
                            joint.position.y.toDouble(),
                            joint.position.z.toDouble()
                        ))
                        putMap("rotation", createVectorMap(
                            joint.rotation.x.toDouble(),
                            joint.rotation.y.toDouble(),
                            joint.rotation.z.toDouble()
                        ))
                        putDouble("confidence", joint.confidence.toDouble())
                    }
                    jointsArray.pushMap(jointMap)
                }
                
                handData.putArray("joints", jointsArray)
                handsArray.pushMap(handData)
            }
            
            promise.resolve(handsArray)
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error en hand tracking", e)
            promise.reject("HAND_TRACKING_ERROR", e.message, e)
        }
    }

    /**
     * Obtiene los planos detectados en la escena
     */
    @ReactMethod
    fun getScenePlanes(promise: Promise) {
        if (isSimulationMode) {
            // Simulación: Retornamos un plano de suelo falso
            val planesArray = Arguments.createArray()
            val floorPlane = Arguments.createMap().apply {
                putString("id", "sim-floor")
                putMap("normal", createVectorMap(0.0, 1.0, 0.0))
                putMap("center", createVectorMap(0.0, 0.0, 0.0))
                putMap("size", Arguments.createMap().apply {
                    putDouble("width", 2.0)
                    putDouble("height", 2.0)
                })
                putString("label", "floor")
                putDouble("confidence", 1.0)
            }
            planesArray.pushMap(floorPlane)
            promise.resolve(planesArray)
            return
        }
        
        try {
            val planes = sceneManager?.getDetectedPlanes() ?: emptyList()
            val planesArray = Arguments.createArray()
            
            planes.forEach { plane ->
                val planeMap = Arguments.createMap().apply {
                    putString("id", plane.id)
                    putMap("normal", createVectorMap(
                        plane.normal.x.toDouble(),
                        plane.normal.y.toDouble(),
                        plane.normal.z.toDouble()
                    ))
                    putMap("center", createVectorMap(
                        plane.center.x.toDouble(),
                        plane.center.y.toDouble(),
                        plane.center.z.toDouble()
                    ))
                    putString("label", plane.semanticLabel)
                    putDouble("confidence", plane.confidence.toDouble())
                }
                planesArray.pushMap(planeMap)
            }
            
            promise.resolve(planesArray)
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error en scene planes", e)
            promise.reject("SCENE_ERROR", e.message, e)
        }
    }

    /**
     * Obtiene los volúmenes detectados en la escena
     */
    @ReactMethod
    fun getSceneVolumes(promise: Promise) {
        if (isSimulationMode) {
            // Simulación: Retornamos una maleta falsa
            val volumesArray = Arguments.createArray()
            val suitcaseVolume = Arguments.createMap().apply {
                putString("id", "sim-suitcase")
                putMap("center", createVectorMap(0.5, 0.3, -1.0))
                putMap("size", Arguments.createMap().apply {
                    putDouble("width", 0.6)
                    putDouble("height", 0.4)
                    putDouble("depth", 0.3)
                })
                putString("label", "suitcase")
                putDouble("confidence", 0.9)
                putMap("bounds", Arguments.createMap().apply {
                    putMap("min", createVectorMap(0.2, 0.1, -1.15))
                    putMap("max", createVectorMap(0.8, 0.5, -0.85))
                })
            }
            volumesArray.pushMap(suitcaseVolume)
            promise.resolve(volumesArray)
            return
        }
        
        try {
            // Implementación real con Meta SDK
            val volumes = sceneManager?.getDetectedVolumes() ?: emptyList()
            val volumesArray = Arguments.createArray()
            
            volumes.forEach { volume ->
                // Filtrar solo objetos tipo "storage", "box", "suitcase" o similares
                val label = volume.semanticLabel.lowercase()
                if (label.contains("storage") ||
                    label.contains("box") ||
                    label.contains("suitcase") ||
                    label.contains("luggage") ||
                    label.contains("container")) {
                    
                    val volumeMap = Arguments.createMap().apply {
                        putString("id", volume.id)
                        putMap("center", createVectorMap(
                            volume.center.x.toDouble(),
                            volume.center.y.toDouble(),
                            volume.center.z.toDouble()
                        ))
                        putMap("size", Arguments.createMap().apply {
                            putDouble("width", volume.size.x.toDouble())
                            putDouble("height", volume.size.y.toDouble())
                            putDouble("depth", volume.size.z.toDouble())
                        })
                        putString("label", volume.semanticLabel)
                        putDouble("confidence", volume.confidence.toDouble())
                        
                        // Calcular bounds
                        val halfSize = Vector3(
                            volume.size.x / 2f,
                            volume.size.y / 2f,
                            volume.size.z / 2f
                        )
                        putMap("bounds", Arguments.createMap().apply {
                            putMap("min", createVectorMap(
                                (volume.center.x - halfSize.x).toDouble(),
                                (volume.center.y - halfSize.y).toDouble(),
                                (volume.center.z - halfSize.z).toDouble()
                            ))
                            putMap("max", createVectorMap(
                                (volume.center.x + halfSize.x).toDouble(),
                                (volume.center.y + halfSize.y).toDouble(),
                                (volume.center.z + halfSize.z).toDouble()
                            ))
                        })
                    }
                    volumesArray.pushMap(volumeMap)
                }
            }
            
            Log.d(TAG, "✅ Detectados ${volumesArray.size()} volúmenes relevantes")
            promise.resolve(volumesArray)
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error en scene detection", e)
            promise.reject("SCENE_ERROR", e.message, e)
        }
    }

    /**
     * Verifica si el dispositivo soporta las funciones de MR
     */
    @ReactMethod
    fun isSupported(promise: Promise) {
        if (isSimulationMode) {
            // En simulación decimos que SÍ es soportado para que la app arranque
            promise.resolve(true)
            return
        }
        
        try {
            val isSupported = spatialContext != null
            promise.resolve(isSupported)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    // Helpers

    private fun createVectorMap(x: Double, y: Double, z: Double): WritableMap {
        return Arguments.createMap().apply {
            putDouble("x", x)
            putDouble("y", y)
            putDouble("z", z)
        }
    }

    private fun createMockHandData(handType: String): WritableMap {
        val handData = Arguments.createMap()
        handData.putString("handType", handType)
        handData.putBoolean("isTracked", true)
        
        val jointsArray = Arguments.createArray()
        val baseX = if (handType == "left") -0.3 else 0.3
        
        // Generar 21 articulaciones mock
        for (i in 0 until 21) {
            val joint = Arguments.createMap().apply {
                putString("id", "$handType-joint-$i")
                putMap("position", createVectorMap(
                    baseX + (Math.random() - 0.5) * 0.1,
                    Math.random() * 0.2 + 0.5,
                    -0.5 + (Math.random() - 0.5) * 0.1
                ))
                putMap("rotation", createVectorMap(0.0, 0.0, 0.0))
                putDouble("confidence", 0.9)
            }
            jointsArray.pushMap(joint)
        }
        
        handData.putArray("joints", jointsArray)
        return handData
    }
}
