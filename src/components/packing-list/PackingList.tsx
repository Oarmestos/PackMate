import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { PackingItem } from '../../types/packing.types';
import { usePackingList } from '../../hooks/usePackingList';

interface PackingListProps {
  isVisible: boolean;
  style?: any;
}

const { width, height } = Dimensions.get('window');

export const PackingList: React.FC<PackingListProps> = ({ isVisible, style }) => {
  const {
    currentList,
    packedItems,
    isDraggingItem,
    handleItemDragStart,
    toggleItemPacked,
    addNewItem,
  } = usePackingList();

  const renderItem = ({ item }: { item: PackingItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => toggleItemPacked(item.id)}
      activeOpacity={0.7}
      disabled={isDraggingItem}
    >
      {/* Checkbox */}
      <View style={[
        styles.checkbox,
        item.packed && styles.checkboxChecked
      ]}>
        {item.packed && <Text style={styles.checkmark}>✓</Text>}
      </View>

      {/* Item Content */}
      <View style={styles.itemContent}>
        <Text style={[
          styles.itemName,
          item.packed && styles.itemNamePacked
        ]}>
          {item.name}
        </Text>
        {item.quantity && (
          <Text style={styles.itemQuantity}>x{item.quantity}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (!isVisible) {
    return null;
  }

  const totalItems = currentList.items.length;
  const packedCount = packedItems.length;
  const progress = totalItems > 0 ? (packedCount / totalItems) * 100 : 0;

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{currentList.name}</Text>

        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {packedCount} / {totalItems} Packed
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* List */}
      <View style={styles.listContainer}>
        <FlatList
          data={currentList.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {/* Footer / Add Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addNewItem('New Item', 'other')}
        >
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#101f22', // background-dark
    borderRadius: 12, // rounded-xl
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // border-white/10
    width: 380, // max-w-sm approx
    maxHeight: height * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -0.5, // tracking-light
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0dccf2', // primary
    borderRadius: 4,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8, // rounded-lg
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0dccf2', // primary
    borderColor: '#0dccf2',
  },
  checkmark: {
    color: '#101f22',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  itemName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  itemNamePacked: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  itemQuantity: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footer: {
    padding: 24,
    paddingTop: 16,
  },
  addButton: {
    backgroundColor: '#0dccf2', // primary
    height: 56, // h-14
    borderRadius: 8, // rounded-lg
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  addButtonIcon: {
    fontSize: 24,
    color: '#101f22', // text-background-dark
    fontWeight: 'bold',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#101f22', // text-background-dark
    letterSpacing: 0.5, // tracking-wide
  },
});