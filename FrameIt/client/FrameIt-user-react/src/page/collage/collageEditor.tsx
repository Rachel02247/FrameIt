import React, { useState, useRef, useEffect } from 'react';
import { 
  CollageItem, 
  CollageRatio, 
  CollageSettings, 
  CollageTemplate, 
  calculateImageFit, 
  downloadCollage, 
  generateTemplateLayout, 
  getRatioSize, 
  getUniqueId 
} from './collageUtils';
import UploadZone from './uploadZone';
import RatioSelector from './ratioSelector';
import TemplateSelector from './templateSelector';
import CollageCanvas from './collageCanvas';
import ImageControls from './imageControls';
import { 
  Box, Typography, Grid, Paper, Divider, 
  Container, Button, Slider, Stack, TextField
} from '@mui/material';
import { 
  CloudDownload, Add, Settings as SettingsIcon, 
  Delete, Image as ImageIcon 
} from '@mui/icons-material';
import { toast } from 'sonner';

const CollageEditor: React.FC = () => {
  const [items, setItems] = useState<CollageItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [settings, setSettings] = useState<CollageSettings>({
    ratio: '1:1',
    template: 'grid2x2',
    backgroundColor: '#ffffff',
    spacing: 8
  });
  
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 600, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasContainerRef.current) return;
    
    const updateCanvasSize = () => {
      if (!canvasContainerRef.current) return;
      
      const containerWidth = canvasContainerRef.current.clientWidth;
      const containerHeight = window.innerHeight * 0.6;
      
      const { width, height } = getRatioSize(settings.ratio, containerWidth, containerHeight);
      setCanvasDimensions({ width, height });
    };
    
    updateCanvasSize();
    
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [settings.ratio, canvasContainerRef]);
  
  useEffect(() => {
    if (items.length === 0) return;
    
    const layout = generateTemplateLayout(
      settings.template, 
      canvasDimensions.width, 
      canvasDimensions.height,
      settings.spacing
    );
    
    if (layout.length > 0) {
      setItems(prevItems => {
        return prevItems.map((item, index) => {
          if (index < layout.length) {
            return {
              ...item,
              ...layout[index]
            };
          }
          return item;
        });
      });
      
      toast.success('Template applied');
    }
  }, [settings.template, canvasDimensions, settings.spacing]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!e.target?.result) return;
      
      const img = new Image();
      img.src = e.target.result as string;
      
      img.onload = () => {
        const layout = generateTemplateLayout(
          settings.template, 
          canvasDimensions.width, 
          canvasDimensions.height,
          settings.spacing
        );
        
        const newIndex = items.length;
        const position = newIndex < layout.length 
          ? layout[newIndex] 
          : {
              x: Math.random() * (canvasDimensions.width - 200),
              y: Math.random() * (canvasDimensions.height - 200),
              width: 200,
              height: 200,
              rotation: 0,
              scaleX: 1,
              scaleY: 1
            };
        
        const { width, height } = calculateImageFit(
          img.width, 
          img.height , 
          position.width, 
          position.height
        );
        
        const newItem: CollageItem = {
          id: getUniqueId(),
          src: e.target?.result as string,
          ...position
        };
        
        setItems(prevItems => [...prevItems, newItem]);
        setSelectedItemId(newItem.id);
      };
    };
    
    reader.readAsDataURL(file);
  };

  const handleRatioChange = (ratio: CollageRatio) => {
    setSettings(prev => ({ ...prev, ratio }));
  };

  const handleTemplateChange = (template: CollageTemplate) => {
    setSettings(prev => ({ ...prev, template }));
  };

  const handleSelectItem = (id: string | null) => {
    setSelectedItemId(id);
  };

  const handleMoveItem = (id: string, x: number, y: number) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, x, y } : item
    ));
  };

  const handleRotateClockwise = () => {
    if (!selectedItemId) return;
    
    setItems(prevItems => prevItems.map(item => 
      item.id === selectedItemId 
        ? { ...item, rotation: item.rotation + 90 } 
        : item
    ));
  };

  const handleRotateCounterClockwise = () => {
    if (!selectedItemId) return;
    
    setItems(prevItems => prevItems.map(item => 
      item.id === selectedItemId 
        ? { ...item, rotation: item.rotation - 90 } 
        : item
    ));
  };

  const handleFlipHorizontal = () => {
    if (!selectedItemId) return;
    
    setItems(prevItems => prevItems.map(item => 
      item.id === selectedItemId 
        ? { ...item, scaleX: item.scaleX * -1 } 
        : item
    ));
  };

  const handleFlipVertical = () => {
    if (!selectedItemId) return;
    
    setItems(prevItems => prevItems.map(item => 
      item.id === selectedItemId 
        ? { ...item, scaleY: item.scaleY * -1 } 
        : item
    ));
  };

  const handleMoveItemWithKeys = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedItemId) return;
    
    const selectedItem = items.find(item => item.id === selectedItemId);
    if (!selectedItem) return;
    
    const step = 10;
    let newX = selectedItem.x;
    let newY = selectedItem.y;
    
    switch (direction) {
      case 'up':
        newY -= step;
        break;
      case 'down':
        newY += step;
        break;
      case 'left':
        newX -= step;
        break;
      case 'right':
        newX += step;
        break;
    }
    
    handleMoveItem(selectedItemId, newX, newY);
  };

  const handleResizeItem = (scale: number) => {
    if (!selectedItemId) return;
    
    setItems(prevItems => prevItems.map(item => 
      item.id === selectedItemId 
        ? { ...item, scale } 
        : item
    ));
  };

  const handleDeleteItem = () => {
    if (!selectedItemId) return;
    
    setItems(prevItems => prevItems.filter(item => item.id !== selectedItemId));
    setSelectedItemId(null);
    toast.success('Image removed from collage');
  };

  const handleDownload = () => {
    if (items.length === 0) {
      toast.error('Add at least one image before downloading');
      return;
    }
    
    downloadCollage(canvasContainerRef, 'my-collage.png');
    toast.success('Collage downloaded');
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, backgroundColor: e.target.value }));
  };

  const handleSpacingChange = (event: Event, newValue: number | number[]) => {
    setSettings(prev => ({ ...prev, spacing: newValue as number }));
  };

  const handleClearAll = () => {
    if (items.length === 0) return;
    
    if (confirm('Are you sure you want to clear all images?')) {
      setItems([]);
      setSelectedItemId(null);
      toast.success('Collage cleared');
    }
  };

  const selectedItem = selectedItemId ? items.find(item => item.id === selectedItemId) || null : null;

  return (
    <Box ref={containerRef} sx={{ width: '100%', maxWidth: 1200, mx: 'auto', px: 2, py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Collage Editor
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Create beautiful collages with ease
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item sx={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>Add Images</Typography>
                <UploadZone onImageUpload={handleImageUpload} />
                <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1, display: 'block' }}>
                  {items.length} {items.length === 1 ? 'image' : 'images'} in collage
                </Typography>
              </Box>
              
              <Divider />
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SettingsIcon fontSize="small" color="action" />
                  <Typography variant="subtitle2">Collage Settings</Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <RatioSelector selectedRatio={settings.ratio} onChange={handleRatioChange} />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <TemplateSelector selectedTemplate={settings.template} onChange={handleTemplateChange} />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>Background Color</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input 
                      type="color" 
                      value={settings.backgroundColor} 
                      onChange={handleBackgroundColorChange} 
                      style={{ 
                        width: 40, 
                        height: 40, 
                        padding: 0,
                        border: '1px solid #ddd',
                        borderRadius: 4,
                        cursor: 'pointer'
                      }}
                      aria-label="Background color"
                    />
                    <Typography variant="body2">{settings.backgroundColor}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Spacing</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Slider
                      value={settings.spacing}
                      min={0}
                      max={30}
                      onChange={handleSpacingChange}
                      aria-label="Spacing"
                      valueLabelDisplay="auto"
                      sx={{ flexGrow: 1 }}
                    />
                    <Typography variant="body2" sx={{ width: 40, textAlign: 'right' }}>
                      {settings.spacing}px
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleClearAll}
                  disabled={items.length === 0}
                  size="small"
                >
                  Clear All
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CloudDownload />}
                  onClick={handleDownload}
                  disabled={items.length === 0}
                  size="small"
                >
                  Download
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
        
        <Grid item sx={{ xs: 12, md: 8 }}>
          <Stack spacing={3} height="100%">
            <Box 
              ref={canvasContainerRef} 
              sx={{ 
                mx: 'auto', 
                mb: 3, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 1,
                boxShadow: 1,
                flexGrow: 1
              }}
            >
              {items.length === 0 ? (
                <Paper 
                  variant="outlined" 
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 6,
                    textAlign: 'center',
                    borderStyle: 'dashed'
                  }}
                >
                  <ImageIcon sx={{ width: 48, height: 48, mb: 2, color: 'text.secondary' }} />
                  <Typography variant="h6" gutterBottom>No images yet</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add images to start creating your collage
                  </Typography>
                  <Button 
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                  >
                    Add Image
                  </Button>
                </Paper>
              ) : (
                <CollageCanvas
                  items={items}
                  settings={settings}
                  selectedItemId={selectedItemId}
                  onSelectItem={handleSelectItem}
                  onMoveItem={handleMoveItem}
                  canvasWidth={canvasDimensions.width}
                  canvasHeight={canvasDimensions.height}
                />
              )}
            </Box>
            
            <Paper elevation={2} sx={{ p: 3 }}>
              <ImageControls
                selectedItem={selectedItem}
                onRotateClockwise={handleRotateClockwise}
                onRotateCounterClockwise={handleRotateCounterClockwise}
                onFlipHorizontal={handleFlipHorizontal}
                onFlipVertical={handleFlipVertical}
                onMoveItem={handleMoveItemWithKeys}
                onDelete={handleDeleteItem}
                onResize={handleResizeItem}
              />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CollageEditor;
