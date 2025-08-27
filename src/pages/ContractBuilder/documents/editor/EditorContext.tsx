import React, { createContext, useContext, useState, ReactNode } from 'react';

// Context for Contract Builder Editor State
interface EditorState {
  selectedMainTab: 'design' | 'preview' | 'html' | 'json';
  selectedScreenSize: 'desktop' | 'mobile';
  inspectorDrawerOpen: boolean;
  samplesDrawerOpen: boolean;
  document: any;
}

interface EditorContextType extends EditorState {
  setSelectedMainTab: (tab: 'design' | 'preview' | 'html' | 'json') => void;
  setSelectedScreenSize: (size: 'desktop' | 'mobile') => void;
  setInspectorDrawerOpen: (open: boolean) => void;
  setSamplesDrawerOpen: (open: boolean) => void;
  setDocument: (doc: any) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const defaultDocument = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#FFFFFF',
      canvasColor: '#FFFFFF',
      textColor: '#242424',
      fontFamily: 'MODERN_SANS',
      childrenIds: ['block-1'],
    },
  },
  'block-1': {
    type: 'Text',
    data: {
      style: {
        color: '#333333',
        backgroundColor: 'transparent',
        fontSize: 16,
        textAlign: 'left',
        padding: {
          top: 16,
          bottom: 16,
          left: 24,
          right: 24,
        },
      },
      props: {
        text: 'Start building your contract by dragging elements from the left panel...',
      },
    },
  },
};

export function EditorProvider({ children }: { children: ReactNode }) {
  const [selectedMainTab, setSelectedMainTab] = useState<'design' | 'preview' | 'html' | 'json'>('design');
  const [selectedScreenSize, setSelectedScreenSize] = useState<'desktop' | 'mobile'>('desktop');
  const [inspectorDrawerOpen, setInspectorDrawerOpen] = useState(true);
  const [samplesDrawerOpen, setSamplesDrawerOpen] = useState(true);
  const [document, setDocument] = useState(defaultDocument);

  const value: EditorContextType = {
    selectedMainTab,
    selectedScreenSize,
    inspectorDrawerOpen,
    samplesDrawerOpen,
    document,
    setSelectedMainTab,
    setSelectedScreenSize,
    setInspectorDrawerOpen,
    setSamplesDrawerOpen,
    setDocument,
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

// Hooks
export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider');
  }
  return context;
}

export function useSelectedMainTab() {
  return useEditorContext().selectedMainTab;
}

export function useSelectedScreenSize() {
  return useEditorContext().selectedScreenSize;
}

export function useInspectorDrawerOpen() {
  return useEditorContext().inspectorDrawerOpen;
}

export function useSamplesDrawerOpen() {
  return useEditorContext().samplesDrawerOpen;
}

export function useDocument() {
  return useEditorContext().document;
}

export function setSelectedScreenSize(size: 'desktop' | 'mobile') {
  // This would be called from components
}

export default EditorProvider;
