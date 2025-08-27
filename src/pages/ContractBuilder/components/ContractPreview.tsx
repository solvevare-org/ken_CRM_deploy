import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Chip,
} from '@mui/material';
import {
  Print as PrintIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { replaceVariables } from '../utils/variableUtils';

interface ContractPreviewProps {
  content: string;
  variables?: Record<string, any>;
  title?: string;
  onClose?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  showHeader?: boolean;
  readonly?: boolean;
}

const ContractPreview: React.FC<ContractPreviewProps> = ({
  content,
  variables = {},
  title = 'Contract Preview',
  onClose,
  onPrint,
  onDownload,
  onShare,
  showHeader = true,
}) => {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Replace variables in content
  const processedContent = replaceVariables(content, variables);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleFullscreen = () => {
    if (!isFullscreen && previewRef.current) {
      previewRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Default print behavior
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                body {
                  font-family: 'Times New Roman', serif;
                  line-height: 1.6;
                  margin: 1in;
                  color: #000;
                }
                .contract-content {
                  max-width: none;
                  margin: 0;
                  padding: 0;
                }
                @media print {
                  body { margin: 0.5in; }
                }
              </style>
            </head>
            <body>
              <div class="contract-content">
                ${processedContent}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download as HTML
      const blob = new Blob([processedContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Box
      ref={previewRef}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'grey.50',
      }}
    >
      {/* Header */}
      {showHeader && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            <Chip
              label={`${zoom}%`}
              size="small"
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Zoom Controls */}
            <Tooltip title="Zoom Out">
              <IconButton
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                size="small"
              >
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Zoom In">
              <IconButton
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                size="small"
              >
                <ZoomInIcon />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            {/* Action Buttons */}
            <Tooltip title="Print">
              <IconButton onClick={handlePrint} size="small">
                <PrintIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Download">
              <IconButton onClick={handleDownload} size="small">
                <DownloadIcon />
              </IconButton>
            </Tooltip>

            {onShare && (
              <Tooltip title="Share">
                <IconButton onClick={onShare} size="small">
                  <ShareIcon />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Fullscreen">
              <IconButton onClick={handleFullscreen} size="small">
                <FullscreenIcon />
              </IconButton>
            </Tooltip>

            {onClose && (
              <>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Tooltip title="Close">
                  <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Paper>
      )}

      {/* Preview Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '8.5in',
            minHeight: '11in',
            p: '1in',
            backgroundColor: 'white',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              fontFamily: '"Times New Roman", serif',
              fontSize: '12pt',
              lineHeight: 1.6,
              color: 'black',
              '& h1, & h2, & h3, & h4, & h5, & h6': {
                fontFamily: '"Times New Roman", serif',
                fontWeight: 'bold',
                marginTop: '1em',
                marginBottom: '0.5em',
              },
              '& h1': { fontSize: '18pt' },
              '& h2': { fontSize: '16pt' },
              '& h3': { fontSize: '14pt' },
              '& p': {
                marginBottom: '1em',
                textAlign: 'justify',
              },
              '& ul, & ol': {
                marginBottom: '1em',
                paddingLeft: '1.5em',
              },
              '& li': {
                marginBottom: '0.25em',
              },
              '& .signature-line': {
                borderBottom: '1px solid black',
                minHeight: '1.5em',
                marginBottom: '0.5em',
                display: 'inline-block',
                minWidth: '200px',
              },
              '& .date-line': {
                borderBottom: '1px solid black',
                minHeight: '1.5em',
                marginBottom: '0.5em',
                display: 'inline-block',
                minWidth: '100px',
              },
            }}
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ContractPreview;
