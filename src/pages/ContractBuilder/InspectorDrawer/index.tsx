import { Drawer, IconButton, Tooltip } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { useInspectorDrawerOpen, useEditorContext } from '../documents/editor/EditorContext';

export const INSPECTOR_DRAWER_WIDTH = 320;

export default function InspectorDrawer() {
  const open = useInspectorDrawerOpen();
  const { setInspectorDrawerOpen } = useEditorContext();

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      sx={{
        width: INSPECTOR_DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: INSPECTOR_DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderLeft: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Properties</h3>
          <Tooltip title="Close Properties Panel">
            <IconButton onClick={() => setInspectorDrawerOpen(false)} size="small">
              <ChevronRight />
            </IconButton>
          </Tooltip>
        </div>
        
        <div>
          <p>Select an element to edit its properties</p>
          {/* This would contain the actual property editing interface */}
        </div>
      </div>
    </Drawer>
  );
}
