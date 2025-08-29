import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as PreviewIcon,
  ContentCopy as CopyIcon,
  AutoFixHigh as AutoFillIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchContractTemplates,
  createContractTemplate,
  deleteContractTemplate,
  selectContractTemplates,
  selectContractTemplatesLoading,
  selectContractTemplatesError,
  selectIsCreatingTemplate,
} from '../../store/slices/contractTemplatesSlice';
import {
  generateContract,
  selectContractInstances,
  selectIsGeneratingContract,
  selectCurrentContractInstance,
  selectContractInstancesError,
  setCurrentInstance,
} from '../../store/slices/contractInstancesSlice';
import { ContractTemplate, ContractElement, GenerateContractRequest } from '../../types/contractTypes';

interface ContractBuilderProps {}

const ContractBuilder: React.FC<ContractBuilderProps> = () => {
  const dispatch = useAppDispatch();
  
  // Redux state
  const templatesFromStore = useAppSelector(selectContractTemplates);
  const templates = Array.isArray(templatesFromStore) ? templatesFromStore : [];
  const isLoadingTemplates = useAppSelector(selectContractTemplatesLoading);
  const templatesError = useAppSelector(selectContractTemplatesError);
  const isCreatingTemplate = useAppSelector(selectIsCreatingTemplate);
  const instances = useAppSelector(selectContractInstances);
  const isGeneratingContract = useAppSelector(selectIsGeneratingContract);
  const currentInstance = useAppSelector(selectCurrentContractInstance);
  const contractsError = useAppSelector(selectContractInstancesError);

  // Local state
  const [activeView, setActiveView] = useState<'templates' | 'instances' | 'builder'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    elements: [] as ContractElement[]
  });
  const [contractRequest, setContractRequest] = useState<GenerateContractRequest>({
    templateId: '',
    leadId: '',
    clientId: '',
    autoFill: true
  });

  // Load templates on component mount
  useEffect(() => {
    dispatch(fetchContractTemplates());
  }, [dispatch]);

  // Handle template creation
  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim()) return;
    
    await dispatch(createContractTemplate({
      name: newTemplate.name,
      description: newTemplate.description,
      elements: newTemplate.elements.length > 0 ? newTemplate.elements : getDefaultElements(),
      isDefault: false
    }));
    
    setTemplateDialogOpen(false);
    setNewTemplate({ name: '', description: '', elements: [] });
  };

  // Handle contract generation
  const handleGenerateContract = async () => {
    if (!contractRequest.templateId || !contractRequest.leadId) return;
    
    const result = await dispatch(generateContract(contractRequest));
    if (result.type === generateContract.fulfilled.type) {
      setContractDialogOpen(false);
      setActiveView('instances');
    }
  };

  // Handle template selection for contract generation
  const handleSelectTemplateForContract = (template: ContractTemplate) => {
    setContractRequest(prev => ({ ...prev, templateId: template._id }));
    setContractDialogOpen(true);
  };

  // Get default template elements
  const getDefaultElements = (): ContractElement[] => [
    {
      id: 'header-1',
      type: 'header',
      content: 'CONTRACT AGREEMENT',
      properties: {
        required: true,
        style: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }
      }
    },
    {
      id: 'text-1',
      type: 'text',
      content: 'This agreement is between {{realtor.name}} and {{lead.name}} for the property at {{lead.propertyAddress}}.',
      properties: {
        required: true,
        variable: 'contractDescription'
      }
    },
    {
      id: 'variable-1',
      type: 'variable',
      content: 'Purchase Price',
      properties: {
        required: true,
        placeholder: 'Enter purchase price',
        variable: 'purchasePrice'
      }
    },
    {
      id: 'signature-1',
      type: 'signature',
      content: 'Client Signature',
      properties: {
        required: true,
        title: 'Client Signature'
      }
    },
    {
      id: 'signature-2',
      type: 'signature',
      content: 'Realtor Signature',
      properties: {
        required: true,
        title: 'Realtor Signature'
      }
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Contract Builder
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => window.location.href = '/realtor/contract-drag-builder'}
              color="primary"
            >
              Create New Template
            </Button>
            <Button
              variant={activeView === 'templates' ? 'contained' : 'outlined'}
              onClick={() => setActiveView('templates')}
            >
              Templates
            </Button>
            <Button
              variant={activeView === 'instances' ? 'contained' : 'outlined'}
              onClick={() => setActiveView('instances')}
            >
              Contracts
            </Button>
            <Button
              variant={activeView === 'builder' ? 'contained' : 'outlined'}
              onClick={() => setActiveView('builder')}
              disabled={!selectedTemplate}
            >
              Builder
            </Button>
          </Box>
        </Box>

        {/* Error Display */}
        {(templatesError || contractsError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {templatesError || contractsError}
          </Alert>
        )}

        {/* Templates View */}
        {activeView === 'templates' && (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5">Contract Templates</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setTemplateDialogOpen(true)}
                disabled={isCreatingTemplate}
              >
                {isCreatingTemplate ? <CircularProgress size={20} /> : 'Create Template'}
              </Button>
            </Box>

            {isLoadingTemplates ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 3 }}>
                {templates.map((template) => (
                  <Card key={template._id}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                          <Typography variant="h6" component="h3">
                            {template.name}
                          </Typography>
                          {template.isDefault && (
                            <Chip label="Default" color="primary" size="small" />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {template.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {template.elements.length} elements
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => {
                              setSelectedTemplate(template);
                              setActiveView('builder');
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            startIcon={<CopyIcon />}
                            onClick={() => handleSelectTemplateForContract(template)}
                          >
                            Use Template
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => dispatch(deleteContractTemplate(template._id))}
                            disabled={template.isDefault}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Contracts/Instances View */}
        {activeView === 'instances' && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Generated Contracts
            </Typography>
            <List>
              {instances.map((instance) => (
                <ListItem key={instance._id} divider>
                  <ListItemText
                    primary={`Contract for ${instance.leadId}`}
                    secondary={`Status: ${instance.status} • Created: ${new Date(instance.createdAt).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => {
                        dispatch(setCurrentInstance(instance));
                        setPreviewDialogOpen(true);
                      }}
                    >
                      <PreviewIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Builder View */}
        {activeView === 'builder' && selectedTemplate && (
          <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Editing: {selectedTemplate.name}
            </Typography>
            <Typography variant="body1">
              Template builder interface would go here. This would include:
            </Typography>
            <ul>
              <li>Drag and drop element editor</li>
              <li>Variable insertion tools</li>
              <li>Preview functionality</li>
              <li>Save/update template capabilities</li>
            </ul>
          </Box>
        )}

        {/* Create Template Dialog */}
        <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Template Name"
              fullWidth
              variant="outlined"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCreateTemplate} 
              variant="contained"
              disabled={!newTemplate.name.trim() || isCreatingTemplate}
            >
              {isCreatingTemplate ? <CircularProgress size={20} /> : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Generate Contract Dialog */}
        <Dialog open={contractDialogOpen} onClose={() => setContractDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Generate Contract</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Lead ID"
              fullWidth
              variant="outlined"
              value={contractRequest.leadId}
              onChange={(e) => setContractRequest(prev => ({ ...prev, leadId: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Client ID (Optional)"
              fullWidth
              variant="outlined"
              value={contractRequest.clientId}
              onChange={(e) => setContractRequest(prev => ({ ...prev, clientId: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Auto-fill Variables</InputLabel>
              <Select
                value={contractRequest.autoFill ? 'yes' : 'no'}
                label="Auto-fill Variables"
                onChange={(e) => setContractRequest(prev => ({ ...prev, autoFill: e.target.value === 'yes' }))}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setContractDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleGenerateContract} 
              variant="contained"
              disabled={!contractRequest.templateId || !contractRequest.leadId || isGeneratingContract}
              startIcon={isGeneratingContract ? <CircularProgress size={20} /> : <AutoFillIcon />}
            >
              {isGeneratingContract ? 'Generating...' : 'Generate Contract'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Contract Preview Dialog */}
        <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Contract Preview</DialogTitle>
          <DialogContent>
            {currentInstance && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Contract Details
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Status:</strong> {currentInstance.status}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Lead ID:</strong> {currentInstance.leadId}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Created:</strong> {new Date(currentInstance.createdAt).toLocaleString()}
                </Typography>
                
                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Contract Data</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px' }}>
                      {JSON.stringify(currentInstance.contractData, null, 2)}
                    </pre>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Signatures ({currentInstance.signatures.length})</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {currentInstance.signatures.length > 0 ? (
                      currentInstance.signatures.map((sig, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            <strong>{sig.signerType}:</strong> Signed on {new Date(sig.signedAt).toLocaleString()}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No signatures yet
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default ContractBuilder;
