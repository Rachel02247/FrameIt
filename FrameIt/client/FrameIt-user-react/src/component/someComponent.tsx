import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// ...existing code...

function SomeComponent() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper, // Use theme background
        padding: 2,
        borderRadius: 1,
      }}
    >
      {/* ...existing code... */}
    </Box>
  );
}

export default SomeComponent;