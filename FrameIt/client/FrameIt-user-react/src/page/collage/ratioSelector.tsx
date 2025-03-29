import React from 'react';
import { CollageRatio } from './collageUtils';
import { ToggleButton, ToggleButtonGroup, Typography, Box } from '@mui/material';

interface RatioSelectorProps {
  selectedRatio: CollageRatio;
  onChange: (ratio: CollageRatio) => void;
}

const RatioSelector: React.FC<RatioSelectorProps> = ({ selectedRatio, onChange }) => {
  const ratios: { value: CollageRatio; label: string; icon: React.ReactNode }[] = [
    { 
      value: '1:1', 
      label: 'Square (1:1)', 
      icon: <Box sx={{ width: 24, height: 24, border: '1px solid currentColor' }} /> 
    },
    { 
      value: '3:4', 
      label: 'Portrait (3:4)', 
      icon: <Box sx={{ width: 20, height: 24, border: '1px solid currentColor' }} />
    },
    { 
      value: '16:9', 
      label: 'Widescreen (16:9)', 
      icon: <Box sx={{ width: 28, height: 16, border: '1px solid currentColor' }} />
    },
    { 
      value: 'portrait', 
      label: 'Portrait (2:3)', 
      icon: <Box sx={{ width: 16, height: 24, border: '1px solid currentColor' }} />
    },
    { 
      value: 'landscape', 
      label: 'Landscape (3:2)', 
      icon: <Box sx={{ width: 24, height: 16, border: '1px solid currentColor' }} />
    }
  ];

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newRatio: CollageRatio,
  ) => {
    if (newRatio !== null) {
      onChange(newRatio);
    }
  };

  return (
    <Box sx={{ animation: 'fade-in 0.3s ease-in-out' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Aspect Ratio</Typography>
      <ToggleButtonGroup
        value={selectedRatio}
        exclusive
        onChange={handleChange}
        aria-label="aspect ratio"
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 1
        }}
      >
        {ratios.map((ratio) => (
          <ToggleButton 
            key={ratio.value} 
            value={ratio.value}
            aria-label={ratio.label}
            title={ratio.label}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 1,
              minWidth: 0,
              height: 40
            }}
          >
            {ratio.icon}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default RatioSelector;