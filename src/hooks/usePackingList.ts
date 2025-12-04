import { usePackingStore } from '../store/packingStore';
import { PackingItem } from '../types/packing.types';

export const usePackingList = () => {
  const {
    currentList,
    isDraggingItem,
    draggedItem,
    addItem,
    removeItem,
    toggleItemPacked,
    setDraggingItem,
    getPackedItems,
    getUnpackedItems,
    isAllPacked,
  } = usePackingStore();

  const handleItemDragStart = (item: PackingItem) => {
    console.log('Iniciando arrastre de item:', item.name);
    setDraggingItem(item);
  };

  const handleItemDragEnd = () => {
    console.log('Finalizando arrastre');
    setDraggingItem(null);
  };

  const handleDropOnSuitcase = () => {
    if (draggedItem) {
      console.log('Soltando item en maleta:', draggedItem.name);
      toggleItemPacked(draggedItem.id);
      setDraggingItem(null);
      return true;
    }
    return false;
  };

  const addNewItem = (name: string, category: PackingItem['category']) => {
    addItem({
      name,
      category,
      packed: false,
      icon: getIconForCategory(category),
    });
  };

  const getIconForCategory = (category: PackingItem['category']): string => {
    const icons = {
      clothing: '👕',
      documents: '📄',
      electronics: '📱',
      toiletries: '🧴',
      other: '📦',
    };
    return icons[category];
  };

  const getProgress = () => {
    const packed = getPackedItems().length;
    const total = currentList.items.length;
    return total > 0 ? (packed / total) * 100 : 0;
  };

  return {
    // Estado
    currentList,
    isDraggingItem,
    draggedItem,
    
    // Métodos
    handleItemDragStart,
    handleItemDragEnd,
    handleDropOnSuitcase,
    addNewItem,
    removeItem,
    toggleItemPacked,
    
    // Computed
    packedItems: getPackedItems(),
    unpackedItems: getUnpackedItems(),
    isAllPacked: isAllPacked(),
    progress: getProgress(),
  };
};