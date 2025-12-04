import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { PackingItem } from '../../types/packing.types';

interface FloatingItemProps {
    item: PackingItem;
    position: { x: number; y: number };
}

export const FloatingItem: React.FC<FloatingItemProps> = ({ item, position }) => {
    // Animation for the "pulse" effect on the hand indicator
    const pulseAnim = new Animated.Value(1);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    return (
        <View style={[styles.container, { left: position.x, top: position.y }]}>
            {/* Floating Label with 3D effect */}
            <View style={styles.labelContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.quantity && (
                        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                    )}
                </View>
            </View>

            {/* Hand Tracking Visualization */}
            <View style={styles.handIndicatorContainer}>
                <Animated.View
                    style={[
                        styles.pulseRing,
                        { transform: [{ scale: pulseAnim }] }
                    ]}
                />
                <View style={styles.touchIconContainer}>
                    <Text style={styles.touchIcon}>👆</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 2000,
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        transform: [{ rotate: '-15deg' }, { skewX: '-10deg' }],
        shadowColor: '#0dccf2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 8,
    },
    itemName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadowColor: 'rgba(13, 204, 242, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    itemQuantity: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0dccf2',
        textShadowColor: 'rgba(13, 204, 242, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    handIndicatorContainer: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(13, 204, 242, 0.8)',
        backgroundColor: 'rgba(13, 204, 242, 0.2)',
    },
    touchIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchIcon: {
        fontSize: 20,
        color: '#0dccf2',
    },
});
