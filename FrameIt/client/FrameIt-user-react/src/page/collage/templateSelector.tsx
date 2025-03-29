import React from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, tooltipClasses, Paper, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  GridView, ViewAgenda, ViewColumn, 
  TableRows, ViewComfy, Dashboard
} from '@mui/icons-material';
import { CollageTemplate } from './collageUtils';

// Enhanced tooltip for template preview
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TemplateTooltip = styled(({ className, title, placement, children }: any) => (
  <Tooltip title={title} placement={placement} classes={{ popper: className }}>
    {children}
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[3],
    fontSize: 13,
    border: `1px solid ${theme.palette.divider}`,
    padding: 8,
    maxWidth: 'none',
  },
}));

interface TemplateSelectorProps {
  selectedTemplate: CollageTemplate;
  onChange: (template: CollageTemplate) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onChange }) => {
  const handleChange = (event: React.MouseEvent<HTMLElement>, newTemplate: CollageTemplate) => {
    if (newTemplate !== null) {
      onChange(newTemplate);
    }
  };

  // Template preview components for tooltips
  const templatePreviews = {
    grid2x2: (
      <Paper sx={{ width: 100, height: 100, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 1, p: 1 }}>
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
      </Paper>
    ),
    grid3x3: (
      <Paper sx={{ width: 100, height: 100, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: 0.5, p: 1 }}>
        {[...Array(9)].map((_, index) => (
          <Box key={index} sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
        ))}
      </Paper>
    ),
    splitHorizontal: (
      <Paper sx={{ width: 100, height: 100, display: 'grid', gridTemplateRows: '1fr 1fr', gap: 1, p: 1 }}>
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
      </Paper>
    ),
    splitVertical: (
      <Paper sx={{ width: 100, height: 100, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, p: 1 }}>
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
      </Paper>
    ),
    threeTopOne: (
      <Paper sx={{ width: 100, height: 100, display: 'grid', gridTemplateRows: '2fr 1fr', gap: 1, p: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
          <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
          <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
          <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
        </Box>
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
      </Paper>
    ),
    oneTopThree: (
      <Paper sx={{ width: 100, height: 100, display: 'grid', gridTemplateRows: '1fr 2fr', gap: 1, p: 1 }}>
        <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1 }}>
          <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
          <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
          <Box sx={{ bgcolor: 'primary.main', borderRadius: 1 }} />
        </Box>
      </Paper>
    ),
    custom: (
      <Paper sx={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
        <Typography variant="caption">Custom</Typography>
      </Paper>
    ),
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>Template</Typography>
      <ToggleButtonGroup
        value={selectedTemplate}
        exclusive
        onChange={handleChange}
        aria-label="collage template"
        size="small"
        fullWidth
        sx={{ mb: 1 }}
      >
        <TemplateTooltip title={templatePreviews.grid2x2} placement="top">
          <ToggleButton value="grid2x2" aria-label="2x2 Grid">
            <GridView />
          </ToggleButton>
        </TemplateTooltip>
        
        <TemplateTooltip title={templatePreviews.grid3x3} placement="top">
          <ToggleButton value="grid3x3" aria-label="3x3 Grid">
            <ViewComfy />
          </ToggleButton>
        </TemplateTooltip>
        
        <TemplateTooltip title={templatePreviews.splitHorizontal} placement="top">
          <ToggleButton value="splitHorizontal" aria-label="Split Horizontal">
            <ViewAgenda />
          </ToggleButton>
        </TemplateTooltip>
        
        <TemplateTooltip title={templatePreviews.splitVertical} placement="top">
          <ToggleButton value="splitVertical" aria-label="Split Vertical">
            <ViewColumn />
          </ToggleButton>
        </TemplateTooltip>
      </ToggleButtonGroup>
      
      <ToggleButtonGroup
        value={selectedTemplate}
        exclusive
        onChange={handleChange}
        aria-label="more templates"
        size="small"
        fullWidth
      >
        <TemplateTooltip title={templatePreviews.threeTopOne} placement="bottom">
          <ToggleButton value="threeTopOne" aria-label="Three Top One Bottom">
            <TableRows sx={{ transform: 'rotate(180deg)' }} />
          </ToggleButton>
        </TemplateTooltip>
        
        <TemplateTooltip title={templatePreviews.oneTopThree} placement="bottom">
          <ToggleButton value="oneTopThree" aria-label="One Top Three Bottom">
            <TableRows />
          </ToggleButton>
        </TemplateTooltip>
        
        <TemplateTooltip title={templatePreviews.custom} placement="bottom">
          <ToggleButton value="custom" aria-label="Custom">
            <Dashboard />
          </ToggleButton>
        </TemplateTooltip>
      </ToggleButtonGroup>
    </Box>
  );
};

export default TemplateSelector;