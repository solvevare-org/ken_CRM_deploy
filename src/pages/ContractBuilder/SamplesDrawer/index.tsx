import { 
  Drawer, 
  IconButton, 
  Tooltip, 
  Box, 
  Typography, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  ChevronLeft,
  TextFields,
  Title,
  FormatListBulleted,
  TableChart,
  Image,
  Create,
  DateRange,
  AttachMoney,
  Home,
  Person,
  Business,
} from '@mui/icons-material';
import { useSamplesDrawerOpen, useEditorContext } from '../documents/editor/EditorContext';

export const SAMPLES_DRAWER_WIDTH = 280;

const contractElements = [
  {
    category: 'Text Elements',
    items: [
      { icon: <Title />, label: 'Heading', type: 'heading' },
      { icon: <TextFields />, label: 'Paragraph', type: 'text' },
      { icon: <FormatListBulleted />, label: 'List', type: 'list' },
    ]
  },
  {
    category: 'Contract Sections',
    items: [
      { icon: <Person />, label: 'Party Information', type: 'party-info' },
      { icon: <Home />, label: 'Property Details', type: 'property' },
      { icon: <AttachMoney />, label: 'Financial Terms', type: 'financial' },
      { icon: <DateRange />, label: 'Important Dates', type: 'dates' },
      { icon: <Business />, label: 'Agent Information', type: 'agent' },
    ]
  },
  {
    category: 'Interactive Elements',
    items: [
      { icon: <Create />, label: 'Signature Block', type: 'signature' },
      { icon: <DateRange />, label: 'Date Field', type: 'date-field' },
      { icon: <TextFields />, label: 'Text Input', type: 'input' },
      { icon: <TableChart />, label: 'Table', type: 'table' },
    ]
  },
  {
    category: 'Media',
    items: [
      { icon: <Image />, label: 'Image', type: 'image' },
      { icon: <TableChart />, label: 'Spacer', type: 'spacer' },
    ]
  }
];

export default function SamplesDrawer() {
  const open = useSamplesDrawerOpen();
  const { setSamplesDrawerOpen } = useEditorContext();

  const handleElementDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type: elementType }));
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: SAMPLES_DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SAMPLES_DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Contract Elements
          </Typography>
          <Tooltip title="Close Elements Panel">
            <IconButton onClick={() => setSamplesDrawerOpen(false)} size="small">
              <ChevronLeft />
            </IconButton>
          </Tooltip>
        </Box>

        {contractElements.map((category, index) => (
          <Box key={category.category} sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>
              {category.category}
            </Typography>
            
            <List dense sx={{ p: 0 }}>
              {category.items.map((item) => (
                <ListItem
                  key={item.type}
                  draggable
                  onDragStart={(e) => handleElementDragStart(e, item.type)}
                  sx={{
                    p: 1,
                    mb: 0.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    cursor: 'grab',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderColor: 'primary.main',
                    },
                    '&:active': {
                      cursor: 'grabbing',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              ))}
            </List>
            
            {index < contractElements.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}

        <Box sx={{ mt: 4, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            💡 Tip: Drag elements from here into your contract to build it visually!
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
