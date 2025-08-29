import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  IconButton,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Title as TitleIcon,
  TextFields as TextIcon,
  EditOutlined as SignatureIcon,
  DateRange as DateIcon,
  CheckBox as CheckboxIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Save as SaveIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';

interface ContractElement {
  id: string;
  type: string;
  content: string;
  workspaceId?: string;
}

interface WorkspaceInfo {
  id: string;
  name: string;
  type: string;
  domain?: string;
}

const ContractDragDropBuilder: React.FC = () => {
  const [elements, setElements] = useState<ContractElement[]>([]);
  const [draggedElementType, setDraggedElementType] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [contractName, setContractName] = useState('Untitled Contract');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { workspaceName } = useParams();
  const location = useLocation();

  // Detect workspace from domain or URL
  useEffect(() => {
    const detectWorkspace = async () => {
      try {
        setLoading(true);
        
        // Check if accessing via subdomain
        const hostname = window.location.hostname;
        const isSubdomain = hostname.includes('.') && !hostname.startsWith('localhost');
        
        let workspaceIdentifier = workspaceName;
        
        if (isSubdomain && !workspaceName) {
          // Extract workspace name from subdomain (e.g., acme.yourdomain.com -> acme)
          workspaceIdentifier = hostname.split('.')[0];
        }
        
        if (workspaceIdentifier) {
          // Fetch workspace info
          const response = await fetch(`/api/workspaces/by-name/${workspaceIdentifier}`);
          if (response.ok) {
            const workspaceData = await response.json();
            setWorkspace({
              id: workspaceData._id,
              name: workspaceData.name,
              type: workspaceData.type,
              domain: hostname
            });
          }
        }
      } catch (error) {
        console.error('Failed to load workspace:', error);
      } finally {
        setLoading(false);
      }
    };

    detectWorkspace();
  }, [workspaceName]);

  const elementTypes = [
    { type: 'header', label: 'Header', icon: TitleIcon },
    { type: 'text', label: 'Text Block', icon: TextIcon },
    { type: 'signature', label: 'Signature', icon: SignatureIcon },
    { type: 'date', label: 'Date', icon: DateIcon },
    { type: 'checkbox', label: 'Checkbox', icon: CheckboxIcon }
  ];

  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    console.log('🚀 Drag started:', elementType);
    setDraggedElementType(elementType);
    e.dataTransfer.setData('text/plain', elementType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('text/plain');
    console.log('📍 Dropped:', elementType);
    
    if (elementType && draggedElementType) {
      const elementTypeObj = elementTypes.find(et => et.type === elementType);
      if (elementTypeObj) {
        const newElement: ContractElement = {
          id: `${elementType}-${Date.now()}`,
          type: elementType,
          content: `New ${elementTypeObj.label}`
        };
        
        setElements(prev => [...prev, newElement]);
        console.log('✅ Element added:', newElement);
      }
    }
    
    setDraggedElementType(null);
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
  };

  const saveContract = async () => {
    if (!workspace) {
      alert('No workspace loaded');
      return;
    }

    try {
      const contractData = {
        name: contractName,
        elements: elements,
        workspaceId: workspace.id,
        category: 'Custom'
      };

      const response = await fetch('/api/contract-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData)
      });

      if (response.ok) {
        alert('Contract saved successfully!');
        setSaveDialogOpen(false);
      } else {
        alert('Failed to save contract');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save contract');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Workspace Header */}
      <Paper sx={{ p: 2, borderRadius: 0, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            {workspace ? (
              <Box>
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  📄 Contract Builder - {workspace.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Domain: {workspace.domain} | Type: {workspace.type}
                </Typography>
              </Box>
            ) : (
              <Typography variant="h6">Contract Builder</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              size="small"
              placeholder="Contract name"
              sx={{ minWidth: 200 }}
            />
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => setSaveDialogOpen(true)}
              disabled={!workspace || elements.length === 0}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              disabled={elements.length === 0}
            >
              Preview
            </Button>
          </Box>
        </Box>
        
        {loading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Loading workspace information...
          </Alert>
        )}
        
        {!workspace && !loading && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            No workspace detected. Please access via workspace URL or subdomain.
          </Alert>
        )}
      </Paper>

      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Rest of the component stays the same */}
      <Paper sx={{ width: 250, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          🧰 Toolbox
        </Typography>
        <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
          Drag elements to the canvas →
        </Typography>
        
        {elementTypes.map((elementType, index) => (
          <Card
            key={elementType.type}
            draggable
            onDragStart={(e) => handleDragStart(e, elementType.type)}
            sx={{
              mb: 1,
              cursor: 'grab',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              },
              '&:active': { 
                cursor: 'grabbing',
                transform: 'scale(0.95)'
              }
            }}
          >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <elementType.icon sx={{ mr: 1, fontSize: 20, color: '#1976d2' }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {elementType.label}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Paper>

      {/* Canvas */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          📄 Contract Canvas
        </Typography>
        <Paper
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            minHeight: 500,
            p: 2,
            border: '2px dashed #ddd',
            borderRadius: 2,
            backgroundColor: draggedElementType ? '#f0f8ff' : 'white',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: draggedElementType ? '#1976d2' : '#ddd'
            }
          }}
        >
          {elements.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              color: '#666'
            }}>
              <Typography variant="h6" gutterBottom>
                🎯 Drop Zone
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Drag elements from the toolbox to build your contract
              </Typography>
            </Box>
          ) : (
            elements.map((element, index) => (
              <Card
                key={element.id}
                sx={{
                  mb: 2,
                  border: '1px solid #eee',
                  position: 'relative',
                  '&:hover': {
                    borderColor: '#1976d2',
                    boxShadow: '0 2px 8px rgba(25,118,210,0.1)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">{element.content}</Typography>
                    <Box>
                      <IconButton
                        size="small"
                        sx={{ mr: 1, color: '#1976d2' }}
                      >
                        <DragIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteElement(element.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    Type: {element.type}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Paper>
      </Box>
    </Box>

    {/* Save Dialog */}
    <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
      <DialogTitle>Save Contract Template</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Contract Name"
          fullWidth
          variant="outlined"
          value={contractName}
          onChange={(e) => setContractName(e.target.value)}
        />
        {workspace && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Saving to workspace: {workspace.name}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
        <Button onClick={saveContract} variant="contained" disabled={!contractName.trim()}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
  );
};

export default ContractDragDropBuilder;
