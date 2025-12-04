import { renderHook, act } from '@testing-library/react-hooks';
import { usePackingStore } from '../../src/store/packingStore';

describe('packingStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => usePackingStore());
    act(() => {
      result.current.initializeList();
    });
  });

  describe('initializeList', () => {
    it('should initialize with default packing list', () => {
      const { result } = renderHook(() => usePackingStore());
      
      expect(result.current.currentList).toBeDefined();
      expect(result.current.currentList.name).toBe('Viaje de Negocios');
      expect(result.current.currentList.items).toHaveLength(5);
    });

    it('should have correct default items', () => {
      const { result } = renderHook(() => usePackingStore());
      
      const itemNames = result.current.currentList.items.map(item => item.name);
      expect(itemNames).toContain('Camisas');
      expect(itemNames).toContain('Pasaporte');
      expect(itemNames).toContain('Zapatos');
      expect(itemNames).toContain('Cargador');
      expect(itemNames).toContain('Cepillo de dientes');
    });
  });

  describe('addItem', () => {
    it('should add a new item to the list', () => {
      const { result } = renderHook(() => usePackingStore());
      
      const initialCount = result.current.currentList.items.length;
      
      act(() => {
        result.current.addItem({
          name: 'Laptop',
          category: 'electronics',
          packed: false,
          icon: '💻',
        });
      });
      
      expect(result.current.currentList.items).toHaveLength(initialCount + 1);
      expect(result.current.currentList.items[initialCount].name).toBe('Laptop');
    });

    it('should assign unique id to new item', () => {
      const { result } = renderHook(() => usePackingStore());
      
      act(() => {
        result.current.addItem({
          name: 'Item 1',
          category: 'clothing',
          packed: false,
          icon: '👕',
        });
      });
      
      const item1 = result.current.currentList.items[result.current.currentList.items.length - 1];
      
      act(() => {
        result.current.addItem({
          name: 'Item 2',
          category: 'clothing',
          packed: false,
          icon: '👖',
        });
      });
      
      const item2 = result.current.currentList.items[result.current.currentList.items.length - 1];
      
      expect(item1.id).not.toBe(item2.id);
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the list', () => {
      const { result } = renderHook(() => usePackingStore());
      
      const itemToRemove = result.current.currentList.items[0];
      const initialCount = result.current.currentList.items.length;
      
      act(() => {
        result.current.removeItem(itemToRemove.id);
      });
      
      expect(result.current.currentList.items).toHaveLength(initialCount - 1);
      expect(result.current.currentList.items.find(item => item.id === itemToRemove.id)).toBeUndefined();
    });

    it('should not affect other items when removing', () => {
      const { result } = renderHook(() => usePackingStore());
      
      const itemToKeep = result.current.currentList.items[1];
      const itemToRemove = result.current.currentList.items[0];
      
      act(() => {
        result.current.removeItem(itemToRemove.id);
      });
      
      expect(result.current.currentList.items.find(item => item.id === itemToKeep.id)).toBeDefined();
    });
  });

  describe('toggleItemPacked', () => {
    it('should toggle item packed status', () => {
      const { result } = renderHook(() => usePackingStore());
      
      const item = result.current.currentList.items[0];
      const initialPackedStatus = item.packed;
      
      act(() => {
        result.current.toggleItemPacked(item.id);
      });
      
      const updatedItem = result.current.currentList.items.find(i => i.id === item.id);
      expect(updatedItem?.packed).toBe(!initialPackedStatus);
    });

    it('should toggle back to original status', () => {
      const { result } = renderHook(() => usePackingStore());
      
      const item = result.current.currentList.items[0];
      const initialPackedStatus = item.packed;
      
      act(() => {
        result.current.toggleItemPacked(item.id);
        result.current.toggleItemPacked(item.id);
      });
      
      const updatedItem = result.current.currentList.items.find(i => i.id === item.id);
      expect(updatedItem?.packed).toBe(initialPackedStatus);
    });
  });

  describe('setDraggingItem', () => {
    it('should set dragging item and update isDraggingItem flag', () => {
      const { result } = renderHook(() => usePackingStore());
      
      const item = result.current.currentList.items[0];
      
      act(() => {
        result.current.setDraggingItem(item);
      });
      
      expect(result.current.isDraggingItem).toBe(true);
      expect(result.current.draggedItem).toEqual(item);
    });

    it('should clear dragging item when set to null', () => {
      const { result } = renderHook(() => usePackingStore());
      
      const item = result.current.currentList.items[0];
      
      act(() => {
        result.current.setDraggingItem(item);
        result.current.setDraggingItem(null);
      });
      
      expect(result.current.isDraggingItem).toBe(false);
      expect(result.current.draggedItem).toBeNull();
    });
  });

  describe('getPackedItems', () => {
    it('should return only packed items', () => {
      const { result } = renderHook(() => usePackingStore());
      
      act(() => {
        result.current.toggleItemPacked(result.current.currentList.items[0].id);
        result.current.toggleItemPacked(result.current.currentList.items[1].id);
      });
      
      const packedItems = result.current.getPackedItems();
      expect(packedItems).toHaveLength(2);
      expect(packedItems.every(item => item.packed)).toBe(true);
    });
  });

  describe('getUnpackedItems', () => {
    it('should return only unpacked items', () => {
      const { result } = renderHook(() => usePackingStore());
      
      act(() => {
        result.current.toggleItemPacked(result.current.currentList.items[0].id);
      });
      
      const unpackedItems = result.current.getUnpackedItems();
      expect(unpackedItems).toHaveLength(4);
      expect(unpackedItems.every(item => !item.packed)).toBe(true);
    });
  });

  describe('isAllPacked', () => {
    it('should return false when not all items are packed', () => {
      const { result } = renderHook(() => usePackingStore());
      
      expect(result.current.isAllPacked()).toBe(false);
    });

    it('should return true when all items are packed', () => {
      const { result } = renderHook(() => usePackingStore());
      
      act(() => {
        result.current.currentList.items.forEach(item => {
          result.current.toggleItemPacked(item.id);
        });
      });
      
      expect(result.current.isAllPacked()).toBe(true);
    });
  });

  describe('state flags', () => {
    it('should update hand tracking state', () => {
      const { result } = renderHook(() => usePackingStore());
      
      act(() => {
        result.current.setHandTracking(true);
      });
      
      expect(result.current.isHandTracking).toBe(true);
    });

    it('should update passthrough active state', () => {
      const { result } = renderHook(() => usePackingStore());
      
      act(() => {
        result.current.setPassthroughActive(true);
      });
      
      expect(result.current.isPassthroughActive).toBe(true);
    });

    it('should update detected suitcase state', () => {
      const { result } = renderHook(() => usePackingStore());
      
      act(() => {
        result.current.setDetectedSuitcase(true);
      });
      
      expect(result.current.detectedSuitcase).toBe(true);
    });

    it('should update packing list visibility', () => {
      const { result } = renderHook(() => usePackingStore());
      
      act(() => {
        result.current.setPackingListVisible(true);
      });
      
      expect(result.current.isPackingListVisible).toBe(true);
    });
  });
});
