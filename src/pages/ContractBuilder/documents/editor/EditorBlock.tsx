import { Reader } from '@usewaypoint/email-builder';
import { useDocument } from './EditorContext';

export default function EditorBlock() {
  const document = useDocument();

  return (
    <Reader
      document={document}
      rootBlockId="root"
    />
  );
}
