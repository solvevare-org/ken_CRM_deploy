import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { ContractElement } from '../../api/contractBuilder';

interface ElementEditorProps {
  open: boolean;
  element: ContractElement | null;
  onSave: (element: ContractElement) => void;
  onClose: () => void;
}

const ElementEditor: React.FC<ElementEditorProps> = ({
  open,
  element,
  onSave,
  onClose,
}) => {
  const [editedElement, setEditedElement] = useState<ContractElement | null>(null);

  useEffect(() => {
    if (element) {
      setEditedElement({ ...element });
    }
  }, [element]);

  if (!editedElement) return null;

  const handleSave = () => {
    onSave(editedElement);
  };

  const updateProperty = (key: string, value: any) => {
    setEditedElement(prev => ({
      ...prev!,
      properties: {
        ...prev!.properties,
        [key]: value
      }
    }));
  };

  const addOption = () => {
    const currentOptions = editedElement.properties?.options || [];
    updateProperty('options', [...currentOptions, `Option ${currentOptions.length + 1}`]);
  };

  const updateOption = (index: number, value: string) => {
    const currentOptions = editedElement.properties?.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    updateProperty('options', newOptions);
  };

  const removeOption = (index: number) => {
    const currentOptions = editedElement.properties?.options || [];
    const newOptions = currentOptions.filter((_, i) => i !== index);
    updateProperty('options', newOptions);
  };

  const renderTypeSpecificFields = () => {
    switch (editedElement.type) {
      case 'header':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Font Size"
              value={editedElement.properties?.style?.fontSize || '24px'}
              onChange={(e) => updateProperty('style', {
                ...editedElement.properties?.style,
                fontSize: e.target.value
              })}
            />
            <FormControl fullWidth>
              <InputLabel>Text Alignment</InputLabel>
              <Select
                value={editedElement.properties?.style?.textAlign || 'center'}
                onChange={(e) => updateProperty('style', {
                  ...editedElement.properties?.style,
                  textAlign: e.target.value
                })}
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 'variable':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Placeholder Text"
              value={editedElement.properties?.placeholder || ''}
              onChange={(e) => updateProperty('placeholder', e.target.value)}
            />
            <TextField
              fullWidth
              label="Variable Name"
              value={editedElement.properties?.variable || ''}
              onChange={(e) => updateProperty('variable', e.target.value)}
              helperText="Used for auto-filling data (e.g., 'purchasePrice', 'clientName')"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editedElement.properties?.required || false}
                  onChange={(e) => updateProperty('required', e.target.checked)}
                />
              }
              label="Required Field"
            />
          </Box>
        );

      case 'checkbox':
      case 'radio':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2">Options</Typography>
              <Button startIcon={<Add />} onClick={addOption} size="small">
                Add Option
              </Button>
            </Box>
            {(editedElement.properties?.options || []).map((option, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
                <IconButton onClick={() => removeOption(index)} size="small">
                  <Delete />
                </IconButton>
              </Box>
            ))}
          </Box>
        );

      case 'signature':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Signature Title"
              value={editedElement.properties?.title || ''}
              onChange={(e) => updateProperty('title', e.target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editedElement.properties?.required || false}
                  onChange={(e) => updateProperty('required', e.target.checked)}
                />
              }
              label="Required Signature"
            />
          </Box>
        );

      case 'table':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2">Table Configuration</Typography>
            <TextField
              fullWidth
              label="Number of Rows"
              type="number"
              value={editedElement.properties?.rows || 2}
              onChange={(e) => updateProperty('rows', parseInt(e.target.value))}
            />
          </Box>
        );

      case 'list':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>List Type</InputLabel>
              <Select
                value={editedElement.properties?.listType || 'bullet'}
                onChange={(e) => updateProperty('listType', e.target.value)}
              >
                <MenuItem value="bullet">Bulleted</MenuItem>
                <MenuItem value="numbered">Numbered</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Edit {editedElement.type.charAt(0).toUpperCase() + editedElement.type.slice(1)} Element
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={3}
            value={editedElement.content}
            onChange={(e) => setEditedElement(prev => ({
              ...prev!,
              content: e.target.value
            }))}
            helperText="You can use variables like {{client.firstName}}, {{realtor.company}}, etc."
          />
          {renderTypeSpecificFields()}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ElementEditor;
