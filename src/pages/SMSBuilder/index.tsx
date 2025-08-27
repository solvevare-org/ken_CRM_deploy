import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Alert,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import VariableAutocompleteProvider from './components/VariableAutocompleteProvider';
import VariablesPanel from './components/VariablesPanel';
import SMSPreview from './components/SMSPreview';

interface SMSTemplate {
  id?: string;
  name: string;
  message: string;
  variables: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SMSBuilder: React.FC = () => {
  const [message, setMessage] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [savedTemplates, setSavedTemplates] = useState<SMSTemplate[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<SMSTemplate | null>(null);

  const MAX_SMS_LENGTH = 160;
  const EXTENDED_SMS_LENGTH = 1600;

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = event.target.value;
    setMessage(newMessage);
    setCharacterCount(newMessage.length);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !message.trim()) {
      alert('Please provide a template name and message content');
      return;
    }

    const template: SMSTemplate = {
      id: Date.now().toString(),
      name: templateName,
      message: message,
      variables: extractVariables(message),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSavedTemplates(prev => [...prev, template]);
    setTemplateName('');
    setMessage('');
    setCharacterCount(0);
  };

  const extractVariables = (text: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      variables.push(match[1]);
    }
    return [...new Set(variables)]; // Remove duplicates
  };

  const loadTemplate = (template: SMSTemplate) => {
    setMessage(template.message);
    setCharacterCount(template.message.length);
    setTemplateName(template.name);
    handleMenuClose();
  };

  const deleteTemplate = (templateId: string) => {
    setSavedTemplates(prev => prev.filter(t => t.id !== templateId));
    handleMenuClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, template: SMSTemplate) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTemplate(null);
  };

  const getSMSInfo = () => {
    const segments = Math.ceil(characterCount / MAX_SMS_LENGTH);
    const isExtended = characterCount > MAX_SMS_LENGTH;
    
    return {
      segments,
      isExtended,
      remaining: isExtended 
        ? EXTENDED_SMS_LENGTH - characterCount 
        : MAX_SMS_LENGTH - characterCount
    };
  };

  const smsInfo = getSMSInfo();

  return (
    <VariableAutocompleteProvider>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MessageIcon color="primary" />
            SMS Template Builder
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create dynamic SMS templates with variable insertion and real-time preview
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main SMS Editor */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                SMS Message Composer
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Template Name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Welcome Message, Appointment Reminder"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  label="SMS Message"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Type your SMS message here... Use {{ to insert variables like {{firstName}}, {{propertyAddress}}, etc."
                  helperText={`${characterCount} characters • ${smsInfo.segments} SMS segment(s) • ${smsInfo.remaining} remaining`}
                  InputProps={{
                    style: { fontFamily: 'monospace' }
                  }}
                />
              </Box>

              {/* SMS Info */}
              <Box sx={{ mb: 3 }}>
                {characterCount > MAX_SMS_LENGTH && (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    This message will be sent as {smsInfo.segments} SMS segments and may incur additional charges.
                  </Alert>
                )}
                
                {characterCount > EXTENDED_SMS_LENGTH && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    Message exceeds maximum SMS length. Please shorten your message.
                  </Alert>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<PhoneIcon />}
                    label={`${smsInfo.segments} SMS Segment${smsInfo.segments > 1 ? 's' : ''}`}
                    color={smsInfo.segments > 1 ? 'warning' : 'success'}
                    variant="outlined"
                  />
                  <Chip 
                    label={`${characterCount}/${smsInfo.isExtended ? EXTENDED_SMS_LENGTH : MAX_SMS_LENGTH} characters`}
                    color={characterCount > EXTENDED_SMS_LENGTH ? 'error' : 'default'}
                    variant="outlined"
                  />
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveTemplate}
                  disabled={!templateName.trim() || !message.trim()}
                >
                  Save Template
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!message.trim()}
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<SendIcon />}
                  disabled={!message.trim() || characterCount > EXTENDED_SMS_LENGTH}
                >
                  Send Test SMS
                </Button>
              </Box>

              {/* SMS Preview */}
              {showPreview && (
                <Box sx={{ mt: 3 }}>
                  <SMSPreview message={message} />
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Variables Panel & Saved Templates */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Variables Panel */}
              <VariablesPanel />

              {/* Saved Templates */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Saved Templates ({savedTemplates.length})
                </Typography>
                
                {savedTemplates.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No saved templates yet. Create and save your first SMS template above.
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {savedTemplates.map((template) => (
                      <Card key={template.id} variant="outlined">
                        <CardContent sx={{ pb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                {template.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                {template.message.substring(0, 80)}
                                {template.message.length > 80 && '...'}
                              </Typography>
                              <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {template.variables.map((variable) => (
                                  <Chip 
                                    key={variable} 
                                    label={variable} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ fontSize: '0.7rem', height: '20px' }}
                                  />
                                ))}
                              </Box>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuClick(e, template)}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {/* Template Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => selectedTemplate && loadTemplate(selectedTemplate)}>
            Load Template
          </MenuItem>
          <MenuItem onClick={() => selectedTemplate && setShowPreview(true)}>
            Preview
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => selectedTemplate?.id && deleteTemplate(selectedTemplate.id)}
            sx={{ color: 'error.main' }}
          >
            Delete
          </MenuItem>
        </Menu>
      </Container>
    </VariableAutocompleteProvider>
  );
};

export default SMSBuilder;
