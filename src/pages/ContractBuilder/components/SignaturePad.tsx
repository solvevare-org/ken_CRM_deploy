import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Save as SaveIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
} from '@mui/icons-material';

interface SignaturePadProps {
  onSignatureChange: (signature: string | null) => void;
  title?: string;
  required?: boolean;
  placeholder?: string;
  width?: number;
  height?: number;
  disabled?: boolean;
  initialSignature?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  onSignatureChange,
  title = 'Digital Signature',
  required = false,
  placeholder = 'Sign here',
  width = 400,
  height = 200,
  disabled = false,
  initialSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [useTouch, setUseTouch] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set drawing styles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load initial signature if provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHasSignature(true);
        saveToHistory();
      };
      img.src = initialSignature;
    } else {
      // Clear canvas and add placeholder
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPlaceholder();
    }

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [width, height, initialSignature]);

  const drawPlaceholder = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.fillStyle = '#cccccc';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(placeholder, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(dataURL);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const getEventPos = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (disabled) return;
    startDrawing(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (disabled) return;
    draw(e);
  };

  const handleMouseUp = () => {
    if (disabled) return;
    stopDrawing();
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    startDrawing(e);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    draw(e);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    stopDrawing();
  };

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    
    // Clear placeholder if this is the first draw
    if (!hasSignature) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(true);
    }

    const pos = getEventPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getEventPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    saveToHistory();
    
    // Notify parent of signature change
    const canvas = canvasRef.current;
    if (canvas) {
      const signature = canvas.toDataURL();
      onSignatureChange(signature);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlaceholder();
    setHasSignature(false);
    onSignatureChange(null);
    
    // Clear history
    setHistory([]);
    setHistoryIndex(-1);
  };

  const undo = () => {
    if (historyIndex <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);

    if (newIndex >= 0) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const signature = canvas.toDataURL();
        onSignatureChange(signature);
      };
      img.src = history[newIndex];
    } else {
      clearSignature();
    }
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const signature = canvas.toDataURL();
      onSignatureChange(signature);
    };
    img.src = history[newIndex];
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const signature = canvas.toDataURL();
    
    // Create download link
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = signature;
    link.click();
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={600}>
          {title}
          {required && (
            <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={useTouch}
              onChange={(e) => setUseTouch(e.target.checked)}
              size="small"
            />
          }
          label="Touch Mode"
          sx={{ m: 0 }}
        />
      </Box>

      {required && !hasSignature && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This signature is required to complete the contract.
        </Alert>
      )}

      <Box
        sx={{
          border: '2px dashed',
          borderColor: disabled ? 'grey.300' : 'grey.400',
          borderRadius: 1,
          p: 1,
          backgroundColor: disabled ? 'grey.50' : 'white',
          position: 'relative',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            cursor: disabled ? 'not-allowed' : (useTouch ? 'crosshair' : 'crosshair'),
            touchAction: 'none',
          }}
        />
        
        {disabled && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Signature Disabled
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Clear Signature">
          <IconButton
            onClick={clearSignature}
            disabled={disabled || !hasSignature}
            size="small"
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Undo">
          <IconButton
            onClick={undo}
            disabled={disabled || historyIndex <= 0}
            size="small"
          >
            <UndoIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Redo">
          <IconButton
            onClick={redo}
            disabled={disabled || historyIndex >= history.length - 1}
            size="small"
          >
            <RedoIcon />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Button
          startIcon={<SaveIcon />}
          onClick={saveSignature}
          disabled={disabled || !hasSignature}
          size="small"
          variant="outlined"
        >
          Save
        </Button>
      </Box>
    </Paper>
  );
};

export default SignaturePad;
