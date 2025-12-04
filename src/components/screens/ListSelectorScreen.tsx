import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from 'react-native';
import { PackingList } from '../../types/packing.types';

interface ListSelectorScreenProps {
    lists: PackingList[];
    selectedListId: string | null;
    onSelectList: (listId: string) => void;
    onCreateList: () => void;
    onStartPacking: () => void;
    onEditList: (listId: string) => void;
    onDeleteList: (listId: string) => void;
    onBack: () => void;
}

const { width } = Dimensions.get('window');

export const ListSelectorScreen: React.FC<ListSelectorScreenProps> = ({
    lists,
    selectedListId,
    onSelectList,
    onCreateList,
    onStartPacking,
    onEditList,
    onDeleteList,
    onBack,
}) => {
    const renderListItem = ({ item }: { item: PackingList }) => {
        const isSelected = item.id === selectedListId;
        const packedCount = item.items.filter(i => i.packed).length;
        const totalCount = item.items.length;
        const createdDate = new Date(item.createdAt).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });

        return (
            <TouchableOpacity
                style={[
                    styles.listItem,
                    isSelected && styles.listItemSelected,
                ]}
                onPress={() => {
                    console.log('📋 Lista seleccionada:', item.name, 'ID:', item.id);
                    onSelectList(item.id);
                }}
                activeOpacity={0.7}
            >
                <View style={styles.listItemContent}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <Text style={styles.iconText}>{item.icon || '🧳'}</Text>
                    </View>

                    {/* Info */}
                    <View style={styles.listInfo}>
                        <Text style={styles.listName} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Text style={styles.listMeta} numberOfLines={1}>
                            {packedCount}/{totalCount} items | Creado: {createdDate}
                        </Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.listActions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            console.log('✏️ Editar lista:', item.name);
                            onEditList(item.id);
                        }}
                    >
                        <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            console.log('🗑️ Eliminar lista:', item.name);
                            onDeleteList(item.id);
                        }}
                    >
                        <Text style={styles.actionIcon}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.panel}>
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        console.log('🔙 Botón Atrás presionado');
                        onBack();
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backButtonText}>← Atrás</Text>
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Selecciona tu Lista</Text>
                </View>

                {/* List */}
                <View style={styles.listContainer}>
                    <FlatList
                        data={lists}
                        renderItem={renderListItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => {
                            console.log('➕ Crear Nueva Lista presionado');
                            onCreateList();
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.createButtonIcon}>➕</Text>
                        <Text style={styles.createButtonText}>Crear Nueva Lista</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={() => {
                            console.log('🧳 Iniciar Empaque presionado');
                            onStartPacking();
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.startButtonText}>Iniciar Empaque</Text>
                        <Text style={styles.startButtonIcon}>🧳</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 16, // Restaurar margen
        justifyContent: 'center', // Centrar verticalmente
        alignItems: 'center', // Centrar horizontalmente
    },
    panel: {
        width: '100%',
        maxWidth: 600, // Limitar ancho en pantallas grandes
        height: '100%', // Ocupar altura disponible
        maxHeight: '90%', // Dejar un poco de aire arriba y abajo
        backgroundColor: 'rgba(16, 31, 34, 0.95)', // Un poco más opaco
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(13, 204, 242, 0.2)',
        shadowColor: '#0dccf2',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        overflow: 'hidden',
    },
    header: {
        padding: 24,
        paddingTop: 60, // Espacio para el botón de atrás
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    listContainer: {
        maxHeight: 400,
        paddingHorizontal: 16,
    },
    listContent: {
        gap: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        padding: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    listItemSelected: {
        backgroundColor: 'rgba(13, 204, 242, 0.2)',
        borderColor: '#0dccf2',
        shadowColor: '#0dccf2',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    listItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: 'rgba(13, 204, 242, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 24,
        color: '#0dccf2',
    },
    listInfo: {
        flex: 1,
    },
    listName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    listMeta: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    listActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 18,
        opacity: 0.7,
    },
    actionButtons: {
        padding: 16,
        paddingTop: 24,
        gap: 12,
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(13, 204, 242, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(13, 204, 242, 0.5)',
        borderRadius: 8,
        height: 48,
        gap: 8,
    },
    createButtonIcon: {
        fontSize: 20,
        color: '#0dccf2',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0dccf2',
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0dccf2',
        borderRadius: 8,
        height: 56,
        gap: 8,
        shadowColor: '#0dccf2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101f22',
    },
    startButtonIcon: {
        fontSize: 20,
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    backButtonText: {
        fontSize: 16,
        color: '#0dccf2',
        fontWeight: '600',
    },
});
