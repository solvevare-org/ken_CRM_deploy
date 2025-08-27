import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  InputAdornment,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { getVariablesByCategory, formatVariable } from '../utils/variableUtils';

interface VariablesPanelProps {
  open: boolean;
  onClose: () => void;
  onVariableSelect: (variable: string) => void;
}

const VariablesPanel: React.FC<VariablesPanelProps> = ({
  open,
  onClose,
  onVariableSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'buyer',
    'property'
  ]);

  const categories = getVariablesByCategory();

  // Filter variables based on search term
  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return categories;

    const filtered: Record<string, any[]> = {};
    Object.entries(categories).forEach(([category, variables]) => {
      const filteredVariables = variables.filter(variable =>
        variable.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variable.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredVariables.length > 0) {
        filtered[category] = filteredVariables;
      }
    });
    return filtered;
  }, [categories, searchTerm]);

  const handleCategoryToggle = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const getCategoryIcon = (categoryName: string) => {
    const icons: Record<string, string> = {
      buyer: '👤',
      seller: '🏠',
      property: '🏡',
      financial: '💰',
      dates: '📅',
      agent: '👔',
      legal: '⚖️',
      system: '⚙️',
    };
    return icons[categoryName] || '📋';
  };

  const getCategoryDescription = (categoryName: string) => {
    const descriptions: Record<string, string> = {
      buyer: 'Buyer information and details',
      seller: 'Seller information and details',
      property: 'Property address and specifications',
      financial: 'Purchase price and financial terms',
      dates: 'Important contract dates and deadlines',
      agent: 'Real estate agent information',
      legal: 'Legal entities and compliance details',
      system: 'System-generated variables',
    };
    return descriptions[categoryName] || 'Contract variables';
  };

  const totalVariablesCount = Object.values(filteredCategories).reduce(
    (total, variables) => total + variables.length,
    0
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 350,
          maxWidth: '40vw',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Contract Variables
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <TextField
            fullWidth
            size="small"
            placeholder="Search variables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
          />
          
          <Typography variant="caption" color="text.secondary">
            {totalVariablesCount} variables available
          </Typography>
        </Box>

        {/* Variables List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {Object.entries(filteredCategories).map(([categoryName, variables]) => (
            <Accordion
              key={categoryName}
              expanded={expandedCategories.includes(categoryName)}
              onChange={() => handleCategoryToggle(categoryName)}
              sx={{ 
                '&:before': { display: 'none' },
                boxShadow: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  minHeight: 48,
                  '& .MuiAccordionSummary-content': {
                    margin: '8px 0',
                    alignItems: 'center',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                  <Typography component="span" sx={{ fontSize: '1.2em' }}>
                    {getCategoryIcon(categoryName)}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ 
                      textTransform: 'capitalize',
                      fontWeight: 600,
                      flex: 1,
                    }}
                  >
                    {categoryName}
                  </Typography>
                  <Chip
                    label={variables.length}
                    size="small"
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                  <Tooltip title={getCategoryDescription(categoryName)}>
                    <InfoIcon fontSize="small" color="action" />
                  </Tooltip>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {variables.map((variable) => (
                    <Box
                      key={variable.key}
                      sx={{
                        p: 1.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'action.hover',
                        },
                      }}
                      onClick={() => onVariableSelect(formatVariable(variable.key))}
                    >
                      <Typography variant="body2" fontWeight={500} gutterBottom>
                        {variable.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          color: 'primary.main',
                          backgroundColor: 'primary.50',
                          px: 0.5,
                          py: 0.25,
                          borderRadius: 0.5,
                          display: 'inline-block',
                          mb: 0.5,
                        }}
                      >
                        {`{{${variable.key}}}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Example: {variable.example}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
            Click any variable to insert it into your contract
          </Typography>
          <Typography variant="caption" color="text.secondary" textAlign="center" display="block" sx={{ mt: 0.5 }}>
            {"Type {{ in any text field for quick suggestions"}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default VariablesPanel;
