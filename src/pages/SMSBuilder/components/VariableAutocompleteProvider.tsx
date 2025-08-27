import React, { useCallback } from 'react';
import VariableSuggestions from './VariableSuggestions';
import { useVariableAutocomplete } from '../hooks/useVariableAutocomplete';

interface VariableAutocompleteProviderProps {
  children: React.ReactNode;
}

const VariableAutocompleteProvider: React.FC<VariableAutocompleteProviderProps> = ({ children }) => {
  const handleVariableInsert = useCallback((variable: string, startPos: number, endPos: number) => {
    // Find the active contenteditable element or textarea
    const activeElement = document.activeElement as HTMLElement;
    
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true')) {
      try {
        if (activeElement.tagName === 'TEXTAREA') {
          // Handle textarea elements
          const textarea = activeElement as HTMLTextAreaElement;
          const currentText = textarea.value;
          
          // Replace the {{ searchTerm with the full variable
          const beforeText = currentText.substring(0, startPos);
          const afterText = currentText.substring(endPos);
          const newText = beforeText + variable + afterText;
          
          // Update the textarea value
          textarea.value = newText;
          
          // Set cursor position after the inserted variable
          const newCaretPosition = startPos + variable.length;
          textarea.setSelectionRange(newCaretPosition, newCaretPosition);
          
          // Trigger input event to notify React of the change
          const inputEvent = new Event('input', { bubbles: true });
          textarea.dispatchEvent(inputEvent);
        } else {
          // Handle contenteditable elements (same as email builder)
          const currentText = activeElement.textContent || '';
          
          const beforeText = currentText.substring(0, startPos);
          const afterText = currentText.substring(endPos);
          const newText = beforeText + variable + afterText;
          
          activeElement.textContent = newText;
          
          const newCaretPosition = startPos + variable.length;
          
          const newRange = document.createRange();
          const textNode = activeElement.firstChild;
          
          if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            newRange.setStart(textNode, Math.min(newCaretPosition, textNode.textContent?.length || 0));
            newRange.setEnd(textNode, Math.min(newCaretPosition, textNode.textContent?.length || 0));
            
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(newRange);
            }
          }
          
          const inputEvent = new Event('input', { bubbles: true });
          activeElement.dispatchEvent(inputEvent);
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
