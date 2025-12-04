import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
    Platform,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { spatialSDK } from '../../services/spatial-sdk-simulator';
import { useSceneStore } from '../../store/sceneStore';
import { usePackingStore } from '../../store/packingStore';

const { width, height } = Dimensions.get('window');

interface ScanningScreenProps {
    onBack?: () => void;
}

export const ScanningScreen: React.FC<ScanningScreenProps> = ({ onBack }) => {
    const { setSceneData } = useSceneStore();
    const { setDetectedSuitcase } = usePackingStore();

    const handleSimulateDetection = async () => {
        console.log('🕵️ Simulación manual activada');
        spatialSDK.simulateSuitcaseDetection(true);

        // Forzar actualización del store
        const volumes = await spatialSDK.getSceneVolumes();
        const planes = await spatialSDK.getScenePlanes();

        setSceneData({
            planes,
            volumes,
            timestamp: Date.now(),
            isScanning: false
        });
        setDetectedSuitcase(true);
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={handleSimulateDetection}
        >
            {/* Dark overlay to simulate the passthrough dimming */}
            <View style={styles.overlay} />

            {/* Back Button - Minimalist Style */}
            {onBack && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        console.log('🔙 Botón Atrás presionado desde escaneo');
                        onBack();
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backButtonText}>← Atrás</Text>
                </TouchableOpacity>
            )}

            {/* Central Reticule/Pointer */}
            <View style={styles.reticleContainer}>
                {/* Center Dot */}
                <View style={styles.reticleDot} />
                {/* Outer Ring */}
                <View style={styles.reticleRing} />
            </View>

            {/* Main UI Overlay */}
            <View style={styles.uiContainer}>

                {/* Status Indicator & Hint */}
                <View style={styles.statusSection}>
                    {/* Pill-shaped Status Badge */}
                    <View style={styles.statusBadge}>
                        <View style={styles.iconContainer}>
                            <ActivityIndicator size="small" color="#00ffff" />
                        </View>
                        <Text style={styles.statusText}>Buscando superficies...</Text>
                    </View>

                    {/* Instructional Hint */}
                    <View style={styles.hintBadge}>
                        <Text style={styles.hintText}>Mire una superficie plana (suelo, mesa)</Text>
                    </View>
                </View>

                {/* Virtual Hand Outlines - Large and in corners */}
                <View style={styles.handsContainer}>
                    {/* Left Hand */}
                    <View style={[styles.handWrapper, styles.leftHandPosition]}>
                        <Text style={styles.handIcon}>✋</Text>
                    </View>

                    {/* Right Hand */}
                    <View style={[styles.handWrapper, styles.rightHandPosition]}>
                        <Text style={styles.handIcon}>✋</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay
    },
    // Minimalist Back Button
    backButton: {
        position: 'absolute',
        top: 50, // Safe area
        left: 20,
        zIndex: 2000,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: '#0dccf2',
        fontWeight: '600',
    },
    // Reticle
    reticleContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 40,
        height: 40,
        marginLeft: -20,
        marginTop: -20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    reticleDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(0, 255, 255, 0.8)',
    },
    reticleRing: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 255, 0.4)',
    },
    // UI Container
    uiContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 40,
    },
    statusSection: {
        alignItems: 'center',
        marginBottom: 100, // Space for hands
        width: '100%',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker background for contrast
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    iconContainer: {
        marginRight: 12,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
        letterSpacing: 0.5,
    },
    hintBadge: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    hintText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontWeight: '300',
    },
    // Hands
    handsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200, // Area for hands
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        pointerEvents: 'none', // Allow clicks to pass through
    },
    handWrapper: {
        opacity: 0.3, // Ghostly appearance
        transform: [{ scale: 1.5 }], // Make them large
    },
    leftHandPosition: {
        position: 'absolute',
        bottom: -20,
        left: 20,
        transform: [{ scale: 2 }, { scaleX: -1 }], // Mirror and scale
    },
    rightHandPosition: {
        position: 'absolute',
        bottom: -20,
        right: 20,
        transform: [{ scale: 2 }], // Scale
    },
    handIcon: {
        fontSize: 100, // Giant emoji
        color: '#FFFFFF',
    },
});
