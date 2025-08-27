import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Divider,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Description as ContractIcon,
  Save as SaveIcon,
  Preview as PreviewIcon,
  Send as SendIcon,
  Edit as EditIcon,
  Create as SignatureIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import VariableAutocompleteProvider from './components/VariableAutocompleteProvider';
import VariablesPanel from './components/VariablesPanel';
import ContractPreview from './components/ContractPreview';
import SignaturePad from './components/SignaturePad';
import ContractTemplates from './components/ContractTemplates';

interface ContractTemplate {
  id?: string;
  name: string;
  type: 'purchase' | 'listing' | 'rental' | 'disclosure' | 'custom';
  content: string;
  variables: string[];
  signatures: SignatureField[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface SignatureField {
  id: string;
  label: string;
  required: boolean;
  signerName?: string;
  signerEmail?: string;
  signedAt?: Date;
  signatureData?: string;
}

const steps = ['Template Selection', 'Content Editing', 'Signature Setup', 'Review & Send'];

const ContractBuilder: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [contractContent, setContractContent] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [contractType, setContractType] = useState<ContractTemplate['type']>('custom');
  const [signatures, setSignatures] = useState<SignatureField[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<ContractTemplate[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [currentSignatureField, setCurrentSignatureField] = useState<SignatureField | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTemplate, setMenuTemplate] = useState<ContractTemplate | null>(null);

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim() || !contractContent.trim()) {
      alert('Please provide a template name and contract content');
      return;
    }

    const template: ContractTemplate = {
      id: Date.now().toString(),
      name: templateName,
      type: contractType,
      content: contractContent,
      variables: extractVariables(contractContent),
      signatures: signatures,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSavedTemplates(prev => [...prev, template]);
    alert('Template saved successfully!');
  };

  const extractVariables = (text: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g;
    const variables: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      variables.push(match[1]);
    }
    return [...new Set(variables)];
  };

  const addSignatureField = () => {
    const newSignature: SignatureField = {
      id: Date.now().toString(),
      label: `Signature ${signatures.length + 1}`,
      required: true,
    };
    setSignatures(prev => [...prev, newSignature]);
  };

  const removeSignatureField = (id: string) => {
    setSignatures(prev => prev.filter(sig => sig.id !== id));
  };

  const openSignaturePad = (signature: SignatureField) => {
    setCurrentSignatureField(signature);
    setShowSignaturePad(true);
  };

  const handleSignatureSaved = (signatureData: string) => {
    if (currentSignatureField) {
      setSignatures(prev => prev.map(sig => 
        sig.id === currentSignatureField.id 
          ? { ...sig, signatureData, signedAt: new Date() }
          : sig
      ));
    }
    setShowSignaturePad(false);
    setCurrentSignatureField(null);
  };

  const loadTemplate = (template: ContractTemplate) => {
    setContractContent(template.content);
    setTemplateName(template.name);
    setContractType(template.type);
    setSignatures(template.signatures);
    setActiveStep(1); // Go to content editing step
    handleMenuClose();
  };

  const deleteTemplate = (templateId: string) => {
    setSavedTemplates(prev => prev.filter(t => t.id !== templateId));
    handleMenuClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, template: ContractTemplate) => {
    setAnchorEl(event.currentTarget);
    setMenuTemplate(template);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTemplate(null);
  };

  const getContractTypeColor = (type: ContractTemplate['type']) => {
    const colors = {
      purchase: 'primary' as const,
      listing: 'success' as const,
      rental: 'info' as const,
      disclosure: 'warning' as const,
      custom: 'default' as const,
    };
    return colors[type];
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ContractTemplates onSelectTemplate={loadTemplate} />;
      case 1:
        return (
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Contract Content Editor
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Template Name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    select
                    label="Contract Type"
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as ContractTemplate['type'])}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="purchase">Purchase Agreement</MenuItem>
                    <MenuItem value="listing">Listing Agreement</MenuItem>
                    <MenuItem value="rental">Rental Agreement</MenuItem>
                    <MenuItem value="disclosure">Disclosure Form</MenuItem>
                    <MenuItem value="custom">Custom Contract</MenuItem>
                  </TextField>
                  
                  <TextField
                    inputRef={contentRef}
                    fullWidth
                    multiline
                    rows={20}
                    label="Contract Content"
                    value={contractContent}
                    onChange={(e) => setContractContent(e.target.value)}
                    placeholder="Enter your contract content here... Use {{ to insert variables like {{buyerName}}, {{propertyAddress}}, etc."
                    helperText="Use {{variableName}} to insert dynamic content. Click on variables in the right panel or type {{ for suggestions."
                    InputProps={{
                      style: { fontFamily: 'monospace', fontSize: '14px' }
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PreviewIcon />}
                    onClick={() => setShowPreview(!showPreview)}
                    disabled={!contractContent.trim()}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                  
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveTemplate}
                    disabled={!templateName.trim() || !contractContent.trim()}
                  >
                    Save Template
                  </Button>
                </Box>

                {showPreview && (
                  <Box sx={{ mt: 3 }}>
                    <ContractPreview content={contractContent} />
                  </Box>
                )}
              </Paper>
            </Box>
            
            <Box sx={{ width: 400 }}>
              <VariablesPanel />
            </Box>
          </Box>
        );
      case 2:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Signature Setup
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add signature fields where parties need to sign the contract
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addSignatureField}
              >
                Add Signature Field
              </Button>
            </Box>

            <List>
              {signatures.map((signature, index) => (
                <ListItem key={signature.id} divider>
                  <ListItemText
                    primary={
                      <TextField
                        fullWidth
                        label="Signature Label"
                        value={signature.label}
                        onChange={(e) => {
                          setSignatures(prev => prev.map(sig => 
                            sig.id === signature.id 
                              ? { ...sig, label: e.target.value }
                              : sig
                          ));
                        }}
                        size="small"
                      />
                    }
                    secondary={
                      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                        <TextField
                          label="Signer Name"
                          value={signature.signerName || ''}
                          onChange={(e) => {
                            setSignatures(prev => prev.map(sig => 
                              sig.id === signature.id 
                                ? { ...sig, signerName: e.target.value }
                                : sig
                            ));
                          }}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="Signer Email"
                          value={signature.signerEmail || ''}
                          onChange={(e) => {
                            setSignatures(prev => prev.map(sig => 
                              sig.id === signature.id 
                                ? { ...sig, signerEmail: e.target.value }
                                : sig
                            ));
                          }}
                          size="small"
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant={signature.signatureData ? "outlined" : "contained"}
                        startIcon={<SignatureIcon />}
                        onClick={() => openSignaturePad(signature)}
                        color={signature.signatureData ? "success" : "primary"}
                      >
                        {signature.signatureData ? 'Signed' : 'Sign'}
                      </Button>
                      <IconButton
                        edge="end"
                        onClick={() => removeSignatureField(signature.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>

            {signatures.length === 0 && (
              <Alert severity="info">
                No signature fields added yet. Add signature fields for parties who need to sign this contract.
              </Alert>
            )}
          </Paper>
        );
      case 3:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Review & Send Contract
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Alert severity="success">
                Contract is ready for review and sending!
              </Alert>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Chip label={`${contractContent.split(' ').length} words`} />
              <Chip label={`${signatures.length} signatures required`} />
              <Chip label={`${signatures.filter(s => s.signatureData).length} signatures completed`} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                disabled={signatures.some(s => s.required && !s.signatureData)}
              >
                Send Contract
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
              >
                Download PDF
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<PreviewIcon />}
                onClick={() => setShowPreview(true)}
              >
                Final Preview
              </Button>
            </Box>
          </Paper>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <VariableAutocompleteProvider>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ContractIcon color="primary" />
            Contract Builder
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create, customize, and manage legal contracts with digital signatures
          </Typography>
        </Box>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Main Content */}
        <Box sx={{ mb: 3 }}>
          {renderStepContent(activeStep)}
        </Box>

        {/* Navigation Buttons */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Paper>

        {/* Saved Templates Panel */}
        {activeStep === 0 && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Saved Templates ({savedTemplates.length})
            </Typography>
            
            {savedTemplates.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No saved templates yet. Create and save your first contract template.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {savedTemplates.map((template) => (
                  <Card key={template.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {template.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip 
                              label={template.type.replace('_', ' ')} 
                              color={getContractTypeColor(template.type)}
                              size="small"
                            />
                            <Chip 
                              label={`${template.signatures.length} signatures`} 
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {template.content.substring(0, 150)}...
                          </Typography>
                        </Box>
                        <IconButton
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
        )}

        {/* Signature Pad Dialog */}
        <Dialog
          open={showSignaturePad}
          onClose={() => setShowSignaturePad(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Digital Signature - {currentSignatureField?.label}
          </DialogTitle>
          <DialogContent>
            <SignaturePad onSave={handleSignatureSaved} />
          </DialogContent>
        </Dialog>

        {/* Template Actions Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => menuTemplate && loadTemplate(menuTemplate)}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit Template
          </MenuItem>
          <MenuItem onClick={() => setShowPreview(true)}>
            <PreviewIcon fontSize="small" sx={{ mr: 1 }} />
            Preview
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => menuTemplate?.id && deleteTemplate(menuTemplate.id)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Preview Dialog */}
        <Dialog
          open={showPreview}
          onClose={() => setShowPreview(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Contract Preview</DialogTitle>
          <DialogContent>
            <ContractPreview content={contractContent} signatures={signatures} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPreview(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </VariableAutocompleteProvider>
  );
};

export default ContractBuilder;
