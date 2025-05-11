"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, Image as ImageIcon, FilterList, Brush } from "@mui/icons-material"
import { Container, Typography, Grid, Card, CardContent, CardActions, Button, Box } from "@mui/material"

function AIFeaturesDashboard() {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const features = [
    {
      id: "smart-filtering",
      title: "Smart Filtering",
      description: "Filter images by categories or custom criteria",
      icon: <FilterList sx={{ fontSize: 40, mb: 1 }} />,
      path: "/myWorkspace/aiFeatures/smartFiltering",
    },
    {
      id: "image-analysis",
      title: "Image Analysis",
      description: "Analyze images to identify objects and content",
      icon: <ImageIcon sx={{ fontSize: 40, mb: 1 }} />,
      path: "/myWorkspace/aiFeatures/imageAnalysis",
    },
    {
      id: "free-search",
      title: "Free Search",
      description: "Search images using natural language descriptions",
      icon: <Search sx={{ fontSize: 40, mb: 1 }} />,
      path: "/myWorkspace/aiFeatures/freeSearch",
    },
    {
      id: "image-to-art",
      title: "Image to Art",
      description: "Transform your photos into artistic styles",
      icon: <Brush sx={{ fontSize: 40, mb: 1 }} />,
      path: "/myWorkspace/aIiFeatures/imageToArt",
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        AI Image Features
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.id}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              onHoverStart={() => setHoveredCard(feature.id)}
              onHoverEnd={() => setHoveredCard(null)}
              style={{ height: "100%" }}
            >
              <Card
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: hoveredCard === feature.id ? 3 : 1,
                }}
                onClick={() => navigate(feature.path)}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box display="flex" justifyContent="center">
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(feature.path)
                    }}
                  >
                    Select
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default AIFeaturesDashboard
