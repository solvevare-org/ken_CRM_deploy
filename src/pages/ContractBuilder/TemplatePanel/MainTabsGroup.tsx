import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useSelectedMainTab, useEditorContext } from '../documents/editor/EditorContext';

export default function MainTabsGroup() {
  const selectedMainTab = useSelectedMainTab();
  const { setSelectedMainTab } = useEditorContext();

  const handleChange = (_: unknown, value: 'design' | 'preview' | 'html' | 'json') => {
    if (value) {
      setSelectedMainTab(value);
    }
  };

  return (
    <ToggleButtonGroup
      value={selectedMainTab}
      exclusive
      onChange={handleChange}
      size="small"
    >
      <ToggleButton value="design">Design</ToggleButton>
      <ToggleButton value="preview">Preview</ToggleButton>
      <ToggleButton value="html">HTML</ToggleButton>
      <ToggleButton value="json">JSON</ToggleButton>
    </ToggleButtonGroup>
  );
}
