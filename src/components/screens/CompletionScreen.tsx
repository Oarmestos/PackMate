import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface CompletionScreenProps {
    onReset: () => void;
}

const { width, height } = Dimensions.get('window');

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ onReset }) => {
    const handleReset = () => {
        console.log('🔄 CompletionScreen: Botón Hecho presionado');
        onReset();
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Animated Icon Circle */}
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>✓</Text>
                </View>

                {/* Headline */}
                <Text style={styles.title}>¡Todo empacado!</Text>

                {/* Body Text */}
                <Text style={styles.subtitle}>¡Que tengas un buen viaje!</Text>

                {/* Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleReset}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Hecho</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
    },
    content: {
        alignItems: 'center',
        width: '90%',
        padding: 20,
    },
    iconContainer: {
        width: 96, // h-24 w-24
        height: 96,
        borderRadius: 48, // rounded-full
        backgroundColor: 'rgba(13, 204, 242, 0.2)', // bg-primary/20
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24, // mb-6
    },
    icon: {
        fontSize: 48, // text-6xl approx
        color: '#0dccf2', // text-primary
        fontWeight: 'bold',
    },
    title: {
        fontSize: 32, // text-[32px]
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12, // pb-3
        textAlign: 'center',
        letterSpacing: -0.5, // tracking-light
    },
    subtitle: {
        fontSize: 16, // text-base
        color: '#FFFFFF',
        marginBottom: 32, // pb-8
        textAlign: 'center',
        fontWeight: '400',
    },
    button: {
        backgroundColor: '#0dccf2', // bg-primary
        width: 192, // w-48
        height: 48, // h-12
        borderRadius: 8, // rounded-lg
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#101f22', // text-background-dark
        fontSize: 16, // text-base
        fontWeight: 'bold',
        letterSpacing: 0.2, // tracking-[0.015em]
    },
});
