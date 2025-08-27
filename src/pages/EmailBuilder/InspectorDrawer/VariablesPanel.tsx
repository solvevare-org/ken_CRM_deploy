import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  TextField,
  Button,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy,
  ExpandMore,
  Person,
  Home,
  Business,
  CalendarToday,
  AttachMoney,
} from '@mui/icons-material';

// Predefined variable categories for real estate CRM
const VARIABLE_CATEGORIES = {
  client: {
    label: 'Client Information',
    icon: <Person />,
    variables: [
      { key: 'firstName', label: 'First Name', example: 'John' },
      { key: 'lastName', label: 'Last Name', example: 'Smith' },
      { key: 'fullName', label: 'Full Name', example: 'John Smith' },
      { key: 'email', label: 'Email Address', example: 'john.smith@email.com' },
      { key: 'phone', label: 'Phone Number', example: '+1 (555) 123-4567' },
      { key: 'preferredContactMethod', label: 'Preferred Contact', example: 'Email' },
    ]
  },
  property: {
    label: 'Property Details',
    icon: <Home />,
    variables: [
      { key: 'propertyAddress', label: 'Property Address', example: '123 Main St, City, State 12345' },
      { key: 'propertyPrice', label: 'Property Price', example: '$450,000' },
      { key: 'propertyType', label: 'Property Type', example: 'Single Family Home' },
      { key: 'bedrooms', label: 'Bedrooms', example: '3' },
      { key: 'bathrooms', label: 'Bathrooms', example: '2.5' },
      { key: 'squareFootage', label: 'Square Footage', example: '2,100 sq ft' },
      { key: 'lotSize', label: 'Lot Size', example: '0.25 acres' },
      { key: 'yearBuilt', label: 'Year Built', example: '2018' },
    ]
  },
  realtor: {
    label: 'Realtor Information',
    icon: <Business />,
    variables: [
      { key: 'realtorName', label: 'Realtor Name', example: 'Jane Doe' },
      { key: 'realtorEmail', label: 'Realtor Email', example: 'jane.doe@realty.com' },
      { key: 'realtorPhone', label: 'Realtor Phone', example: '+1 (555) 987-6543' },
      { key: 'brokerage', label: 'Brokerage', example: 'Prime Real Estate' },
      { key: 'licenseNumber', label: 'License Number', example: 'RE123456789' },
      { key: 'realtorWebsite', label: 'Website', example: 'www.janedoe-realty.com' },
    ]
  },
  appointment: {
    label: 'Appointments & Dates',
    icon: <CalendarToday />,
    variables: [
      { key: 'appointmentDate', label: 'Appointment Date', example: 'March 15, 2024' },
      { key: 'appointmentTime', label: 'Appointment Time', example: '2:00 PM' },
      { key: 'showingDate', label: 'Showing Date', example: 'March 20, 2024' },
      { key: 'closingDate', label: 'Closing Date', example: 'April 30, 2024' },
      { key: 'currentDate', label: 'Current Date', example: 'Today\'s Date' },
    ]
  },
  financial: {
    label: 'Financial Information',
    icon: <AttachMoney />,
    variables: [
      { key: 'loanAmount', label: 'Loan Amount', example: '$360,000' },
      { key: 'downPayment', label: 'Down Payment', example: '$90,000' },
      { key: 'monthlyPayment', label: 'Monthly Payment', example: '$2,150' },
      { key: 'interestRate', label: 'Interest Rate', example: '3.75%' },
      { key: 'preApprovalAmount', label: 'Pre-approval Amount', example: '$500,000' },
    ]
  }
};

interface VariablesPanelProps {}

const VariablesPanel: React.FC<VariablesPanelProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customVariables, setCustomVariables] = useState<Array<{ key: string; label: string; example: string }>>([]);
  const [newVariableName, setNewVariableName] = useState('');
  const [newVariableLabel, setNewVariableLabel] = useState('');

  const copyToClipboard = (variableKey: string) => {
    const variableText = `{{${variableKey}}}`;
    navigator.clipboard.writeText(variableText).then(() => {
      // You could add a toast notification here
      console.log(`Copied: ${variableText}`);
    });
  };

  const addCustomVariable = () => {
    if (newVariableName.trim() && newVariableLabel.trim()) {
      const newVariable = {
        key: newVariableName.trim(),
        label: newVariableLabel.trim(),
        example: 'Custom Value'
      };
      setCustomVariables([...customVariables, newVariable]);
      setNewVariableName('');
      setNewVariableLabel('');
    }
  };

  const filterVariables = (variables: any[]) => {
    if (!searchTerm) return variables;
    return variables.filter(
      variable =>
        variable.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variable.key.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Dynamic Variables
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Insert dynamic variables into your email templates. Click to copy.
      </Typography>

      {/* Search Box */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search variables..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Variable Categories */}
      {Object.entries(VARIABLE_CATEGORIES).map(([categoryKey, category]) => {
        const filteredVariables = filterVariables(category.variables);
        if (filteredVariables.length === 0 && searchTerm) return null;

        return (
          <Accordion key={categoryKey} defaultExpanded sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {category.icon}
                <Typography variant="subtitle2">{category.label}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <List dense>
                {filteredVariables.map((variable) => (
                  <ListItem key={variable.key} disablePadding>
                    <ListItemButton
                      onClick={() => copyToClipboard(variable.key)}
                      sx={{ py: 0.5 }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={`{{${variable.key}}}`}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                            <Typography variant="body2">{variable.label}</Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Example: {variable.example}
                          </Typography>
                        }
                      />
                      <Tooltip title="Copy to clipboard">
                        <IconButton size="small" edge="end">
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* Custom Variables Section */}
      <Divider sx={{ my: 2 }} />
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2">Custom Variables</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              size="small"
              placeholder="Variable name (e.g., customField)"
              value={newVariableName}
              onChange={(e) => setNewVariableName(e.target.value)}
            />
            <TextField
              size="small"
              placeholder="Display label"
              value={newVariableLabel}
              onChange={(e) => setNewVariableLabel(e.target.value)}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={addCustomVariable}
              disabled={!newVariableName.trim() || !newVariableLabel.trim()}
            >
              Add Custom Variable
            </Button>
          </Box>

          {/* Display Custom Variables */}
          {customVariables.length > 0 && (
            <List dense sx={{ mt: 2 }}>
              {customVariables.map((variable, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton onClick={() => copyToClipboard(variable.key)}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={`{{${variable.key}}}`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                          <Typography variant="body2">{variable.label}</Typography>
                        </Box>
                      }
                    />
                    <Tooltip title="Copy to clipboard">
                      <IconButton size="small" edge="end">
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Usage Instructions */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          How to use:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          1. Click any variable to copy it to clipboard<br />
          2. Paste the variable (e.g., {`{{firstName}}`}) into your email content<br />
          3. Variables will be replaced with actual data when emails are sent
        </Typography>
      </Box>
    </Box>
  );
};

export default VariablesPanel;
