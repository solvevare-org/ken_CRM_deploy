import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
} from '@mui/material';
import { createPortal } from 'react-dom';
import { getAllVariables, formatVariable } from '../utils/variableUtils';

interface VariableSuggestionsProps {
  searchTerm: string;
  position: { x: number; y: number } | null;
  onSelect: (variable: string) => void;
  onClose: () => void;
  isOpen?: boolean;
}

const VariableSuggestions: React.FC<VariableSuggestionsProps> = ({
  searchTerm,
  position,
  onSelect,
  onClose,
  isOpen = true,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  // Get all available variables
  const allVariables = getAllVariables();
  
  // Filter variables based on search term
  const filteredVariables = React.useMemo(() => {
    if (!searchTerm) return allVariables;
    
    return allVariables.filter(variable =>
      variable.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allVariables, searchTerm]);

  // Reset selected index when filtered variables change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredVariables]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !position || filteredVariables.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredVariables.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredVariables.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredVariables[selectedIndex]) {
            onSelect(formatVariable(filteredVariables[selectedIndex].key));
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, position, filteredVariables, selectedIndex, onSelect, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Don't render if not open, no position, or no variables to show
  if (!isOpen || !position || filteredVariables.length === 0) {
    return null;
  }

  const dropdown = (
    <Paper
      sx={{
        position: 'fixed',
        left: position.x,
        top: position.y + 20,
        minWidth: 200,
        maxWidth: 300,
        maxHeight: 200,
        overflow: 'auto',
        zIndex: 9999,
        boxShadow: 3,
      }}
    >
      <Box sx={{ p: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Variables ({filteredVariables.length})
        </Typography>
      </Box>
      <List
        ref={listRef}
        dense
        sx={{ py: 0 }}
      >
        {filteredVariables.map((variable, index) => (
          <ListItem
            key={variable.key}
            disablePadding
            sx={{
              backgroundColor: index === selectedIndex ? 'action.selected' : 'transparent',
            }}
          >
            <ListItemButton
              selected={index === selectedIndex}
              onClick={() => onSelect(formatVariable(variable.key))}
            >
              <ListItemText
                primary={variable.label}
                secondary={`{{${variable.key}}} - ${variable.example}`}
                primaryTypographyProps={{
                  variant: 'body2',
                }}
                secondaryTypographyProps={{
                  variant: 'caption',
                  fontFamily: 'monospace',
                  color: 'text.secondary',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  // Render in a portal to avoid z-index issues
  return createPortal(dropdown, document.body);
};

export default VariableSuggestions;
