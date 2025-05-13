import React from "react";
import { IconButton, Typography } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";

const LanguageToggle: React.FC = () => {

  const { language, toggleLanguage } = useLanguage();

  const isSidebarVisible = window.location.pathname.startsWith("/myWorkspace") || window.location.pathname === "/login" || window.location.pathname === "/register";

  return (

    <>
      {!isSidebarVisible &&
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            top: 30,
            [language === "he" ? "right" : "left"]: 190,
          }}
        >
          <IconButton
            onClick={toggleLanguage}
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: "999px",
              px: 1,
              py: 0.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
              zIndex: 0,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <TranslateIcon fontSize="small" />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {language === "en" ? "EN" : "HE"}
            </Typography>
          </IconButton>
        </motion.div>
      }</>
  );
};

export default LanguageToggle;
