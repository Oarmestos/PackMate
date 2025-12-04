import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';

interface WelcomeScreenProps {
    onStart: () => void;
}

const { width } = Dimensions.get('window');

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    return (
        <View style={styles.container}>
            {/* Main Panel */}
            <View style={styles.panel}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Welcome to PackMate</Text>
                        <Text style={styles.subtitle}>
                            Your intelligent packing assistant in Mixed Reality.
                        </Text>
                    </View>

                    {/* Spacer */}
                    <View style={styles.divider} />

                    {/* Permissions Section */}
                    <View style={styles.permissionsSection}>
                        <Text style={styles.sectionTitle}>Required Permissions</Text>

                        <View style={styles.permissionsList}>
                            {/* Camera Access ListItem */}
                            <View style={styles.permissionItem}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.icon}>📹</Text>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.permissionTitle}>Camera Access</Text>
                                    <Text style={styles.permissionDescription}>
                                        To see your real-world space and place virtual items.
                                    </Text>
                                </View>
                            </View>

                            {/* Hand Tracking ListItem */}
                            <View style={styles.permissionItem}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.icon}>✋</Text>
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.permissionTitle}>Hand Tracking</Text>
                                    <Text style={styles.permissionDescription}>
                                        To interact with your packing list using your hands.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* CTA Section */}
                    <View style={styles.ctaSection}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={onStart}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.buttonText}>Begin Setup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    panel: {
        width: '100%',
        maxWidth: 600,
        backgroundColor: 'rgba(16, 31, 34, 0.85)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#0dccf2',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    content: {
        padding: 24, // p-6
        paddingBottom: 32, // md:p-8
    },
    header: {
        alignItems: 'center',
    },
    title: {
        fontSize: 30, // text-3xl
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
        ...Platform.select({
            android: { fontFamily: 'sans-serif-medium' },
        }),
    },
    subtitle: {
        fontSize: 16, // text-base
        color: 'rgba(255, 255, 255, 0.8)', // text-white/80
        textAlign: 'center',
        lineHeight: 24,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // bg-white/10
        marginVertical: 24, // my-6
    },
    permissionsSection: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20, // text-xl
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    permissionsList: {
        gap: 12, // gap-3
    },
    permissionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // bg-white/5
        borderRadius: 8, // rounded-lg
        padding: 16, // p-4
        marginBottom: 12, // gap-3 implementation for RN < 0.71
    },
    iconContainer: {
        width: 48, // h-12 w-12
        height: 48,
        borderRadius: 8, // rounded-lg
        backgroundColor: 'rgba(13, 204, 242, 0.2)', // bg-primary/20
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16, // gap-4
    },
    icon: {
        fontSize: 24, // text-3xl
        color: '#0dccf2', // text-primary
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    permissionTitle: {
        fontSize: 16, // text-base
        fontWeight: '500', // font-medium
        color: '#FFFFFF',
        marginBottom: 2,
    },
    permissionDescription: {
        fontSize: 14, // text-sm
        color: 'rgba(255, 255, 255, 0.7)', // text-white/70
        lineHeight: 20,
    },
    ctaSection: {
        marginTop: 32, // mt-8
    },
    button: {
        backgroundColor: '#0dccf2', // bg-primary
        borderRadius: 8, // rounded-lg
        paddingVertical: 12, // py-3
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#101f22', // text-background-dark
        fontSize: 16, // text-base
        fontWeight: 'bold',
    },
});
