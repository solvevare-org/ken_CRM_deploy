import { IconButton, Tooltip } from '@mui/material';
import { ViewModule } from '@mui/icons-material';
import { useEditorContext } from '../documents/editor/EditorContext';

export default function ToggleSamplesPanelButton() {
  const { samplesDrawerOpen, setSamplesDrawerOpen } = useEditorContext();

  return (
    <Tooltip title={samplesDrawerOpen ? 'Hide Elements' : 'Show Elements'}>
      <IconButton
        onClick={() => setSamplesDrawerOpen(!samplesDrawerOpen)}
        color={samplesDrawerOpen ? 'primary' : 'default'}
      >
        <ViewModule />
      </IconButton>
    </Tooltip>
  );
}
