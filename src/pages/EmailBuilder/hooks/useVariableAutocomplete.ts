import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVariableAutocompleteProps {
  onInsert: (variable: string, startPos: number, endPos: number) => void;
}

interface AutocompleteState {
  isOpen: boolean;
  searchTerm: string;
  position: { x: number; y: number } | null;
  startPosition: number;
  endPosition: number;
}

export const useVariableAutocomplete = ({ onInsert }: UseVariableAutocompleteProps) => {
  const [state, setState] = useState<AutocompleteState>({
    isOpen: false,
    searchTerm: '',
    position: null,
    startPosition: 0,
    endPosition: 0,
  });

  const activeElementRef = useRef<HTMLElement | null>(null);

  const getCaretPosition = (element: HTMLElement): number => {
    let caretOffset = 0;
    const selection = window.getSelection();
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
    
    return caretOffset;
  };

  const getCaretCoordinates = (element: HTMLElement): { x: number; y: number } => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      const rect = element.getBoundingClientRect();
      return { x: rect.left, y: rect.bottom };
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    return {
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 5,
    };
  };

  const findVariableStart = (text: string, position: number): { start: number; searchTerm: string } | null => {
    // Look backwards from the current position to find {{
    let searchStart = position;
    
    // Find the most recent {{ before the cursor
    for (let i = position - 1; i >= 0; i--) {
      if (text.substring(i, i + 2) === '{{') {
        searchStart = i + 2;
        break;
      }
      // If we hit a closing }}, stop searching
      if (text.substring(i, i + 2) === '}}') {
        return null;
      }
      // If we hit whitespace or newline, stop searching
      if (/\s/.test(text[i])) {
        return null;
      }
    }

    // Extract the search term from {{ to current position
    const searchTerm = text.substring(searchStart, position);
    
    // Only show suggestions if we have {{ followed by some characters or just {{
    if (searchStart > 1 && text.substring(searchStart - 2, searchStart) === '{{') {
      return { start: searchStart - 2, searchTerm };
    }
    
    return null;
  };

  const handleTextInput = useCallback((element: HTMLElement) => {
    const text = element.textContent || '';
    const caretPosition = getCaretPosition(element);
    
    const variableMatch = findVariableStart(text, caretPosition);
    
    if (variableMatch) {
      const coordinates = getCaretCoordinates(element);
      setState({
        isOpen: true,
        searchTerm: variableMatch.searchTerm,
        position: coordinates,
        startPosition: variableMatch.start,
        endPosition: caretPosition,
      });
      activeElementRef.current = element;
    } else {
      setState(prev => ({ ...prev, isOpen: false }));
      activeElementRef.current = null;
    }
  }, []);

  const handleVariableSelect = useCallback((variable: string) => {
    if (activeElementRef.current && state.isOpen) {
      onInsert(variable, state.startPosition, state.endPosition);
      setState(prev => ({ ...prev, isOpen: false }));
      activeElementRef.current = null;
    }
  }, [state.isOpen, state.startPosition, state.endPosition, onInsert]);

  const handleClose = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
    activeElementRef.current = null;
  }, []);

  // Set up event listeners for contenteditable elements
  useEffect(() => {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.contentEditable === 'true' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        handleTextInput(target);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.contentEditable === 'true' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Small delay to ensure the text content is updated
        setTimeout(() => handleTextInput(target), 10);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.contentEditable === 'true' || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setTimeout(() => handleTextInput(target), 10);
      }
    };

    document.addEventListener('input', handleInput);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('input', handleInput);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('click', handleClick);
    };
  }, [handleTextInput]);

  return {
    isOpen: state.isOpen,
    searchTerm: state.searchTerm,
    position: state.position,
    onSelect: handleVariableSelect,
    onClose: handleClose,
  };
};
