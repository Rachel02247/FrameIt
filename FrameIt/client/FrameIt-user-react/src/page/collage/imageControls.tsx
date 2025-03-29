
import React from 'react';
import { 
  Box, Typography, Grid, Button, Paper, 
  IconButton, Tooltip, Divider, Slider
} from '@mui/material';
import { 
  RotateLeft, RotateRight, Flip,
  ArrowUpward, ArrowDownward, ArrowBack, ArrowForward,
  Delete, ZoomIn, ZoomOut
} from '@mui/icons-material';
import { CollageItem } from './collageUtils';

interface ImageControlsProps {
  selectedItem: CollageItem | null;
  onRotateClockwise: () => void;
  onRotateCounterClockwise: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onMoveItem: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onDelete: () => void;
  onResize: (scale: number) => void;
}

const ImageControls: React.FC<ImageControlsProps> = ({
  selectedItem,
  onRotateClockwise,
  onRotateCounterClockwise,
  onFlipHorizontal,
  onFlipVertical,
  onMoveItem,
  onDelete,
  onResize
}) => {
  if (!selectedItem) {
    return (
      <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Select an image to edit
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom mb={2}>
        Image Controls
      </Typography>
      <Grid container spacing={2}>
        <Grid sx={{ item: true, xs: 12, p: 2}}>
          <Typography variant="body2" gutterBottom>
            Rotation
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Rotate Counter-clockwise">
              <IconButton 
                onClick={onRotateCounterClockwise}
                size="small"
                color="primary"
              >
                <RotateLeft />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rotate Clockwise">
              <IconButton 
                onClick={onRotateClockwise}
                size="small"
                color="primary"
              >
                <RotateRight />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
        
        <Grid sx={{ item: true, xs: 12, p: 2 }}>
          <Typography variant="body2" gutterBottom>
            Flip
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Flip Horizontal">
              <IconButton 
                onClick={onFlipHorizontal}
                size="small"
                color="primary"
              >
                <Flip sx={{ transform: 'rotate(90deg)' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Flip Vertical">
              <IconButton 
                onClick={onFlipVertical}
                size="small"
                color="primary"
              >
                <Flip />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
        
        <Grid sx={{ item: true, xs: 12, p: 2 }}>
          <Typography variant="body2" gutterBottom>
            Size
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ZoomOut fontSize="inherit" color="action" />
              <Slider
                min={0.1}
                max={2}
                step={0.1}
                defaultValue={1}
                value={selectedItem.scale || 1}
                onChange={(_, value) => onResize(value as number)}
                aria-labelledby="image-resize-slider"
                sx={{ flexGrow: 1 }}
              />
              <ZoomIn fontSize="small" color="action" />
            </Box>
            <Typography variant="caption" color="text.secondary" align="center">
              {`Size: ${Math.round((selectedItem.scale || 1) * 100)}%`}
            </Typography>
          </Box>
        </Grid>
        
        <Grid sx={{ item: true, xs: 12, p: 2 }}>
          <Divider sx={{ my: 1 }} />
        </Grid>
        
        <Grid sx={{ item: true, xs: 12 }}>
          <Typography variant="body2" gutterBottom>
            Position
          </Typography>
          <Grid container spacing={1} sx={{ mb: 1 }}>
            <Grid sx={{ item: true, xs: 12, textAlign: 'center' }}>
              <Tooltip title="Move Up">
                <IconButton 
                  onClick={() => {onMoveItem('up')}}
                  size="small"
                >
                  <ArrowUpward fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid sx={{ item: true, xs: 4, textAlign: 'right' }}>
              <Tooltip title="Move Left">
                <IconButton 
                  onClick={() => onMoveItem('left')}
                  size="small"
                >
                  <ArrowBack fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid sx={{ item: true, xs: 4 }}>
              {/* Spacer */}
            </Grid>
            <Grid sx={{ item: true, xs: 4, textAlign: 'left' }}>
              <Tooltip title="Move Right">
                <IconButton 
                  onClick={() => onMoveItem('right')}
                  size="small"
                >
                  <ArrowForward fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid sx={{ item: true, xs: 12, textAlign: 'center' }}>
              <Tooltip title="Move Down">
                <IconButton 
                  onClick={() => onMoveItem('down')}
                  size="small"
                >
                  <ArrowDownward fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid sx={{ item: true, xs: 12, p: 2 }}>
          <Divider sx={{ my: 1 }} />
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<Delete />}
            onClick={onDelete}
            size="small"
            fullWidth
            sx={{ mt: 1 }}
          >
            Remove Image
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageControls;
