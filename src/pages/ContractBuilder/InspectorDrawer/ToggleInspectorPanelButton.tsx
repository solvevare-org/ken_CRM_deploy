import { IconButton, Tooltip } from '@mui/material';
import { Settings } from '@mui/icons-material';
import { useEditorContext } from '../documents/editor/EditorContext';

export default function ToggleInspectorPanelButton() {
  const { inspectorDrawerOpen, setInspectorDrawerOpen } = useEditorContext();

  return (
    <Tooltip title={inspectorDrawerOpen ? 'Hide Properties' : 'Show Properties'}>
      <IconButton
        onClick={() => setInspectorDrawerOpen(!inspectorDrawerOpen)}
        color={inspectorDrawerOpen ? 'primary' : 'default'}
      >
        <Settings />
      </IconButton>
    </Tooltip>
  );
}
