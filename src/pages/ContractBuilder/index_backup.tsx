export { default } from './ContractBuilderRedux';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  IconButton,
  TextField,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Badge,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  Create as SignatureIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  DragHandle as DragIcon,
  Title as TitleIcon,
  Subject as TextIcon,
  TableChart as TableIcon,
  CheckBox as CheckboxIcon,
  RadioButtonChecked as RadioIcon,
  CalendarToday as DateIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Home as PropertyIcon,
  Business as CompanyIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Settings as SettingsIcon,
  Description as TemplateIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as InspectIcon,
  ContentCopy as CopyIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  Palette as ColorIcon,
  Height as SpacingIcon,
  ViewModule as LayoutIcon,
  TouchApp as InteractiveIcon,
  Code as CodeIcon,
  Info as InfoIcon,
  Image as ImageIcon,
  CalendarToday as CalendarTodayIcon,
  TextFields as TextFieldsIcon,
  List as ListIcon,
  Height as HeightIcon,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

// Contract element types with enhanced properties
interface ContractElement {
  id: string;
  type: 'header' | 'text' | 'table' | 'checkbox' | 'radio' | 'date' | 'signature' | 'variable' | 'spacer' | 'image' | 'list';
  content: string;
  properties?: {
    style?: React.CSSProperties;
    required?: boolean;
    options?: string[];
    variable?: string;
    title?: string;
    description?: string;
    showDate?: boolean;
    showTitle?: boolean;
    placeholder?: string;
    rows?: number;
    columns?: string[];
    tableData?: string[][];
    listType?: 'bullet' | 'numbered';
    listItems?: string[];
    width?: string;
    height?: string;
  };
}

// Template interface
interface Template {
  id: string;
  name: string;
  description: string;
  elements: ContractElement[];
  createdAt?: string;
  category?: string;
}

// Enhanced draggable element types for the sidebar
const elementTypes = [
  { 
    type: 'header', 
    label: 'Header', 
    icon: <TitleIcon />, 
    description: 'Section headers and titles',
    category: 'Text',
    color: '#1976d2'
  },
  { 
    type: 'text', 
    label: 'Text Block', 
    icon: <TextIcon />, 
    description: 'Paragraphs and content',
    category: 'Text',
    color: '#424242'
  },
  { 
    type: 'table', 
    label: 'Table', 
    icon: <TableIcon />, 
    description: 'Data tables and lists',
    category: 'Data',
    color: '#ff9800'
  },
  { 
    type: 'list', 
    label: 'List', 
    icon: <LayoutIcon />, 
    description: 'Bullet or numbered lists',
    category: 'Data',
    color: '#ff9800'
  },
  { 
    type: 'checkbox', 
    label: 'Checkbox', 
    icon: <CheckboxIcon />, 
    description: 'Yes/No selections',
    category: 'Interactive',
    color: '#4caf50'
  },
  { 
    type: 'radio', 
    label: 'Radio Button', 
    icon: <RadioIcon />, 
    description: 'Multiple choice options',
    category: 'Interactive',
    color: '#4caf50'
  },
  { 
    type: 'date', 
    label: 'Date Field', 
    icon: <DateIcon />, 
    description: 'Date picker fields',
    category: 'Interactive',
    color: '#9c27b0'
  },
  { 
    type: 'signature', 
    label: 'Signature', 
    icon: <SignatureIcon />, 
    description: 'Digital signature areas',
    category: 'Interactive',
    color: '#f44336'
  },
  { 
    type: 'variable', 
    label: 'Variable', 
    icon: <PersonIcon />, 
    description: 'Dynamic content fields',
    category: 'Dynamic',
    color: '#673ab7'
  },
  { 
    type: 'spacer', 
    label: 'Spacer', 
    icon: <SpacingIcon />, 
    description: 'Add spacing between elements',
    category: 'Layout',
    color: '#607d8b'
  },
];

// Variable types for contracts
const variableTypes = [
  { key: 'buyer.name', label: 'Buyer Name', icon: <PersonIcon /> },
  { key: 'seller.name', label: 'Seller Name', icon: <PersonIcon /> },
  { key: 'property.address', label: 'Property Address', icon: <PropertyIcon /> },
  { key: 'property.price', label: 'Purchase Price', icon: <MoneyIcon /> },
  { key: 'contract.date', label: 'Contract Date', icon: <DateIcon /> },
  { key: 'agent.name', label: 'Agent Name', icon: <CompanyIcon /> },
  { key: 'agent.company', label: 'Brokerage', icon: <CompanyIcon /> },
];

const ContractBuilder: React.FC = () => {
  const [elements, setElements] = useState<ContractElement[]>([]);
  const [sidebarOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [contractTitle, setContractTitle] = useState('Untitled Contract');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [variablesOpen, setVariablesOpen] = useState(false);
  const [signatureSetupOpen, setSignatureSetupOpen] = useState(false);
  const [templateManagerOpen, setTemplateManagerOpen] = useState(false);
  const [currentSignatureElement, setCurrentSignatureElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [inspectMode, setInspectMode] = useState(false);
  const [draggedElementType, setDraggedElementType] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredDropZone, setHoveredDropZone] = useState<number | null>(null);
  const [signatureSettings, setSignatureSettings] = useState({
    required: true,
    title: 'Signature',
    description: 'Please sign here',
    showDate: true,
    showTitle: true,
  });
  
  // Enhanced templates with sample content
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'purchase-agreement',
      name: 'Purchase Agreement',
      description: 'Standard real estate purchase agreement',
      category: 'Real Estate',
      elements: [
        {
          id: 'header-1',
          type: 'header',
          content: 'REAL ESTATE PURCHASE AGREEMENT',
          properties: { 
            style: { 
              fontSize: '28px', 
              fontWeight: 'bold', 
              textAlign: 'center',
              marginBottom: '20px',
              textTransform: 'uppercase'
            } 
          }
        },
        {
          id: 'text-1',
          type: 'text',
          content: 'This Purchase Agreement is entered into on {{contract.date}} between the Buyer(s) {{buyer.name}} and the Seller(s) {{seller.name}} for the property located at {{property.address}}.',
          properties: { style: { fontSize: '16px', lineHeight: '1.6' } }
        }
      ],
    },
    {
      id: 'lease-agreement', 
      name: 'Lease Agreement',
      description: 'Residential lease agreement template',
      category: 'Real Estate',
      elements: [
        {
          id: 'header-2',
          type: 'header',
          content: 'RESIDENTIAL LEASE AGREEMENT',
          properties: { 
            style: { 
              fontSize: '24px', 
              fontWeight: 'bold', 
              textAlign: 'center',
              marginBottom: '20px'
            } 
          }
        }
      ],
    },
  ]);

  // Initialize drag and drop handlers
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (elements.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [elements]);

  // Enhanced drag and drop with better feedback and error handling
  const onDragStart = useCallback((start: any) => {
    console.log('Drag started:', start);
    setDraggedElementType(start.draggableId);
    setIsDragging(true);
    
    // Add visual feedback to the body
    document.body.style.cursor = 'grabbing';
  }, []);

  const onDragUpdate = useCallback((update: any) => {
    console.log('Drag update:', update);
    const { destination } = update;
    
    if (destination && destination.droppableId === 'canvas') {
      setHoveredDropZone(destination.index);
    } else {
      setHoveredDropZone(null);
    }
  }, []);

  const onDragEnd = useCallback((result: DropResult) => {
    console.log('Drag ended:', result);
    const { destination, source, draggableId } = result;

    // Reset drag state
    setDraggedElementType(null);
    setIsDragging(false);
    setHoveredDropZone(null);
    document.body.style.cursor = '';

    if (!destination) {
      console.log('No destination - drag cancelled');
      return;
    }

    console.log('Source:', source, 'Destination:', destination);

    try {
      // If dragging from sidebar to canvas
      if (source.droppableId === 'sidebar' && destination.droppableId === 'canvas') {
        console.log('Adding new element:', draggableId);
        const elementType = draggableId as ContractElement['type'];
        const newElement: ContractElement = {
          id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: elementType,
          content: getDefaultContent(elementType),
          properties: getDefaultProperties(elementType),
        };

        const newElements = [...elements];
        newElements.splice(destination.index, 0, newElement);
        setElements(newElements);
        setSelectedElement(newElement.id);
        setRightSidebarOpen(true);
        
        console.log('New elements:', newElements);
        
        // Show success feedback
        console.log(`Added ${elementType} element to contract`);
        return;
      }

      // If reordering within canvas
      if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
        console.log('Reordering elements');
        const newElements = Array.from(elements);
        const [reorderedItem] = newElements.splice(source.index, 1);
        newElements.splice(destination.index, 0, reorderedItem);
        setElements(newElements);
        
        console.log('Reordered elements:', newElements);
      }
    } catch (error) {
      console.error('Error in drag and drop:', error);
      // You could show an error toast here
    }
  }, [elements]);

  const getDefaultContent = (type: ContractElement['type']): string => {
    switch (type) {
      case 'header': return 'New Section Header';
      case 'text': return 'Enter your contract text here. You can edit this content by clicking on it or using the inspector panel.';
      case 'table': return 'Table Content';
      case 'list': return 'List Item 1';
      case 'checkbox': return 'Checkbox Option';
      case 'radio': return 'Radio Option';
      case 'date': return 'Date: ___________';
      case 'signature': return signatureSettings.title;
      case 'variable': return '{{buyer.name}}';
      case 'spacer': return '';
      default: return 'Content';
    }
  };

  const getDefaultProperties = (type: ContractElement['type']) => {
    switch (type) {
      case 'header': 
        return { 
          style: { 
            fontSize: '24px', 
            fontWeight: 'bold', 
            textAlign: 'center' as const,
            marginBottom: '16px',
            marginTop: '16px'
          } 
        };
      case 'text':
        return { 
          style: { 
            fontSize: '16px', 
            lineHeight: '1.6',
            marginBottom: '12px'
          } 
        };
      case 'table':
        return {
          columns: ['Column 1', 'Column 2', 'Column 3'],
          tableData: [
            ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
            ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
          ],
          style: { marginBottom: '16px' }
        };
      case 'list':
        return {
          listType: 'bullet' as const,
          listItems: ['First item', 'Second item', 'Third item'],
          style: { marginBottom: '12px' }
        };
      case 'signature': 
        return { 
          required: signatureSettings.required,
          title: signatureSettings.title,
          description: signatureSettings.description,
          showDate: signatureSettings.showDate,
          showTitle: signatureSettings.showTitle,
          style: { marginTop: '20px', marginBottom: '20px' }
        };
      case 'checkbox': 
        return { 
          required: false, 
          options: ['Yes', 'No'],
          style: { marginBottom: '8px' }
        };
      case 'radio': 
        return { 
          required: false, 
          options: ['Option 1', 'Option 2', 'Option 3'],
          style: { marginBottom: '8px' }
        };
      case 'date':
        return {
          placeholder: 'Select date',
          required: false,
          style: { marginBottom: '8px' }
        };
      case 'variable':
        return {
          variable: 'buyer.name',
          style: { 
            display: 'inline-block',
            backgroundColor: '#e3f2fd',
            padding: '4px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }
        };
      case 'spacer':
        return {
          height: '20px',
          style: { height: '20px', backgroundColor: 'transparent' }
        };
      default: 
        return { style: { marginBottom: '8px' } };
    }
  };

  const updateElement = (id: string, updates: Partial<ContractElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  // Handle signature element clicks to open setup dialog
  const handleSignatureClick = (element: ContractElement) => {
    setCurrentSignatureElement(element.id);
    setSignatureSettings({
      title: element.properties?.title || 'Digital Signature',
      description: element.properties?.description || '',
      required: element.properties?.required || false,
      showDate: element.properties?.showDate || false,
      showTitle: element.properties?.showTitle || true,
    });
    setSignatureSetupOpen(true);
  };

  // Handle saving current contract as template
  const handleSaveTemplate = (name: string, description: string) => {
    const newTemplate = {
      id: Date.now().toString(),
      name,
      description,
      elements: [...elements],
      createdAt: new Date().toISOString(),
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  // Handle deleting a template
  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  // Handle element selection for styling
  const handleElementSelect = (elementId: string) => {
    setSelectedElement(elementId);
    setRightSidebarOpen(true);
    setInspectMode(false);
  };

  // Handle style updates
  const updateElementStyle = (elementId: string, styleUpdates: React.CSSProperties) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { 
            ...el, 
            properties: { 
              ...el.properties, 
              style: { ...el.properties?.style, ...styleUpdates } 
            } 
          }
        : el
    ));
  };

  // Handle property updates
  const updateElementProperty = (elementId: string, property: string, value: any) => {
    setElements(prev => prev.map(el => 
      el.id === elementId 
        ? { 
            ...el, 
            properties: { 
              ...el.properties, 
              [property]: value 
            } 
          }
        : el
    ));
  };

  const renderElement = (element: ContractElement, index: number) => {
    const isSelected = selectedElement === element.id;

    return (
      <Draggable key={element.id} draggableId={element.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            onClick={() => {
              if (inspectMode) {
                handleElementSelect(element.id);
              } else {
                setSelectedElement(element.id);
              }
            }}
            sx={{
              mb: 1,
              border: isSelected ? '2px solid' : '1px solid',
              borderColor: isSelected ? 'primary.main' : 'divider',
              backgroundColor: snapshot.isDragging ? 'action.hover' : 'background.paper',
              cursor: inspectMode ? 'crosshair' : 'pointer',
              position: 'relative',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: inspectMode ? '0 0 10px rgba(25, 118, 210, 0.3)' : 'none',
              },
              ...(inspectMode && {
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  pointerEvents: 'none',
                },
              }),
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box
                  {...provided.dragHandleProps}
                  sx={{
                    color: 'text.secondary',
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' },
                  }}
                >
                  <DragIcon fontSize="small" />
                </Box>
                
                <Box sx={{ flex: 1 }}>
                  {/* Header Element */}
                  {element.type === 'header' && (
                    <Typography
                      variant={element.properties?.variant || 'h4'}
                      sx={{
                        ...element.properties?.style,
                        fontWeight: element.properties?.fontWeight || 'bold',
                        textAlign: element.properties?.textAlign || 'left',
                        color: element.properties?.color || 'text.primary',
                        borderBottom: element.properties?.underline ? '2px solid' : 'none',
                        borderColor: element.properties?.color || 'primary.main',
                        pb: element.properties?.underline ? 1 : 0,
                      }}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateElement(element.id, { content: e.currentTarget.textContent || '' })}
                    >
                      {element.content}
                    </Typography>
                  )}
                  
                  {/* Text Element */}
                  {element.type === 'text' && (
                    <Typography
                      variant="body1"
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        textAlign: element.properties?.textAlign || 'left',
                        fontSize: element.properties?.fontSize || '1rem',
                        lineHeight: element.properties?.lineHeight || 1.6,
                        ...element.properties?.style,
                      }}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => updateElement(element.id, { content: e.currentTarget.textContent || '' })}
                    >
                      {element.content}
                    </Typography>
                  )}
                  
                  {/* Table Element */}
                  {element.type === 'table' && (
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            {element.properties?.columns?.map((col: any, idx: number) => (
                              <TableCell key={idx} sx={{ fontWeight: 'bold', backgroundColor: 'grey.100' }}>
                                {col}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {element.properties?.rows?.map((row: any[], rowIdx: number) => (
                            <TableRow key={rowIdx}>
                              {row.map((cell, cellIdx) => (
                                <TableCell key={cellIdx}>{cell}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  
                  {/* List Element */}
                  {element.type === 'list' && (
                    <Box component={element.properties?.ordered ? 'ol' : 'ul'} sx={{ pl: 3, mb: 2 }}>
                      {element.properties?.items?.map((item: string, idx: number) => (
                        <Typography component="li" key={idx} sx={{ mb: 0.5 }}>
                          {item}
                        </Typography>
                      ))}
                    </Box>
                  )}
                  
                  {/* Checkbox Element */}
                  {element.type === 'checkbox' && (
                    <FormControlLabel
                      control={
                        <Checkbox 
                          defaultChecked={element.properties?.checked || false}
                          color="primary"
                          sx={{ color: element.properties?.required ? 'error.main' : 'primary.main' }}
                        />
                      }
                      label={
                        <Typography sx={{ fontWeight: element.properties?.required ? 'bold' : 'normal' }}>
                          {element.content}
                          {element.properties?.required && (
                            <Chip label="Required" size="small" color="error" sx={{ ml: 1 }} />
                          )}
                        </Typography>
                      }
                    />
                  )}
                  
                  {/* Radio Element */}
                  {element.type === 'radio' && (
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {element.content}
                        {element.properties?.required && (
                          <Chip label="Required" size="small" color="error" sx={{ ml: 1 }} />
                        )}
                      </FormLabel>
                      <RadioGroup>
                        {element.properties?.options?.map((option: string, idx: number) => (
                          <FormControlLabel
                            key={idx}
                            value={option}
                            control={<Radio color="primary" />}
                            label={option}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}
                  
                  {/* Date Element */}
                  {element.type === 'date' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <CalendarTodayIcon color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {element.properties?.label || 'Date Field'}
                        </Typography>
                        <Typography variant="h6">
                          {element.content || 'Select Date'}
                        </Typography>
                        {element.properties?.required && (
                          <Chip label="Required" size="small" color="error" />
                        )}
                      </Box>
                    </Box>
                  )}
                  
                  {/* Signature Element */}
                  {element.type === 'signature' && (
                    <Box 
                      sx={{ 
                        border: '2px dashed', 
                        borderColor: 'primary.main', 
                        p: 3, 
                        textAlign: 'center',
                        backgroundColor: 'primary.50',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'primary.100',
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSignatureClick(element);
                      }}
                    >
                      <SignatureIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6" color="primary.main" gutterBottom>
                        {element.properties?.title || 'Digital Signature'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {element.properties?.description || 'Click to configure signature settings'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Chip 
                          label={element.properties?.required ? 'Required' : 'Optional'} 
                          size="small" 
                          color={element.properties?.required ? 'error' : 'default'}
                        />
                        <Button
                          size="small"
                          startIcon={<SettingsIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentSignatureElement(element.id);
                            setSignatureSetupOpen(true);
                          }}
                        >
                          Setup
                        </Button>
                      </Box>
                    </Box>
                  )}
                  
                  {/* Variable Element */}
                  {element.type === 'variable' && (
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: 'primary.50',
                        border: '2px solid',
                        borderColor: 'primary.main',
                        borderRadius: 1,
                        px: 2,
                        py: 1,
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        color: 'primary.main',
                        gap: 1,
                      }}
                    >
                      <CodeIcon fontSize="small" />
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {element.content}
                      </Typography>
                      {element.properties?.description && (
                        <Tooltip title={element.properties.description}>
                          <InfoIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </Tooltip>
                      )}
                    </Box>
                  )}
                  
                  {/* Spacer Element */}
                  {element.type === 'spacer' && (
                    <Box
                      sx={{
                        height: element.properties?.height || 24,
                        backgroundColor: 'grey.100',
                        border: '1px dashed',
                        borderColor: 'grey.300',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.7,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Spacer ({element.properties?.height || 24}px)
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Image Element */}
                  {element.type === 'image' && (
                    <Box
                      sx={{
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        borderRadius: 1,
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: 'grey.50',
                        minHeight: element.properties?.height || 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'primary.50',
                        }
                      }}
                    >
                      {element.properties?.src ? (
                        <img
                          src={element.properties.src}
                          alt={element.properties?.alt || 'Contract Image'}
                          style={{
                            maxWidth: '100%',
                            maxHeight: element.properties?.height || 200,
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        <>
                          <ImageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            {element.content || 'Click to add image'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Upload an image or provide URL
                          </Typography>
                        </>
                      )}
                    </Box>
                  )}
                </Box>
                
                {isSelected && (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteElement(element.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Draggable>
    );
  };

  return (
    <DragDropContext 
      onDragEnd={onDragEnd}
      onDragStart={(start) => {
        console.log('Drag started:', start);
      }}
      onDragUpdate={(update) => {
        console.log('Drag update:', update);
      }}
    >
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Contract Builder - {contractTitle}
            </Typography>
            <Button
              startIcon={<TemplateIcon />}
            onClick={() => setTemplateManagerOpen(true)}
            sx={{ mr: 1 }}
          >
            Templates
          </Button>
          <Button
            startIcon={<InspectIcon />}
            onClick={() => {
              setInspectMode(!inspectMode);
              setRightSidebarOpen(true);
            }}
            variant={inspectMode ? "contained" : "outlined"}
            sx={{ mr: 1 }}
          >
            Inspect
          </Button>
          <Button
            startIcon={<PreviewIcon />}
            onClick={() => setPreviewOpen(true)}
            sx={{ mr: 1 }}
          >
            Preview
          </Button>
          <Button startIcon={<SaveIcon />} variant="contained">
            Save Contract
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Enhanced Sidebar with Categories */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={sidebarOpen}
          sx={{
            width: 320,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 320,
              position: 'relative',
              borderRight: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LayoutIcon color="primary" />
              Contract Elements
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag elements to the canvas to build your contract
            </Typography>
          </Box>
          
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <Droppable droppableId="sidebar" isDropDisabled={true}>
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps}>
                  {/* Group elements by category */}
                  {['Text', 'Data', 'Interactive', 'Dynamic', 'Layout'].map(category => {
                    const categoryElements = elementTypes.filter(et => et.category === category);
                    if (categoryElements.length === 0) return null;

                    return (
                      <Box key={category} sx={{ mb: 3 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            mb: 1, 
                            fontWeight: 'bold',
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {category}
                        </Typography>
                        
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                          {categoryElements.map((elementType, index) => {
                            const globalIndex = elementTypes.findIndex(et => et.type === elementType.type);
                            return (
                              <Box key={elementType.type}>
                                <Draggable
                                  draggableId={elementType.type}
                                  index={globalIndex}
                                >
                                  {(provided, snapshot) => (
                                    <Card
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      sx={{
                                        cursor: 'grab',
                                        userSelect: 'none',
                                        transition: 'all 0.2s ease',
                                        transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
                                        opacity: snapshot.isDragging ? 0.8 : 1,
                                        boxShadow: snapshot.isDragging ? 4 : 1,
                                        '&:hover': {
                                          boxShadow: 3,
                                          transform: 'translateY(-2px)',
                                          borderColor: elementType.color,
                                        },
                                        '&:active': { 
                                          cursor: 'grabbing',
                                          transform: 'scale(0.95)',
                                        },
                                        border: '2px solid transparent',
                                        borderColor: snapshot.isDragging ? elementType.color : 'transparent',
                                      }}
                                    >
                                      <CardContent sx={{ p: 1.5, textAlign: 'center', '&:last-child': { pb: 1.5 } }}>
                                        <Box
                                          sx={{
                                            color: elementType.color,
                                            mb: 0.5,
                                            fontSize: '1.5rem',
                                          }}
                                        >
                                          {elementType.icon}
                                        </Box>
                                        <Typography 
                                          variant="caption" 
                                          sx={{ 
                                            fontWeight: 'bold',
                                            display: 'block',
                                            lineHeight: 1.2,
                                            fontSize: '0.75rem'
                                          }}
                                        >
                                          {elementType.label}
                                        </Typography>
                                        {snapshot.isDragging && (
                                          <Typography 
                                            variant="caption" 
                                            sx={{ 
                                              color: 'text.secondary',
                                              fontSize: '0.65rem',
                                              display: 'block',
                                              mt: 0.25
                                            }}
                                          >
                                            Drop to add
                                          </Typography>
                                        )}
                                      </CardContent>
                                    </Card>
                                  )}
                                </Draggable>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    );
                  })}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>

            <Divider sx={{ my: 2 }} />
            
            <Stack spacing={1}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PersonIcon />}
                onClick={() => setVariablesOpen(true)}
                size="small"
              >
                Insert Variables
              </Button>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<TemplateIcon />}
                onClick={() => setTemplateManagerOpen(true)}
                size="small"
              >
                Load Template
              </Button>
            </Stack>

            {/* Drag Feedback */}
            {isDragging && (
              <Paper
                sx={{
                  position: 'fixed',
                  bottom: 16,
                  left: 16,
                  right: 16,
                  p: 2,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderRadius: 2,
                  zIndex: 1300,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                    '100%': { opacity: 1 },
                  },
                }}
              >
                <Typography variant="body2" textAlign="center" fontWeight="bold">
                  🎯 Drag to the canvas area to add element
                </Typography>
              </Paper>
            )}
          </Box>
        </Drawer>

        {/* Enhanced Main Canvas */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Container maxWidth="md" sx={{ flex: 1, py: 3, overflow: 'auto' }}>
            <Paper 
              elevation={2} 
              sx={{ 
                minHeight: '800px', 
                p: 3,
                position: 'relative',
                backgroundColor: isDragging ? 'grey.50' : 'background.paper',
                transition: 'background-color 0.2s ease',
              }}
            >
              <Droppable droppableId="canvas">
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      minHeight: '600px',
                      backgroundColor: snapshot.isDraggingOver ? 'primary.50' : 'transparent',
                      border: snapshot.isDraggingOver ? '2px dashed' : '2px dashed transparent',
                      borderColor: snapshot.isDraggingOver ? 'primary.main' : 'transparent',
                      borderRadius: 2,
                      p: 2,
                      transition: 'all 0.3s ease',
                      position: 'relative',
                    }}
                  >
                    {/* Enhanced Drop Indicator */}
                    {snapshot.isDraggingOver && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'primary.50',
                          opacity: 0.8,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 1,
                          animation: 'ripple 1.5s infinite',
                          '@keyframes ripple': {
                            '0%': { opacity: 0.3 },
                            '50%': { opacity: 0.6 },
                            '100%': { opacity: 0.3 },
                          },
                        }}
                      >
                        <Paper
                          elevation={4}
                          sx={{
                            p: 3,
                            textAlign: 'center',
                            backgroundColor: 'white',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            borderRadius: 2,
                          }}
                        >
                          <AddIcon 
                            sx={{ 
                              fontSize: 48, 
                              color: 'primary.main', 
                              mb: 1,
                              animation: 'bounce 1s infinite',
                              '@keyframes bounce': {
                                '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                                '40%': { transform: 'translateY(-10px)' },
                                '60%': { transform: 'translateY(-5px)' },
                              },
                            }} 
                          />
                          <Typography variant="h6" color="primary.main" fontWeight="bold">
                            Drop {draggedElementType} here
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Release to add element to your contract
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                    
                    {/* Empty State */}
                    {elements.length === 0 && !snapshot.isDraggingOver && (
                      <Box
                        sx={{
                          height: '500px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'text.secondary',
                          border: '3px dashed',
                          borderColor: isDragging ? 'primary.main' : 'divider',
                          borderRadius: 2,
                          transition: 'border-color 0.3s ease',
                          backgroundColor: isDragging ? 'primary.50' : 'transparent',
                        }}
                      >
                        <DragIcon sx={{ fontSize: 72, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                          Start Building Your Contract
                        </Typography>
                        <Typography variant="body1" textAlign="center" sx={{ mb: 2, maxWidth: 400 }}>
                          Drag elements from the sidebar to create a professional contract document
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                          <Chip 
                            icon={<TitleIcon />} 
                            label="Start with a Header" 
                            variant="outlined" 
                            size="small"
                          />
                          <Chip 
                            icon={<TextFieldsIcon />} 
                            label="Add Text Blocks" 
                            variant="outlined" 
                            size="small"
                          />
                          <Chip 
                            icon={<CheckboxIcon />} 
                            label="Include Checkboxes" 
                            variant="outlined" 
                            size="small"
                          />
                        </Box>
                      </Box>
                    )}
                    
                    {/* Contract Elements */}
                    {elements.map((element, index) => (
                      <Box key={element.id} sx={{ position: 'relative', mb: 2 }}>
                        {/* Drop zone before element */}
                        {draggedElementType && (
                          <Box
                            sx={{
                              height: '3px',
                              backgroundColor: hoveredDropZone === `before-${index}` ? 'primary.main' : 'transparent',
                              borderRadius: '1.5px',
                              mb: 1,
                              transition: 'all 0.2s ease',
                              transform: hoveredDropZone === `before-${index}` ? 'scaleY(2)' : 'scaleY(1)',
                            }}
                          />
                        )}
                        
                        {renderElement(element, index)}
                        
                        {/* Drop zone after last element */}
                        {index === elements.length - 1 && draggedElementType && (
                          <Box
                            sx={{
                              height: '3px',
                              backgroundColor: hoveredDropZone === `after-${index}` ? 'primary.main' : 'transparent',
                              borderRadius: '1.5px',
                              mt: 1,
                              transition: 'all 0.2s ease',
                              transform: hoveredDropZone === `after-${index}` ? 'scaleY(2)' : 'scaleY(1)',
                            }}
                          />
                        )}
                      </Box>
                    ))}
                    
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Paper>
          </Container>
        </Box>

        {/* Right Sidebar - Inspect Panel */}
        <Drawer
          variant="persistent"
          anchor="right"
          open={rightSidebarOpen}
          sx={{
            width: 320,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 320,
              position: 'relative',
              height: '100%',
              overflow: 'auto',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                Inspector
              </Typography>
              <IconButton onClick={() => setRightSidebarOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {selectedElement ? (
            <Box sx={{ p: 2 }}>
              {(() => {
                const element = elements.find(el => el.id === selectedElement);
                if (!element) return null;

                return (
                  <>
                    <Typography variant="h6" gutterBottom>
                      {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Element
                    </Typography>

                    {/* Content Editing */}
                    <Accordion defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Content</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TextField
                          fullWidth
                          label="Content"
                          multiline
                          rows={3}
                          value={element.content}
                          onChange={(e) => updateElement(element.id, { content: e.target.value })}
                          sx={{ mb: 2 }}
                        />
                      </AccordionDetails>
                    </Accordion>

                    {/* Typography Styling */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Typography</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <FormControl fullWidth>
                            <InputLabel>Font Size</InputLabel>
                            <Select
                              value={element.properties?.style?.fontSize || '16px'}
                              onChange={(e) => updateElementStyle(element.id, { fontSize: e.target.value })}
                            >
                              <MenuItem value="12px">12px</MenuItem>
                              <MenuItem value="14px">14px</MenuItem>
                              <MenuItem value="16px">16px</MenuItem>
                              <MenuItem value="18px">18px</MenuItem>
                              <MenuItem value="20px">20px</MenuItem>
                              <MenuItem value="24px">24px</MenuItem>
                              <MenuItem value="32px">32px</MenuItem>
                              <MenuItem value="48px">48px</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl fullWidth>
                            <InputLabel>Font Weight</InputLabel>
                            <Select
                              value={element.properties?.style?.fontWeight || 'normal'}
                              onChange={(e) => updateElementStyle(element.id, { fontWeight: e.target.value })}
                            >
                              <MenuItem value="normal">Normal</MenuItem>
                              <MenuItem value="bold">Bold</MenuItem>
                              <MenuItem value="lighter">Light</MenuItem>
                              <MenuItem value="100">100</MenuItem>
                              <MenuItem value="300">300</MenuItem>
                              <MenuItem value="500">500</MenuItem>
                              <MenuItem value="700">700</MenuItem>
                              <MenuItem value="900">900</MenuItem>
                            </Select>
                          </FormControl>

                          <FormControl fullWidth>
                            <InputLabel>Text Align</InputLabel>
                            <Select
                              value={element.properties?.style?.textAlign || 'left'}
                              onChange={(e) => updateElementStyle(element.id, { textAlign: e.target.value })}
                            >
                              <MenuItem value="left">Left</MenuItem>
                              <MenuItem value="center">Center</MenuItem>
                              <MenuItem value="right">Right</MenuItem>
                              <MenuItem value="justify">Justify</MenuItem>
                            </Select>
                          </FormControl>

                          <TextField
                            fullWidth
                            label="Text Color"
                            type="color"
                            value={element.properties?.style?.color || '#000000'}
                            onChange={(e) => updateElementStyle(element.id, { color: e.target.value })}
                          />
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    {/* Layout & Flexbox */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Layout & Flexbox</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <FormControl fullWidth>
                            <InputLabel>Display</InputLabel>
                            <Select
                              value={element.properties?.style?.display || 'block'}
                              onChange={(e) => updateElementStyle(element.id, { display: e.target.value })}
                            >
                              <MenuItem value="block">Block</MenuItem>
                              <MenuItem value="inline-block">Inline Block</MenuItem>
                              <MenuItem value="flex">Flex</MenuItem>
                              <MenuItem value="inline-flex">Inline Flex</MenuItem>
                              <MenuItem value="grid">Grid</MenuItem>
                              <MenuItem value="none">None</MenuItem>
                            </Select>
                          </FormControl>

                          {(element.properties?.style?.display === 'flex' || element.properties?.style?.display === 'inline-flex') && (
                            <>
                              <FormControl fullWidth>
                                <InputLabel>Flex Direction</InputLabel>
                                <Select
                                  value={element.properties?.style?.flexDirection || 'row'}
                                  onChange={(e) => updateElementStyle(element.id, { flexDirection: e.target.value })}
                                >
                                  <MenuItem value="row">Row</MenuItem>
                                  <MenuItem value="column">Column</MenuItem>
                                  <MenuItem value="row-reverse">Row Reverse</MenuItem>
                                  <MenuItem value="column-reverse">Column Reverse</MenuItem>
                                </Select>
                              </FormControl>

                              <FormControl fullWidth>
                                <InputLabel>Justify Content</InputLabel>
                                <Select
                                  value={element.properties?.style?.justifyContent || 'flex-start'}
                                  onChange={(e) => updateElementStyle(element.id, { justifyContent: e.target.value })}
                                >
                                  <MenuItem value="flex-start">Start</MenuItem>
                                  <MenuItem value="center">Center</MenuItem>
                                  <MenuItem value="flex-end">End</MenuItem>
                                  <MenuItem value="space-between">Space Between</MenuItem>
                                  <MenuItem value="space-around">Space Around</MenuItem>
                                  <MenuItem value="space-evenly">Space Evenly</MenuItem>
                                </Select>
                              </FormControl>

                              <FormControl fullWidth>
                                <InputLabel>Align Items</InputLabel>
                                <Select
                                  value={element.properties?.style?.alignItems || 'stretch'}
                                  onChange={(e) => updateElementStyle(element.id, { alignItems: e.target.value })}
                                >
                                  <MenuItem value="stretch">Stretch</MenuItem>
                                  <MenuItem value="flex-start">Start</MenuItem>
                                  <MenuItem value="center">Center</MenuItem>
                                  <MenuItem value="flex-end">End</MenuItem>
                                  <MenuItem value="baseline">Baseline</MenuItem>
                                </Select>
                              </FormControl>

                              <FormControl fullWidth>
                                <InputLabel>Flex Wrap</InputLabel>
                                <Select
                                  value={element.properties?.style?.flexWrap || 'nowrap'}
                                  onChange={(e) => updateElementStyle(element.id, { flexWrap: e.target.value })}
                                >
                                  <MenuItem value="nowrap">No Wrap</MenuItem>
                                  <MenuItem value="wrap">Wrap</MenuItem>
                                  <MenuItem value="wrap-reverse">Wrap Reverse</MenuItem>
                                </Select>
                              </FormControl>

                              <Box>
                                <Typography gutterBottom>Gap</Typography>
                                <Slider
                                  value={parseInt(element.properties?.style?.gap as string) || 0}
                                  onChange={(_, value) => updateElementStyle(element.id, { gap: `${value}px` })}
                                  min={0}
                                  max={50}
                                  valueLabelDisplay="auto"
                                />
                              </Box>
                            </>
                          )}

                          <FormControl fullWidth>
                            <InputLabel>Position</InputLabel>
                            <Select
                              value={element.properties?.style?.position || 'static'}
                              onChange={(e) => updateElementStyle(element.id, { position: e.target.value })}
                            >
                              <MenuItem value="static">Static</MenuItem>
                              <MenuItem value="relative">Relative</MenuItem>
                              <MenuItem value="absolute">Absolute</MenuItem>
                              <MenuItem value="fixed">Fixed</MenuItem>
                              <MenuItem value="sticky">Sticky</MenuItem>
                            </Select>
                          </FormControl>

                          {element.properties?.style?.position !== 'static' && (
                            <>
                              <TextField
                                fullWidth
                                label="Top"
                                value={element.properties?.style?.top || ''}
                                onChange={(e) => updateElementStyle(element.id, { top: e.target.value })}
                                placeholder="e.g., 10px, 50%, auto"
                              />
                              <TextField
                                fullWidth
                                label="Right"
                                value={element.properties?.style?.right || ''}
                                onChange={(e) => updateElementStyle(element.id, { right: e.target.value })}
                                placeholder="e.g., 10px, 50%, auto"
                              />
                              <TextField
                                fullWidth
                                label="Bottom"
                                value={element.properties?.style?.bottom || ''}
                                onChange={(e) => updateElementStyle(element.id, { bottom: e.target.value })}
                                placeholder="e.g., 10px, 50%, auto"
                              />
                              <TextField
                                fullWidth
                                label="Left"
                                value={element.properties?.style?.left || ''}
                                onChange={(e) => updateElementStyle(element.id, { left: e.target.value })}
                                placeholder="e.g., 10px, 50%, auto"
                              />
                            </>
                          )}

                          <FormControl fullWidth>
                            <InputLabel>Float</InputLabel>
                            <Select
                              value={element.properties?.style?.float || 'none'}
                              onChange={(e) => updateElementStyle(element.id, { float: e.target.value })}
                            >
                              <MenuItem value="none">None</MenuItem>
                              <MenuItem value="left">Left</MenuItem>
                              <MenuItem value="right">Right</MenuItem>
                            </Select>
                          </FormControl>

                          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                            Quick Layout Presets
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => updateElementStyle(element.id, { 
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              })}
                            >
                              Space Between
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => updateElementStyle(element.id, { 
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                              })}
                            >
                              Center All
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => updateElementStyle(element.id, { 
                                float: 'left',
                                marginRight: '20px'
                              })}
                            >
                              Float Left
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => updateElementStyle(element.id, { 
                                float: 'right',
                                marginLeft: '20px'
                              })}
                            >
                              Float Right
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => updateElementStyle(element.id, { 
                                textAlign: 'center',
                                margin: '0 auto',
                                display: 'block'
                              })}
                            >
                              Center Block
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => updateElementStyle(element.id, { 
                                width: '100%',
                                display: 'block'
                              })}
                            >
                              Full Width
                            </Button>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    {/* Spacing */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Spacing</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box>
                            <Typography gutterBottom>Margin Top</Typography>
                            <Slider
                              value={parseInt(element.properties?.style?.marginTop as string) || 0}
                              onChange={(_, value) => updateElementStyle(element.id, { marginTop: `${value}px` })}
                              min={0}
                              max={100}
                              valueLabelDisplay="auto"
                            />
                          </Box>
                          <Box>
                            <Typography gutterBottom>Margin Bottom</Typography>
                            <Slider
                              value={parseInt(element.properties?.style?.marginBottom as string) || 0}
                              onChange={(_, value) => updateElementStyle(element.id, { marginBottom: `${value}px` })}
                              min={0}
                              max={100}
                              valueLabelDisplay="auto"
                            />
                          </Box>
                          <Box>
                            <Typography gutterBottom>Margin Left</Typography>
                            <Slider
                              value={parseInt(element.properties?.style?.marginLeft as string) || 0}
                              onChange={(_, value) => updateElementStyle(element.id, { marginLeft: `${value}px` })}
                              min={0}
                              max={100}
                              valueLabelDisplay="auto"
                            />
                          </Box>
                          <Box>
                            <Typography gutterBottom>Margin Right</Typography>
                            <Slider
                              value={parseInt(element.properties?.style?.marginRight as string) || 0}
                              onChange={(_, value) => updateElementStyle(element.id, { marginRight: `${value}px` })}
                              min={0}
                              max={100}
                              valueLabelDisplay="auto"
                            />
                          </Box>
                          <Box>
                            <Typography gutterBottom>Padding</Typography>
                            <Slider
                              value={parseInt(element.properties?.style?.padding as string) || 0}
                              onChange={(_, value) => updateElementStyle(element.id, { padding: `${value}px` })}
                              min={0}
                              max={50}
                              valueLabelDisplay="auto"
                            />
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    {/* Dimensions */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Dimensions</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <TextField
                            fullWidth
                            label="Width"
                            value={element.properties?.style?.width || ''}
                            onChange={(e) => updateElementStyle(element.id, { width: e.target.value })}
                            placeholder="e.g., 100px, 50%, auto"
                          />
                          <TextField
                            fullWidth
                            label="Height"
                            value={element.properties?.style?.height || ''}
                            onChange={(e) => updateElementStyle(element.id, { height: e.target.value })}
                            placeholder="e.g., 100px, 50%, auto"
                          />
                          <TextField
                            fullWidth
                            label="Min Width"
                            value={element.properties?.style?.minWidth || ''}
                            onChange={(e) => updateElementStyle(element.id, { minWidth: e.target.value })}
                            placeholder="e.g., 100px, 50%"
                          />
                          <TextField
                            fullWidth
                            label="Max Width"
                            value={element.properties?.style?.maxWidth || ''}
                            onChange={(e) => updateElementStyle(element.id, { maxWidth: e.target.value })}
                            placeholder="e.g., 100px, 50%"
                          />
                          <TextField
                            fullWidth
                            label="Min Height"
                            value={element.properties?.style?.minHeight || ''}
                            onChange={(e) => updateElementStyle(element.id, { minHeight: e.target.value })}
                            placeholder="e.g., 100px, 50%"
                          />
                          <TextField
                            fullWidth
                            label="Max Height"
                            value={element.properties?.style?.maxHeight || ''}
                            onChange={(e) => updateElementStyle(element.id, { maxHeight: e.target.value })}
                            placeholder="e.g., 100px, 50%"
                          />
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    {/* Background & Borders */}
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1">Background & Borders</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <TextField
                            fullWidth
                            label="Background Color"
                            type="color"
                            value={element.properties?.style?.backgroundColor || '#ffffff'}
                            onChange={(e) => updateElementStyle(element.id, { backgroundColor: e.target.value })}
                          />
                          <TextField
                            fullWidth
                            label="Border Width"
                            type="number"
                            value={parseInt(element.properties?.style?.borderWidth as string) || 0}
                            onChange={(e) => updateElementStyle(element.id, { borderWidth: `${e.target.value}px`, borderStyle: 'solid' })}
                          />
                          <TextField
                            fullWidth
                            label="Border Color"
                            type="color"
                            value={element.properties?.style?.borderColor || '#000000'}
                            onChange={(e) => updateElementStyle(element.id, { borderColor: e.target.value })}
                          />
                          <Box>
                            <Typography gutterBottom>Border Radius</Typography>
                            <Slider
                              value={parseInt(element.properties?.style?.borderRadius as string) || 0}
                              onChange={(_, value) => updateElementStyle(element.id, { borderRadius: `${value}px` })}
                              min={0}
                              max={25}
                              valueLabelDisplay="auto"
                            />
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>

                    {/* Element-specific Properties */}
                    {element.type === 'signature' && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle1">Signature Properties</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={element.properties?.required || false}
                                  onChange={(e) => updateElementProperty(element.id, 'required', e.target.checked)}
                                />
                              }
                              label="Required"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={element.properties?.showDate || false}
                                  onChange={(e) => updateElementProperty(element.id, 'showDate', e.target.checked)}
                                />
                              }
                              label="Show Date Field"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={element.properties?.showTitle || false}
                                  onChange={(e) => updateElementProperty(element.id, 'showTitle', e.target.checked)}
                                />
                              }
                              label="Show Title"
                            />
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    )}

                    {/* Actions */}
                    <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          deleteElement(element.id);
                          setRightSidebarOpen(false);
                        }}
                        startIcon={<DeleteIcon />}
                      >
                        Delete Element
                      </Button>
                    </Box>
                  </>
                );
              })()}
            </Box>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <InspectIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Element Selected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {inspectMode 
                  ? "Click on any element in the canvas to inspect and edit its properties."
                  : "Enable inspect mode or click on an element to view its properties."
                }
              </Typography>
            </Box>
          )}
        </Drawer>
      </Box>

      {/* Variables Dialog */}
      <Dialog open={variablesOpen} onClose={() => setVariablesOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Insert Contract Variables</DialogTitle>
        <DialogContent>
          <List>
            {variableTypes.map((variable) => (
              <ListItem
                key={variable.key}
                onClick={() => {
                  const newElement: ContractElement = {
                    id: `element-${Date.now()}`,
                    type: 'variable',
                    content: `{{${variable.key}}}`,
                  };
                  setElements([...elements, newElement]);
                  setVariablesOpen(false);
                }}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <ListItemIcon>{variable.icon}</ListItemIcon>
                <ListItemText
                  primary={variable.label}
                  secondary={`{{${variable.key}}}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVariablesOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Contract Preview</DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 3, minHeight: '600px' }}>
            {elements.map((element) => (
              <Box key={element.id} sx={{ mb: 2 }}>
                {element.type === 'header' && (
                  <Typography variant="h4" sx={element.properties?.style}>
                    {element.content}
                  </Typography>
                )}
                {element.type === 'text' && (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {element.content}
                  </Typography>
                )}
                {element.type === 'variable' && (
                  <Typography
                    component="span"
                    sx={{
                      backgroundColor: 'primary.50',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                    }}
                  >
                    {element.content}
                  </Typography>
                )}
                {element.type === 'signature' && (
                  <Box sx={{ border: '1px solid', borderColor: 'divider', p: 3, mt: 2, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      {element.properties?.title || 'Digital Signature'}
                    </Typography>
                    <Box sx={{ height: '100px', border: '1px solid', borderColor: 'divider', mb: 2, backgroundColor: 'grey.50' }} />
                    {element.properties?.showDate && (
                      <Typography variant="body2">
                        Date: _________________
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Export PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Signature Setup Dialog */}
      <Dialog 
        open={signatureSetupOpen} 
        onClose={() => setSignatureSetupOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Signature Setup
            <IconButton onClick={() => setSignatureSetupOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Signature Title"
              value={signatureSettings.title}
              onChange={(e) => setSignatureSettings(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
            />
            
            <TextField
              label="Description"
              value={signatureSettings.description}
              onChange={(e) => setSignatureSettings(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
              multiline
              rows={2}
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={signatureSettings.required}
                  onChange={(e) => setSignatureSettings(prev => ({ ...prev, required: e.target.checked }))}
                />
              }
              label="Required Signature"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={signatureSettings.showDate}
                  onChange={(e) => setSignatureSettings(prev => ({ ...prev, showDate: e.target.checked }))}
                />
              }
              label="Show Date Field"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={signatureSettings.showTitle}
                  onChange={(e) => setSignatureSettings(prev => ({ ...prev, showTitle: e.target.checked }))}
                />
              }
              label="Show Title Above Signature"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignatureSetupOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              if (currentSignatureElement) {
                updateElement(currentSignatureElement, { 
                  properties: signatureSettings,
                  content: signatureSettings.title 
                });
              }
              setSignatureSetupOpen(false);
            }}
          >
            Apply Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Template Manager Dialog */}
      <Dialog 
        open={templateManagerOpen} 
        onClose={() => setTemplateManagerOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Contract Templates
            <IconButton onClick={() => setTemplateManagerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Load Template" />
              <Tab label="Save as Template" />
              <Tab label="Manage Templates" />
              <Tab label="Signature Setup" />
            </Tabs>
          </Box>

          {/* Load Template Tab */}
          {activeTab === 0 && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" gutterBottom>
                Choose a Template
              </Typography>
              <List>
                {templates.map((template) => (
                  <ListItem
                    key={template.id}
                    onClick={() => {
                      // Load template elements
                      setElements(template.elements);
                      setContractTitle(template.name);
                      setTemplateManagerOpen(false);
                    }}
                    sx={{ 
                      border: '1px solid', 
                      borderColor: 'divider', 
                      borderRadius: 1, 
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon>
                      <TemplateIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={template.name}
                      secondary={template.description}
                    />
                    <Button size="small" variant="outlined">
                      Load
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Save as Template Tab */}
          {activeTab === 1 && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" gutterBottom>
                Save Current Contract as Template
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Template Name"
                  fullWidth
                  placeholder="Enter template name..."
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Describe this template..."
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                />
                <Alert severity="info">
                  This will save your current contract layout as a reusable template.
                </Alert>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  onClick={() => {
                    if (templateName.trim()) {
                      handleSaveTemplate(templateName.trim(), templateDescription.trim());
                      setTemplateName('');
                      setTemplateDescription('');
                      setActiveTab(0); // Switch to Load Template tab
                    }
                  }}
                  disabled={!templateName.trim()}
                >
                  Save Template
                </Button>
              </Box>
            </Box>
          )}

          {/* Manage Templates Tab */}
          {activeTab === 2 && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" gutterBottom>
                Manage Templates
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {templates.map((template) => (
                  <Card key={template.id} variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {template.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {template.description}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  fullWidth
                  sx={{ py: 2 }}
                >
                  Create New Template
                </Button>
              </Box>
            </Box>
          )}

          {/* Signature Setup Tab */}
          {activeTab === 3 && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" gutterBottom>
                Default Signature Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Configure default settings for signature elements in your contracts.
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Default Signature Title"
                  value={signatureSettings.title}
                  onChange={(e) => setSignatureSettings(prev => ({ ...prev, title: e.target.value }))}
                  fullWidth
                />
                
                <TextField
                  label="Default Description"
                  value={signatureSettings.description}
                  onChange={(e) => setSignatureSettings(prev => ({ ...prev, description: e.target.value }))}
                  fullWidth
                  multiline
                  rows={2}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={signatureSettings.required}
                      onChange={(e) => setSignatureSettings(prev => ({ ...prev, required: e.target.checked }))}
                    />
                  }
                  label="Make signatures required by default"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={signatureSettings.showDate}
                      onChange={(e) => setSignatureSettings(prev => ({ ...prev, showDate: e.target.checked }))}
                    />
                  }
                  label="Show date field by default"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={signatureSettings.showTitle}
                      onChange={(e) => setSignatureSettings(prev => ({ ...prev, showTitle: e.target.checked }))}
                    />
                  }
                  label="Show title above signature by default"
                />

                <Alert severity="info">
                  These settings will be applied to new signature elements added to your contracts.
                </Alert>

                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  onClick={() => {
                    // You could save these settings to localStorage or backend here
                    alert('Default signature settings saved!');
                  }}
                >
                  Save Default Settings
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateManagerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      </Box>
    </DragDropContext>
  );
};

export default ContractBuilder;
