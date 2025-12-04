import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ContextualHintProps {
    message: string;
    icon?: string;
}

export const ContextualHint: React.FC<ContextualHintProps> = ({ message, icon = '👜' }) => {
    return (
        <View style={styles.container}>
            <View style={styles.pill}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={styles.text}>{message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 32,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1500,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // bg-black/40
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 9999, // rounded-full
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 8,
    },
    icon: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
    },
});
