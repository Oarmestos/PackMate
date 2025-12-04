import { NativeModules } from 'react-native';
import { NativeBridgeInterface } from '../types/services.types';
import { HandData } from '../types/hand.types';
import { Plane, Volume } from '../types/scene.types';

const { PackMateModule } = NativeModules;

/**
 * Servicio real del Meta Spatial SDK
 * Usa el módulo nativo (PackMateModule) para comunicarse con el SDK
 * 
 * Este servicio funciona en modo HÍBRIDO:
 * - En Meta Quest: Usa el SDK real
 * - En móvil Android: Usa simulación automáticamente
 */
export class MetaSpatialSDK implements NativeBridgeInterface {

    async startPassthrough(): Promise<boolean> {
        try {
            const result = await PackMateModule.startPassthrough();
            console.log('[MetaSDK] Passthrough iniciado:', result);
            return result;
        } catch (error) {
            console.error('[MetaSDK] Error en startPassthrough:', error);
            return false;
        }
    }

    async stopPassthrough(): Promise<boolean> {
        try {
            const result = await PackMateModule.stopPassthrough();
            console.log('[MetaSDK] Passthrough detenido:', result);
            return result;
        } catch (error) {
            console.error('[MetaSDK] Error en stopPassthrough:', error);
            return false;
        }
    }

    async getHandJoints(): Promise<HandData[]> {
        try {
            const hands = await PackMateModule.getHandJoints();
            return hands || [];
        } catch (error) {
            console.error('[MetaSDK] Error en getHandJoints:', error);
            return [];
        }
    }

    async getScenePlanes(): Promise<Plane[]> {
        try {
            const planes = await PackMateModule.getScenePlanes();
            return planes || [];
        } catch (error) {
            console.error('[MetaSDK] Error en getScenePlanes:', error);
            return [];
        }
    }

    async getSceneVolumes(): Promise<Volume[]> {
        try {
            const volumes = await PackMateModule.getSceneVolumes();
            return volumes || [];
        } catch (error) {
            console.error('[MetaSDK] Error en getSceneVolumes:', error);
            return [];
        }
    }

    async isSupported(): Promise<boolean> {
        try {
            const supported = await PackMateModule.isSupported();
            console.log('[MetaSDK] Soporte del dispositivo:', supported);
            return supported;
        } catch (error) {
            console.error('[MetaSDK] Error en isSupported:', error);
            return false;
        }
    }
}

// Exportar instancia única
export const metaSpatialSDK = new MetaSpatialSDK();

// También exportar como spatialSDK para compatibilidad con código existente
export const spatialSDK = metaSpatialSDK;
