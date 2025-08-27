import React from 'react';
import { MonitorOutlined, PhoneIphoneOutlined } from '@mui/icons-material';
import { Box, Stack, SxProps, ToggleButton, ToggleButtonGroup, Tooltip, useTheme } from '@mui/material';
import { Reader } from '@usewaypoint/email-builder';
import EditorBlock from '../documents/editor/EditorBlock';
import {
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
  useEditorContext,
} from '../documents/editor/EditorContext';
import ToggleInspectorPanelButton from '../InspectorDrawer/ToggleInspectorPanelButton';
import ToggleSamplesPanelButton from '../SamplesDrawer/ToggleSamplesPanelButton';
import MainTabsGroup from './MainTabsGroup';

export default function TemplatePanel() {
  const theme = useTheme();
  const document = useDocument();
  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();
  const { setSelectedScreenSize } = useEditorContext();

  let mainBoxSx: SxProps = {
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  };

  if (selectedScreenSize === 'mobile') {
    mainBoxSx = {
      ...mainBoxSx,
      margin: '32px auto',
      width: 370,
      height: 800,
      boxShadow:
        'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px',
    };
  }

  const handleScreenSizeChange = (_: unknown, value: unknown) => {
    switch (value) {
      case 'mobile':
      case 'desktop':
        setSelectedScreenSize(value);
        break;
      default:
        break;
    }
  };

  const renderContent = () => {
    switch (selectedMainTab) {
      case 'design':
        return (
          <Box
            sx={mainBoxSx}
            onDrop={(e) => {
              e.preventDefault();
              const data = JSON.parse(e.dataTransfer.getData('application/json'));
              console.log('Dropped element:', data);
              // Here you would add the element to the document
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
          >
            <EditorBlock />
          </Box>
        );
      case 'preview':
        return (
          <Box sx={mainBoxSx}>
            <Reader document={document} rootBlockId="root" />
          </Box>
        );
      case 'html':
        return (
          <Box sx={{ p: 2, fontFamily: 'monospace', backgroundColor: '#f5f5f5', height: '100%', overflow: 'auto' }}>
            <pre>{JSON.stringify(document, null, 2)}</pre>
          </Box>
        );
      case 'json':
        return (
          <Box sx={{ p: 2, fontFamily: 'monospace', backgroundColor: '#f5f5f5', height: '100%', overflow: 'auto' }}>
            <pre>{JSON.stringify(document, null, 2)}</pre>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Stack sx={{ height: '100vh' }}>
      {/* Header Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ToggleSamplesPanelButton />
          <MainTabsGroup />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Screen Size Selector */}
          <ToggleButtonGroup
            value={selectedScreenSize}
            exclusive
            onChange={handleScreenSizeChange}
            size="small"
          >
            <ToggleButton value="desktop">
              <Tooltip title="Desktop View">
                <MonitorOutlined />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="mobile">
              <Tooltip title="Mobile View">
                <PhoneIphoneOutlined />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleInspectorPanelButton />
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: 'grey.50' }}>
        {renderContent()}
      </Box>
    </Stack>
  );
}
