import { create } from 'zustand';
import { PackingItem, PackingList } from '../types/packing.types';

interface PackingStore {
  lists: PackingList[];
  selectedListId: string | null;
  currentList: PackingList;
  isHandTracking: boolean;
  isPassthroughActive: boolean;
  detectedSuitcase: boolean;
  isPackingListVisible: boolean;
  isDraggingItem: boolean;
  draggedItem: PackingItem | null;

  // Actions
  initializeList: () => void;
  selectList: (listId: string) => void;
  createNewList: (name: string, icon?: string) => void;
  deleteList: (listId: string) => void;
  addItem: (item: Omit<PackingItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  toggleItemPacked: (itemId: string) => void;
  setHandTracking: (enabled: boolean) => void;
  setPassthroughActive: (active: boolean) => void;
  setDetectedSuitcase: (detected: boolean) => void;
  setPackingListVisible: (visible: boolean) => void;
  setDraggingItem: (item: PackingItem | null) => void;
  getPackedItems: () => PackingItem[];
  getUnpackedItems: () => PackingItem[];
  isAllPacked: () => boolean;
}

const createInitialLists = (): PackingList[] => [
  {
    id: '1',
    name: 'Viaje a la Playa',
    icon: '🏖️',
    items: [
      { id: '1', name: 'Traje de baño', category: 'clothing', packed: false, icon: '🩱' },
      { id: '2', name: 'Bloqueador solar', category: 'toiletries', packed: false, icon: '🧴' },
      { id: '3', name: 'Toalla', category: 'other', packed: false, icon: '🏖️' },
      { id: '4', name: 'Lentes de sol', category: 'other', packed: false, icon: '🕶️' },
      { id: '5', name: 'Sandalias', category: 'clothing', packed: false, icon: '🩴' },
      { id: '6', name: 'Cámara', category: 'electronics', packed: false, icon: '📷' },
      { id: '7', name: 'Sombrero', category: 'clothing', packed: false, icon: '🎩' },
    ],
    createdAt: new Date('2024-05-24'),
    updatedAt: new Date('2024-05-24'),
  },
  {
    id: '2',
    name: 'Fin de Semana en la Montaña',
    icon: '⛰️',
    items: [
      { id: '1', name: 'Chaqueta', category: 'clothing', packed: false, icon: '🧥' },
      { id: '2', name: 'Botas', category: 'clothing', packed: false, icon: '🥾' },
      { id: '3', name: 'Mochila', category: 'other', packed: false, icon: '🎒' },
      { id: '4', name: 'Linterna', category: 'electronics', packed: false, icon: '🔦' },
      { id: '5', name: 'Botella de agua', category: 'other', packed: false, icon: '💧' },
    ],
    createdAt: new Date('2024-05-12'),
    updatedAt: new Date('2024-05-12'),
  },
  {
    id: '3',
    name: 'Conferencia de Negocios',
    icon: '💼',
    items: [
      { id: '1', name: 'Traje', category: 'clothing', packed: false, icon: '🤵' },
      { id: '2', name: 'Laptop', category: 'electronics', packed: false, icon: '💻' },
      { id: '3', name: 'Documentos', category: 'documents', packed: false, icon: '📄' },
      { id: '4', name: 'Tarjetas de presentación', category: 'documents', packed: false, icon: '💳' },
      { id: '5', name: 'Cargador', category: 'electronics', packed: false, icon: '🔌' },
      { id: '6', name: 'Zapatos formales', category: 'clothing', packed: false, icon: '👞' },
      { id: '7', name: 'Corbata', category: 'clothing', packed: false, icon: '👔' },
      { id: '8', name: 'Portafolio', category: 'other', packed: false, icon: '💼' },
      { id: '9', name: 'Perfume', category: 'toiletries', packed: false, icon: '🧴' },
      { id: '10', name: 'Reloj', category: 'other', packed: false, icon: '⌚' },
    ],
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01'),
  },
];

export const usePackingStore = create<PackingStore>((set, get) => {
  const initialLists = createInitialLists();
  return {
    lists: initialLists,
    selectedListId: initialLists[0].id, // Select "Viaje a la Playa" by default
    currentList: initialLists[0],
    isHandTracking: false,
    isPassthroughActive: false,
    detectedSuitcase: false,
    isPackingListVisible: false,
    isDraggingItem: false,
    draggedItem: null,

    initializeList: () => {
      const lists = createInitialLists();
      set({ lists, selectedListId: lists[0].id, currentList: lists[0] });
    },

    selectList: (listId) => {
      const state = get();
      const selectedList = state.lists.find(list => list.id === listId);
      if (selectedList) {
        set({ selectedListId: listId, currentList: selectedList });
      }
    },

    createNewList: (name, icon = '🧳') => {
      const newList: PackingList = {
        id: Date.now().toString(),
        name,
        icon,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      set((state) => ({
        lists: [...state.lists, newList],
        selectedListId: newList.id,
        currentList: newList,
      }));
    },

    deleteList: (listId) => {
      set((state) => {
        const newLists = state.lists.filter(list => list.id !== listId);
        const newSelectedId = newLists.length > 0 ? newLists[0].id : null;
        const newCurrentList = newLists.length > 0 ? newLists[0] : state.currentList;
        return {
          lists: newLists,
          selectedListId: newSelectedId,
          currentList: newCurrentList,
        };
      });
    },

    addItem: (item) => {
      const newItem: PackingItem = {
        ...item,
        id: Date.now().toString(),
      };

      set((state) => {
        const updatedList = {
          ...state.currentList,
          items: [...state.currentList.items, newItem],
          updatedAt: new Date(),
        };
        return {
          currentList: updatedList,
          lists: state.lists.map(list =>
            list.id === state.currentList.id ? updatedList : list
          ),
        };
      });
    },

    removeItem: (itemId) => {
      set((state) => {
        const updatedList = {
          ...state.currentList,
          items: state.currentList.items.filter(item => item.id !== itemId),
          updatedAt: new Date(),
        };
        return {
          currentList: updatedList,
          lists: state.lists.map(list =>
            list.id === state.currentList.id ? updatedList : list
          ),
        };
      });
    },

    toggleItemPacked: (itemId) => {
      set((state) => {
        const updatedList = {
          ...state.currentList,
          items: state.currentList.items.map(item =>
            item.id === itemId ? { ...item, packed: !item.packed } : item
          ),
          updatedAt: new Date(),
        };
        return {
          currentList: updatedList,
          lists: state.lists.map(list =>
            list.id === state.currentList.id ? updatedList : list
          ),
        };
      });
    },

    setHandTracking: (enabled) => set({ isHandTracking: enabled }),
    setPassthroughActive: (active) => set({ isPassthroughActive: active }),
    setDetectedSuitcase: (detected) => set({ detectedSuitcase: detected }),
    setPackingListVisible: (visible) => set({ isPackingListVisible: visible }),
    setDraggingItem: (item) => set({
      isDraggingItem: item !== null,
      draggedItem: item
    }),

    getPackedItems: () => {
      const state = get();
      return state.currentList.items.filter(item => item.packed);
    },

    getUnpackedItems: () => {
      const state = get();
      return state.currentList.items.filter(item => !item.packed);
    },

    isAllPacked: () => {
      const state = get();
      return state.currentList.items.length > 0 && state.currentList.items.every(item => item.packed);
    },
  };
});