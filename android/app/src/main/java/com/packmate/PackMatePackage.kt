package com.packmate

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * Package para registrar el módulo nativo PackMateModule en React Native
 * 
 * Este package debe ser agregado a la lista de packages en MainApplication.kt
 */
class PackMatePackage : ReactPackage {

    /**
     * Crea y retorna la lista de módulos nativos
     * En este caso, solo PackMateModule
     */
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(PackMateModule(reactContext))
    }

    /**
     * Crea y retorna la lista de View Managers
     * PackMate no requiere View Managers personalizados por ahora
     */
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
