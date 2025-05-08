/* eslint-disable react-refresh/only-export-components */

import { Box, IconButton, Tooltip } from "@mui/material";
import SmartToyIcon from '@mui/icons-material/SmartToy'; 
import { useNavigate } from "react-router-dom";

export default () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/ai-features");
  };

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 40,
        left: 20,
      }}
    >
      <Tooltip title="AI Assistant" placement="top">
        <IconButton
          size="large"
          sx={{
            position: "relative",
            background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
            color: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
            '&:hover': {
              transform: "scale(1.1)",
              boxShadow: "0 6px 30px rgba(0,0,0,0.3)",
              background: "linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)"
            },
          }}
          onClick={handleClick}
        >
          <SmartToyIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
