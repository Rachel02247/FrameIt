/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { Grid, Typography, Paper, Container } from "@mui/material";
import { motion } from "framer-motion";
import { Cloud, Collections, Dashboard, Sort, Share } from "@mui/icons-material";
import { useLanguage } from "../../context/LanguageContext";
import "./style.css";

export default () => {
  const { language } = useLanguage();
  const translations = {
    en: {
      title: "All in one",
      features: [
        {
          title: "Easy Cloud Storage",
          description: "Store your photos securely in the cloud with effortless upload and access.",
          icon: <Cloud sx={{ fontSize: 40 }} color="primary" />,
        },
        {
          title: "Create My Collections",
          description: "Organize your photos into personalized collections for easy management.",
          icon: <Collections sx={{ fontSize: 40 }} color="primary" />,
        },
        {
          title: "AI Smart Filtering",
          description: "Use AI-powered filters to find the perfect photo in seconds.",
          icon: <Sort sx={{ fontSize: 40 }} color="primary" />,
        },
        {
          title: "Design Collages",
          description: "Create beautiful collages from your favorite photos, effortlessly.",
          icon: <Dashboard sx={{ fontSize: 40 }} color="primary" />,
        },
        {
          title: "Easy Sharing & Download",
          description: "Share your photos or download them with a single click.",
          icon: <Share sx={{ fontSize: 40 }} color="primary" />,
        },
      ],
    },
    he: {
      title: "הכל במקום אחד",
      features: [
        {
          title: "אחסון ענן קל",
          description: "שמור את התמונות שלך בענן בצורה מאובטחת עם העלאה וגישה קלה.",
          icon: <Cloud sx={{ fontSize: 40 }} color="primary" />,
        },
        {
          title: "צור את האוספים שלי",
          description: "ארגן את התמונות שלך לאוספים מותאמים אישית לניהול קל.",
          icon: <Collections sx={{ fontSize: 40 }} color="primary" />,
        },
        {
          title: "סינון חכם מבוסס AI",
          description: "השתמש במסננים מבוססי AI כדי למצוא את התמונה המושלמת בשניות.",
          icon: <Sort sx={{ fontSize: 40 }} color="primary" />,
        },
        {
          title: "עיצוב קולאז'ים",
          description: "צור קולאז'ים יפים מהתמונות האהובות עליך, בקלות.",
          icon: <Dashboard sx={{ fontSize: 40 }} color="primary" />,
        },
        {
          title: "שיתוף והורדה קלים",
          description: "שתף את התמונות שלך או הורד אותן בלחיצה אחת.",
          icon: <Share sx={{ fontSize: 40 }} color="primary" />,
        },
      ],
    },
  };

  const t = translations[language];

  return (
    <Paper id="features" sx={{ padding: "50px 20px", mt: 12 }}>
      <Container>
        <Typography variant="h3" align="center" color="primary" sx={{ marginBottom: 5 }}>
          {t.title}
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {t.features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <Paper elevation={3} sx={{ padding: 4, textAlign: "center", borderRadius: "8px" }}>
                  {feature.icon}
                  <Typography variant="h5" color="secondary" sx={{ marginTop: 2, marginBottom: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Paper>
  );
};
