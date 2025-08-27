import React from 'react';
import { Stack, useTheme } from '@mui/material';
import { useInspectorDrawerOpen, useSamplesDrawerOpen } from './documents/editor/EditorContext';
import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './InspectorDrawer';
import SamplesDrawer, { SAMPLES_DRAWER_WIDTH } from './SamplesDrawer';
import TemplatePanel from './TemplatePanel';
import EditorProvider from './documents/editor/EditorContext';

function useDrawerTransition(cssProperty: 'margin-left' | 'margin-right', open: boolean) {
  const { transitions } = useTheme();
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open ? transitions.duration.leavingScreen : transitions.duration.enteringScreen,
  });
}

function ContractBuilderContent() {
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const samplesDrawerOpen = useSamplesDrawerOpen();

  const marginLeftTransition = useDrawerTransition('margin-left', samplesDrawerOpen);
  const marginRightTransition = useDrawerTransition('margin-right', inspectorDrawerOpen);

  return (
    <>
      <InspectorDrawer />
      <SamplesDrawer />
  
      <Stack
        sx={{
          height: '100vh',
          width: '100vw',
          marginLeft: samplesDrawerOpen ? `${SAMPLES_DRAWER_WIDTH}px` : 0,
          marginRight: inspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
          transition: `${marginLeftTransition}, ${marginRightTransition}`,
          overflow: 'hidden',
          backgroundColor: 'background.default',
        }}
      >
        <TemplatePanel />
      </Stack>
    </>
  );
}

export default function ContractBuilder() {
  return (
    <EditorProvider>
      <ContractBuilderContent />
    </EditorProvider>
  );
}
