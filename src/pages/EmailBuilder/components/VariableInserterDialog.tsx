import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { getAllVariables, formatVariable } from '../utils/variableUtils';

interface VariableInserterDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (variable: string) => void;
}

const VariableInserterDialog: React.FC<VariableInserterDialogProps> = ({
  open,
  onClose,
  onInsert,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const variables = getAllVariables();

  const categorizedVariables = variables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, typeof variables>);

  const filteredCategories = Object.entries(categorizedVariables).reduce((acc, [category, vars]) => {
    const filteredVars = vars.filter(
      variable =>
        variable.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variable.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredVars.length > 0 || !searchTerm) {
      acc[category] = searchTerm ? filteredVars : vars;
    }
    return acc;
  }, {} as Record<string, typeof variables>);

  const handleVariableSelect = (variableKey: string) => {
    const formattedVariable = formatVariable(variableKey);
    onInsert(formattedVariable);
    onClose();
  };

  const categoryLabels: Record<string, string> = {
    client: 'Client Information',
    property: 'Property Details',
    realtor: 'Realtor Information',
    appointment: 'Appointments & Dates',
    financial: 'Financial Information',
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Insert Dynamic Variable</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select a variable to insert into your email template. Variables will be replaced with actual data when emails are sent.
        </Typography>
        
        <TextField
          fullWidth
          size="small"
          placeholder="Search variables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {Object.entries(filteredCategories).map(([category, categoryVariables]) => (
            <Accordion key={category} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {categoryLabels[category] || category}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List dense>
                  {categoryVariables.map((variable) => (
                    <ListItem key={variable.key} disablePadding>
                      <ListItemButton onClick={() => handleVariableSelect(variable.key)}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Chip
                                label={formatVariable(variable.key)}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                              <Typography variant="body2" fontWeight="medium">
                                {variable.label}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              Example: {variable.example}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VariableInserterDialog;
