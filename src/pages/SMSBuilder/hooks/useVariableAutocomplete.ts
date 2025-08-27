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

  const getCaretPosition = (element: HTMLElement | HTMLTextAreaElement): number => {
    if (element.tagName === 'TEXTAREA') {
      const textarea = element as HTMLTextAreaElement;
      return textarea.selectionStart || 0;
    }
    
    // For contenteditable elements
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

  const getCaretCoordinates = (element: HTMLElement | HTMLTextAreaElement): { x: number; y: number } => {
    if (element.tagName === 'TEXTAREA') {
      const textarea = element as HTMLTextAreaElement;
      const rect = textarea.getBoundingClientRect();
      
      // For textarea, approximate position based on line height and character position
      const style = window.getComputedStyle(textarea);
      const lineHeight = parseInt(style.lineHeight) || 20;
      const fontSize = parseInt(style.fontSize) || 14;
      const charWidth = fontSize * 0.6; // Approximate character width
      
      const caretPos = textarea.selectionStart || 0;
      const textBeforeCaret = textarea.value.substring(0, caretPos);
      const lines = textBeforeCaret.split('\n');
      const currentLine = lines.length - 1;
      const currentLineText = lines[currentLine] || '';
      
      return {
        x: rect.left + (currentLineText.length * charWidth),
        y: rect.top + (currentLine * lineHeight) + lineHeight,
      };
    }

    // For contenteditable elements
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
    
    // Find the start of the current "word" (text after {{)
    while (searchStart > 0 && text[searchStart - 1] !== '{' && text[searchStart - 1] !== ' ' && text[searchStart - 1] !== '\n') {
      searchStart--;
    }
    
    // Extract search term
    const searchTerm = text.substring(searchStart, position);
    
    // Only show suggestions if we have {{ followed by some characters or just {{
    if (searchStart > 1 && text.substring(searchStart - 2, searchStart) === '{{') {
      return { start: searchStart - 2, searchTerm };
    }
    
    return null;
  };

  const handleTextInput = useCallback((element: HTMLElement | HTMLTextAreaElement) => {
    const text = element.tagName === 'TEXTAREA' 
      ? (element as HTMLTextAreaElement).value 
      : element.textContent || '';
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
      setState(prev => ({ ...prev, isOpen: false, position: null }));
    }
  }, []);

  const handleVariableSelect = useCallback((variable: string) => {
    if (activeElementRef.current) {
      onInsert(variable, state.startPosition, state.endPosition);
    }
    setState(prev => ({ ...prev, isOpen: false, position: null }));
  }, [onInsert, state.startPosition, state.endPosition]);

  const handleClose = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false, position: null }));
  }, []);

  useEffect(() => {
    const handleInput = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'TEXTAREA' || target.contentEditable === 'true')) {
        handleTextInput(target);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'TEXTAREA' || target.contentEditable === 'true')) {
        handleTextInput(target);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'TEXTAREA' || target.contentEditable === 'true')) {
        // Small delay to ensure cursor position is updated
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
