import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Visibility as PreviewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
}

interface ContractTemplatesProps {
  onSelectTemplate: (template: ContractTemplate) => void;
  onPreviewTemplate?: (template: ContractTemplate) => void;
  onCreateTemplate?: (template: Omit<ContractTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditTemplate?: (template: ContractTemplate) => void;
  onDeleteTemplate?: (templateId: string) => void;
  selectedTemplateId?: string;
}

const defaultTemplates: ContractTemplate[] = [
  {
    id: 'purchase-agreement',
    name: 'Residential Purchase Agreement',
    description: 'Standard residential real estate purchase agreement',
    type: 'purchase',
    content: `
      <h1>RESIDENTIAL PURCHASE AGREEMENT</h1>
      
      <p><strong>Property Address:</strong> ` + `{{property.address}}` + `, ` + `{{property.city}}` + `, ` + `{{property.state}}` + ` ` + `{{property.zipCode}}` + `</p>
      
      <h2>BUYER INFORMATION</h2>
      <p><strong>Buyer Name:</strong> ` + `{{buyer.fullName}}` + `</p>
      <p><strong>Buyer Address:</strong> ` + `{{buyer.address}}` + `</p>
      <p><strong>Buyer Phone:</strong> ` + `{{buyer.phone}}` + `</p>
      <p><strong>Buyer Email:</strong> ` + `{{buyer.email}}` + `</p>
      
      <h2>SELLER INFORMATION</h2>
      <p><strong>Seller Name:</strong> ` + `{{seller.fullName}}` + `</p>
      <p><strong>Seller Address:</strong> ` + `{{seller.address}}` + `</p>
      <p><strong>Seller Phone:</strong> ` + `{{seller.phone}}` + `</p>
      <p><strong>Seller Email:</strong> ` + `{{seller.email}}` + `</p>
      
      <h2>PURCHASE TERMS</h2>
      <p><strong>Purchase Price:</strong> $` + `{{financial.purchasePrice}}` + `</p>
      <p><strong>Down Payment:</strong> $` + `{{financial.downPayment}}` + `</p>
      <p><strong>Loan Amount:</strong> $` + `{{financial.loanAmount}}` + `</p>
      <p><strong>Closing Date:</strong> ` + `{{dates.closingDate}}` + `</p>
      
      <h2>SIGNATURES</h2>
      <p>Buyer Signature: <span class="signature-line"></span> Date: <span class="date-line"></span></p>
      <p>Seller Signature: <span class="signature-line"></span> Date: <span class="date-line"></span></p>
    `,
    variables: ['buyer.fullName', 'buyer.address', 'seller.fullName', 'property.address', 'financial.purchasePrice'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isDefault: true,
  },
  {
    id: 'lease-agreement',
    name: 'Residential Lease Agreement',
    description: 'Standard residential lease agreement template',
    type: 'lease',
    content: `
      <h1>RESIDENTIAL LEASE AGREEMENT</h1>
      
      <p><strong>Property Address:</strong> ` + `{{property.address}}` + `, ` + `{{property.city}}` + `, ` + `{{property.state}}` + ` ` + `{{property.zipCode}}` + `</p>
      
      <h2>LANDLORD INFORMATION</h2>
      <p><strong>Landlord Name:</strong> ` + `{{seller.fullName}}` + `</p>
      <p><strong>Landlord Address:</strong> ` + `{{seller.address}}` + `</p>
      <p><strong>Landlord Phone:</strong> ` + `{{seller.phone}}` + `</p>
      
      <h2>TENANT INFORMATION</h2>
      <p><strong>Tenant Name:</strong> ` + `{{buyer.fullName}}` + `</p>
      <p><strong>Tenant Phone:</strong> ` + `{{buyer.phone}}` + `</p>
      <p><strong>Tenant Email:</strong> ` + `{{buyer.email}}` + `</p>
      
      <h2>LEASE TERMS</h2>
      <p><strong>Monthly Rent:</strong> $` + `{{financial.monthlyRent}}` + `</p>
      <p><strong>Security Deposit:</strong> $` + `{{financial.securityDeposit}}` + `</p>
      <p><strong>Lease Start Date:</strong> ` + `{{dates.leaseStartDate}}` + `</p>
      <p><strong>Lease End Date:</strong> ` + `{{dates.leaseEndDate}}` + `</p>
      
      <h2>SIGNATURES</h2>
      <p>Tenant Signature: <span class="signature-line"></span> Date: <span class="date-line"></span></p>
      <p>Landlord Signature: <span class="signature-line"></span> Date: <span class="date-line"></span></p>
    `,
    variables: ['buyer.fullName', 'seller.fullName', 'property.address', 'financial.monthlyRent'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isDefault: true,
  },
  {
    id: 'listing-agreement',
    name: 'Exclusive Listing Agreement',
    description: 'Exclusive right to sell listing agreement',
    type: 'listing',
    content: `
      <h1>EXCLUSIVE RIGHT TO SELL LISTING AGREEMENT</h1>
      
      <p><strong>Property Address:</strong> ` + `{{property.address}}` + `, ` + `{{property.city}}` + `, ` + `{{property.state}}` + ` ` + `{{property.zipCode}}` + `</p>
      
      <h2>SELLER INFORMATION</h2>
      <p><strong>Seller Name:</strong> ` + `{{seller.fullName}}` + `</p>
      <p><strong>Seller Address:</strong> ` + `{{seller.address}}` + `</p>
      <p><strong>Seller Phone:</strong> ` + `{{seller.phone}}` + `</p>
      
      <h2>AGENT INFORMATION</h2>
      <p><strong>Agent Name:</strong> ` + `{{agent.fullName}}` + `</p>
      <p><strong>Brokerage:</strong> ` + `{{agent.brokerage}}` + `</p>
      <p><strong>Agent License:</strong> ` + `{{agent.licenseNumber}}` + `</p>
      <p><strong>Agent Phone:</strong> ` + `{{agent.phone}}` + `</p>
      
      <h2>LISTING TERMS</h2>
      <p><strong>List Price:</strong> $` + `{{financial.listPrice}}` + `</p>
      <p><strong>Commission Rate:</strong> ` + `{{financial.commissionRate}}` + `%</p>
      <p><strong>Listing Period:</strong> ` + `{{dates.listingStartDate}}` + ` to ` + `{{dates.listingEndDate}}` + `</p>
      
      <h2>SIGNATURES</h2>
      <p>Seller Signature: <span class="signature-line"></span> Date: <span class="date-line"></span></p>
      <p>Agent Signature: <span class="signature-line"></span> Date: <span class="date-line"></span></p>
    `,
    variables: ['seller.fullName', 'property.address', 'agent.fullName', 'financial.listPrice'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isDefault: true,
  },
];

const ContractTemplates: React.FC<ContractTemplatesProps> = ({
  onSelectTemplate,
  onPreviewTemplate,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  selectedTemplateId,
}) => {
  const [templates] = useState<ContractTemplate[]>(defaultTemplates);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    type: 'purchase',
    content: '',
  });

  const contractTypes = [
    { value: 'purchase', label: 'Purchase Agreement' },
    { value: 'lease', label: 'Lease Agreement' },
    { value: 'listing', label: 'Listing Agreement' },
    { value: 'disclosure', label: 'Disclosure Form' },
    { value: 'amendment', label: 'Amendment' },
    { value: 'addendum', label: 'Addendum' },
    { value: 'other', label: 'Other' },
  ];

  const getTypeColor = (type: string) => {
    const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
      purchase: 'primary',
      lease: 'secondary',
      listing: 'success',
      disclosure: 'warning',
      amendment: 'info',
      addendum: 'info',
      other: 'secondary',
    };
    return colors[type] || 'secondary';
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) return;

    const template = {
      ...newTemplate,
      variables: [], // Would extract variables from content in real implementation
    };

    onCreateTemplate?.(template);
    setCreateDialogOpen(false);
    setNewTemplate({ name: '', description: '', type: 'purchase', content: '' });
  };

  const handleEditTemplate = (template: ContractTemplate) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      description: template.description,
      type: template.type,
      content: template.content,
    });
    setCreateDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingTemplate || !newTemplate.name || !newTemplate.content) return;

    const updatedTemplate = {
      ...editingTemplate,
      ...newTemplate,
      updatedAt: new Date().toISOString(),
    };

    onEditTemplate?.(updatedTemplate);
    setCreateDialogOpen(false);
    setEditingTemplate(null);
    setNewTemplate({ name: '', description: '', type: 'purchase', content: '' });
  };

  const handleCloseDialog = () => {
    setCreateDialogOpen(false);
    setEditingTemplate(null);
    setNewTemplate({ name: '', description: '', type: 'purchase', content: '' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Contract Templates
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Template
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 2,
        }}
      >
        {templates.map((template) => (
          <Card
            key={template.id}
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: selectedTemplateId === template.id ? 2 : 1,
                borderColor: selectedTemplateId === template.id ? 'primary.main' : 'divider',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 2,
                },
              }}
              onClick={() => onSelectTemplate(template)}
            >
              <CardContent sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {template.name}
                  </Typography>
                  {template.isDefault && (
                    <Chip label="Default" size="small" color="primary" variant="outlined" />
                  )}
                </Box>

                <Chip
                  label={contractTypes.find(t => t.value === template.type)?.label || template.type}
                  size="small"
                  color={getTypeColor(template.type)}
                  sx={{ mb: 1 }}
                />

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Variables: {template.variables.length}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {onPreviewTemplate && (
                    <Tooltip title="Preview">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewTemplate(template);
                        }}
                      >
                        <PreviewIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {onEditTemplate && !template.isDefault && (
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTemplate(template);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  {onDeleteTemplate && !template.isDefault && (
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTemplate(template.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <Button
                  size="small"
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                >
                  Use Template
                </Button>
              </CardActions>
            </Card>
        ))}
      </Box>

      {/* Create/Edit Template Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {editingTemplate ? 'Edit Template' : 'Create New Template'}
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={newTemplate.description}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />

            <FormControl fullWidth>
              <InputLabel>Contract Type</InputLabel>
              <Select
                value={newTemplate.type}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, type: e.target.value }))}
                label="Contract Type"
              >
                {contractTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Template Content"
              value={newTemplate.content}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
              fullWidth
              multiline
              rows={10}
              required
              placeholder="Enter your contract template content here. Use {{variable.name}} for dynamic content."
            />

            <Alert severity="info">
              Use double curly braces to create variables (e.g., {`{{buyer.fullName}}`}, {`{{property.address}}`}).
              Variables will be automatically detected and available for data entry.
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button
            onClick={editingTemplate ? handleSaveEdit : handleCreateTemplate}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!newTemplate.name || !newTemplate.content}
          >
            {editingTemplate ? 'Save Changes' : 'Create Template'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContractTemplates;
