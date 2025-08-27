import React, { useCallback } from 'react';
import VariableSuggestions from '../components/VariableSuggestions';
import { useVariableAutocomplete } from '../hooks/useVariableAutocomplete';

interface VariableAutocompleteProviderProps {
  children: React.ReactNode;
}

const VariableAutocompleteProvider: React.FC<VariableAutocompleteProviderProps> = ({ children }) => {
  const handleVariableInsert = useCallback((variable: string, startPos: number, endPos: number) => {
    // Find the active contenteditable element
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const containerElement = range.commonAncestorContainer;
    
    // Find the text node or contenteditable element
    let targetElement: Node = containerElement;
    while (targetElement && targetElement.nodeType !== Node.TEXT_NODE) {
      if ((targetElement as HTMLElement).contentEditable === 'true') {
        break;
      }
      targetElement = targetElement.parentNode || targetElement;
    }

    if (targetElement) {
      try {
        // Get the text content
        const element = targetElement.nodeType === Node.TEXT_NODE 
          ? targetElement.parentElement 
          : targetElement as HTMLElement;
          
        if (element && element.contentEditable === 'true') {
          const currentText = element.textContent || '';
          
          // Replace the {{ searchTerm with the full variable
          const beforeText = currentText.substring(0, startPos);
          const afterText = currentText.substring(endPos);
          const newText = beforeText + variable + afterText;
          
          // Update the text content
          element.textContent = newText;
          
          // Set cursor position after the inserted variable
          const newCaretPosition = startPos + variable.length;
          
          // Create a new range and set the cursor position
          const newRange = document.createRange();
          const textNode = element.firstChild;
          
          if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            newRange.setStart(textNode, Math.min(newCaretPosition, textNode.textContent?.length || 0));
            newRange.setEnd(textNode, Math.min(newCaretPosition, textNode.textContent?.length || 0));
            
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
          
          // Trigger input event to notify the editor of changes
          const inputEvent = new Event('input', { bubbles: true });
          element.dispatchEvent(inputEvent);
        }
      } catch (error) {
        console.error('Error inserting variable:', error);
      }
    }
  }, []);

  const {
    isOpen,
    searchTerm,
    position,
    onSelect,
    onClose,
  } = useVariableAutocomplete({
    onInsert: handleVariableInsert,
  });

  return (
    <>
      {children}
      <VariableSuggestions
        searchTerm={searchTerm}
        position={position}
        onSelect={onSelect}
        onClose={onClose}
        isOpen={isOpen}
      />
    </>
  );
};

export default VariableAutocompleteProvider;
