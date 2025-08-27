import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { getVariablesByCategory, formatVariable } from '../utils/variableUtils';

const VariablesPanel: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['client']);
  const variablesByCategory = getVariablesByCategory();

  const handleCategoryToggle = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const copyVariable = (variableKey: string) => {
    const formattedVariable = formatVariable(variableKey);
    navigator.clipboard.writeText(formattedVariable);
  };

  const getCategoryDisplayName = (category: string): string => {
    const displayNames: Record<string, string> = {
      client: 'Client Information',
      property: 'Property Details',
      realtor: 'Realtor Information',
      appointment: 'Appointment Details',
      system: 'System Variables',
    };
    return displayNames[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'info' | 'warning'> = {
      client: 'primary',
      property: 'success',
      realtor: 'info',
      appointment: 'warning',
      system: 'secondary',
    };
    return colors[category] || 'default';
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        SMS Variables
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Click to copy variables or type {`{{`} in your message to get suggestions
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Object.entries(variablesByCategory).map(([category, variables]) => (
          <Accordion
            key={category}
            expanded={expandedCategories.includes(category)}
            onChange={() => handleCategoryToggle(category)}
            elevation={0}
            sx={{ 
              border: '1px solid',
              borderColor: 'divider',
              '&:before': { display: 'none' }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2">
                  {getCategoryDisplayName(category)}
                </Typography>
                <Chip 
                  label={variables.length} 
                  size="small" 
                  color={getCategoryColor(category)}
                  variant="outlined"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {variables.map((variable) => (
                  <Box
                    key={variable.key}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {variable.label}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {`{{${variable.key}}}`}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Example: {variable.example}
                      </Typography>
                    </Box>
                    <Tooltip title="Copy variable">
                      <IconButton 
                        size="small" 
                        onClick={() => copyVariable(variable.key)}
                        sx={{ ml: 1 }}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="caption" color="info.dark">
          💡 <strong>Tip:</strong> Type {`{{`} in your SMS message to get intelligent variable suggestions!
        </Typography>
      </Box>
    </Paper>
  );
};

export default VariablesPanel;
