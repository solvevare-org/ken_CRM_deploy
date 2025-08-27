import React, { useMemo } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { Reader, renderToStaticMarkup } from '@usewaypoint/email-builder';

import { useDocument } from '../documents/editor/EditorContext';
import { generateSampleData, replaceVariables, extractVariablesFromTemplate } from '../utils/variableUtils';

export default function VariablesPreviewPanel() {
  const document = useDocument();

  const htmlOutput = useMemo(() => {
    try {
      return renderToStaticMarkup(document, { rootBlockId: 'root' });
    } catch (error) {
      console.error('Error rendering email:', error);
      return '<p>Error rendering email template</p>';
    }
  }, [document]);

  const sampleData = useMemo(() => generateSampleData(), []);
  
  const previewHtml = useMemo(() => {
    return replaceVariables(htmlOutput, sampleData);
  }, [htmlOutput, sampleData]);

  const extractedVariables = useMemo(() => {
    return extractVariablesFromTemplate(htmlOutput);
  }, [htmlOutput]);

  const copyHtmlToClipboard = () => {
    navigator.clipboard.writeText(previewHtml).then(() => {
      console.log('HTML copied to clipboard');
    });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography variant="h6" gutterBottom>
          Variables Preview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Preview your email template with sample data to see how variables will be replaced.
        </Typography>
        
        {extractedVariables.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Variables found:</strong> {extractedVariables.map(v => `{{${v}}}`).join(', ')}
            </Typography>
          </Alert>
        )}
        
        <Button 
          variant="outlined" 
          size="small" 
          onClick={copyHtmlToClipboard}
          sx={{ mr: 1 }}
        >
          Copy HTML with Sample Data
        </Button>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Box 
          sx={{ 
            border: 1, 
            borderColor: 'divider', 
            borderRadius: 1,
            bgcolor: 'background.paper',
            minHeight: '100%'
          }}
        >
          <Box 
            dangerouslySetInnerHTML={{ __html: previewHtml }}
            sx={{ 
              '& table': {
                width: '100%',
                borderCollapse: 'collapse'
              },
              '& td, & th': {
                padding: '8px',
                borderBottom: '1px solid #eee'
              }
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
