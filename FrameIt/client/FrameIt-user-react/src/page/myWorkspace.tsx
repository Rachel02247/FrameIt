import React from "react";
import { Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { CloudUpload, Collections, Filter, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const MyWorkspace: React.FC = () => {
  const userName = sessionStorage.getItem("name");
  const { language } = useLanguage();

  const translations = {
    en: {
      welcome: "Welcome to Your Workspace",
      subtitle: "Here you can upload images, create collages, use AI filtering, and manage your collections.",
      uploadImages: "Upload Images",
      upload: "Upload",
      createCollage: "Create Collage",
      create: "Create",
      aiFiltering: "AI    Filtering",
      apply: "Apply",
      myCollections: "My Collections",
      manage: "Manage",
    },
    he: {
      welcome: "ברוך הבא לאזור העבודה שלך",
      subtitle: "כאן תוכל להעלות תמונות, ליצור קולאז'ים, להשתמש בסינון AI ולנהל את האוספים שלך.",
      uploadImages: "העלה תמונות",
      upload: "העלה",
      createCollage: "צור קולאז'",
      create: "צור",
      aiFiltering: "סינון AI",
      apply: "החל",
      myCollections: "האוספים שלי",
      manage: "נהל",
    },
  };

  const t = translations[language];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, direction: language === "he" ? "rtl" : "ltr" }}>
      <Typography variant="h2" color="primary" fontWeight={800} gutterBottom>
        {language === "he" ? `שלום ${userName ?? ""}` : `Hi ${userName ?? ""}`}
      </Typography>
      <Typography variant="h3" gutterBottom>
        {t.welcome}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {t.subtitle}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <CloudUpload fontSize="large" />
              <Typography variant="h6">{t.uploadImages}</Typography>
              <Button
                component={Link}
                to="/myWorkspace/upload"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                {t.upload}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Edit fontSize="large" />
              <Typography variant="h6">{t.createCollage}</Typography>
              <Button
                component={Link}
                to="/myWorkspace/design"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
              >
                {t.create}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Filter fontSize="large" />
              <Typography variant="h6">{t.aiFiltering}</Typography>
              <Button
                component={Link}
                to="/myWorkspace/AiFeuteres"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                {t.apply}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Collections fontSize="large" />
              <Typography variant="h6">{t.myCollections}</Typography>
              <Button
                component={Link}
                to="/myWorkspace/collections"
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ mt: 2 }}
              >
                {t.manage}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MyWorkspace;
