// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import {
//   Container,
//   Typography,
//   Box,
//   Button,
//   TextField,
//   Card,
//   CardContent,
//   Tabs,
//   Tab,
//   Chip,
//   IconButton,
//   CircularProgress,
// } from "@mui/material"
// import { ArrowBack, Search } from "@mui/icons-material"
// import { ImageGrid } from "../../component/AI/ImageGrid"
// import { useGalleryImages } from "../../component/AI/GalleryIntegration"
// import LoadingIndicator from "../../hooks/loadingIndicator"

// const predefinedCategories = ["People", "Animals", "Nature", "Urban", "Food", "Travel", "Sports"]

// interface TabPanelProps {
//   children?: React.ReactNode
//   index: number
//   value: number
// }

// function TabPanel(props: TabPanelProps) {
//   const { children, value, index, ...other } = props

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
//     </div>
//   )
// }

// function SmartFiltering() {
//   const navigate = useNavigate()
//   const [searchQuery, setSearchQuery] = useState("")
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
//   const [filteredImages, setFilteredImages] = useState<any[]>([])
//   const [tabValue, setTabValue] = useState(0)
//   const [isLoading, setIsLoading] = useState(false)
//   const { files, loading, getImageUrl } = useGalleryImages()
//   const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

//   useEffect(() => {
//     // Load presigned URLs for all images
//     const loadImageUrls = async () => {
//       const urls: Record<string, string> = {}

//       for (const file of files) {
//         // בדוק אם ה-downloadUrl כבר קיים
//         if (file.downloadUrl) {
//           urls[file.id] = file.downloadUrl
//         } else if (!urls[file.id]) {
//           const url = await getImageUrl({ s3Key: file.s3Key })
//           if (url) {
//             urls[file.id] = url
//           }
//         }
//       }

//       setImageUrls(urls)
//     }

//     if (files.length > 0) {
//       loadImageUrls()
//     }
//   }, [files, getImageUrl])

//   useEffect(() => {
//     // Convert files to the format expected by ImageGrid
//     const convertFilesToImageGrid = () => {
//       return files.map((file) => ({
//         id: file.id,
//         src: imageUrls[file.id] || "",
//         alt: file.fileName,
//         tags: file.fileType, // In a real app, you'd have actual tags
//       }))
//     }

//     if (Object.keys(imageUrls).length > 0) {
//       setFilteredImages(convertFilesToImageGrid())
//     }
//   }, [files, imageUrls])

//   const handleSearch = () => {
//     setIsLoading(true)

//     // Simulate AI-based filtering with a timeout
//     setTimeout(() => {
//       if (searchQuery.trim() === "") {
//         setFilteredImages(
//           files.map((file) => ({
//             id: file.id,
//             src: imageUrls[file.id] || "",
//             alt: file.fileName,
//             tags: file.fileType,
//           })),
//         )
//       } else {
//         // Simple client-side filtering - in a real app, this would call your AI service
//         const filtered = files
//           .filter((file) => file.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
//           .map((file) => ({
//             id: file.id,
//             src: imageUrls[file.id] || "",
//             alt: file.fileName,
//             tags: file.fileType,
//           }))

//         setFilteredImages(filtered)
//       }
//       setIsLoading(false)
//     }, 1000)
//   }

//   const handleCategorySelect = (category: string) => {
//     setSelectedCategory(category === selectedCategory ? null : category)
//     setIsLoading(true)

//     // Simulate AI-based category filtering with a timeout
//     setTimeout(() => {
//       if (category === selectedCategory) {
//         setFilteredImages(
//           files.map((file) => ({
//             id: file.id,
//             src: imageUrls[file.id] || "",
//             alt: file.fileName,
//             tags: file.fileType,
//           })),
//         )
//       } else {
//         // In a real app, this would call your AI service to categorize images
//         // For now, we'll just randomly filter some images
//         const filtered = files
//           .filter(() => Math.random() > 0.5) // Random filtering for demo
//           .map((file) => ({
//             id: file.id,
//             src: imageUrls[file.id] || "",
//             alt: file.fileName,
//             tags: file.fileType,
//           }))

//         setFilteredImages(filtered)
//       }
//       setIsLoading(false)
//     }, 1000)
//   }

//   const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
//     setTabValue(newValue)
//   }

//   if (loading) {
//     return (
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//           <IconButton onClick={() => navigate("/myWorkspace/aiFeatures")} sx={{ mr: 1 }}>
//             <ArrowBack />
//           </IconButton>
//           <Typography variant="h4" component="h1" fontWeight="bold">
//             Smart Filtering
//           </Typography>
//         </Box>
//         <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
//           <CircularProgress size={60} />
//         </Box>
//       </Container>
//     )
//   }

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//         <IconButton onClick={() => navigate("/myWorkspace/aiFeatures")} sx={{ mr: 1 }}>
//           <ArrowBack />
//         </IconButton>
//         <Typography variant="h4" component="h1" fontWeight="bold">
//           Smart Filtering
//         </Typography>
//       </Box>

//       <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//         <Tabs value={tabValue} onChange={handleTabChange} aria-label="filtering tabs">
//           <Tab label="Predefined Categories" />
//           <Tab label="Custom Search" />
//         </Tabs>
//       </Box>

//       <TabPanel value={tabValue} index={0}>
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
//           {predefinedCategories.map((category) => (
//             <Chip
//               key={category}
//               label={category}
//               onClick={() => handleCategorySelect(category)}
//               color={selectedCategory === category ? "primary" : "default"}
//               variant={selectedCategory === category ? "filled" : "outlined"}
//               sx={{ px: 1 }}
//             />
//           ))}
//         </Box>
//       </TabPanel>

//       <TabPanel value={tabValue} index={1}>
//         <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
//           <TextField
//             placeholder="Search for images (e.g., 'child playing in nature')"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             fullWidth
//             variant="outlined"
//             size="small"
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           />
//           <Button
//             variant="contained"
//             onClick={handleSearch}
//             startIcon={isLoading ? <LoadingIndicator/>: <Search />}
//             disabled={isLoading || !searchQuery.trim()}
//           >
//             {isLoading ? "Searching..." : "Search"}
//           </Button>
//         </Box>
//       </TabPanel>

//       <Card>
//         <CardContent>
//           <Typography variant="h6" component="h2" gutterBottom>
//             {selectedCategory
//               ? `${selectedCategory} Images`
//               : searchQuery
//                 ? `Results for "${searchQuery}"`
//                 : "All Images"}
//           </Typography>

//           {isLoading ? (
//             <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//               <CircularProgress />
//             </Box>
//           ) : (
//             <ImageGrid images={filteredImages} />
//           )}
//         </CardContent>
//       </Card>
//     </Container>
//   )
// }

// export default SmartFiltering










/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material"
import { ArrowBack, Search } from "@mui/icons-material"
import { ImageGrid } from "../../component/AI/ImageGrid"
import { useGalleryImages } from "../../component/AI/GalleryIntegration"
import LoadingIndicator from "../../hooks/loadingIndicator"

const predefinedCategories = ["People", "Animals", "Nature", "Urban", "Food", "Travel", "Sports"]

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

function SmartFiltering() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredImages, setFilteredImages] = useState<any[]>([])
  const [tabValue, setTabValue] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { files, loading, getImageUrl: originalGetImageUrl } = useGalleryImages()
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  // Memoize getImageUrl כדי למנוע יצירה מחדש בכל רינדור
  const getImageUrl = useCallback(originalGetImageUrl, []);

  useEffect(() => {
    const loadImageUrls = async () => {
      const urls: Record<string, string> = {};
      for (const file of files) {
        if (file.downloadUrl) {
          urls[file.id] = file.downloadUrl;
        } else if (!urls[file.id]) {
          const url = await getImageUrl({ s3Key: file.s3Key });
          if (url) {
            urls[file.id] = url;
          }
        }
      }
      setImageUrls(urls);
    };

    if (files.length > 0) {
      loadImageUrls();
    }
  }, [files, getImageUrl]); // getImageUrl כעת ממומאז

  useEffect(() => {
    const convertFilesToImageGrid = () => {
      return files.map((file) => ({
        id: file.id,
        src: imageUrls[file.id] || "",
        alt: file.fileName,
        tags: file.fileType,
      }));
    };

    if (Object.keys(imageUrls).length > 0) {
      // השוואה רדודה כדי למנוע עדכון אם המערך זהה
      const newFilteredImages = convertFilesToImageGrid();
      if (JSON.stringify(newFilteredImages) !== JSON.stringify(filteredImages)) {
        setFilteredImages(newFilteredImages);
      }
    }
  }, [files, imageUrls, filteredImages]); // הוספנו filteredImages כתלות - שימי לב לזה

  const handleSearch = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      let filtered;
      if (searchQuery.trim() === "") {
        filtered = files.map((file) => ({
          id: file.id,
          src: imageUrls[file.id] || "",
          alt: file.fileName,
          tags: file.fileType,
        }));
      } else {
        filtered = files
          .filter((file) => file.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((file) => ({
            id: file.id,
            src: imageUrls[file.id] || "",
            alt: file.fileName,
            tags: file.fileType,
          }));
      }
      setFilteredImages(filtered);
      setIsLoading(false);
    }, 1000);
  }, [searchQuery, files, imageUrls]); // הוספנו את התלויות החשובות

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory((prevCategory) => (category === prevCategory ? null : category));
    setIsLoading(true);
    setTimeout(() => {
      let filtered;
      if (category === selectedCategory) {
        filtered = files.map((file) => ({
          id: file.id,
          src: imageUrls[file.id] || "",
          alt: file.fileName,
          tags: file.fileType,
        }));
      } else {
        filtered = files
          .filter(() => Math.random() > 0.5) // סינון רנדומלי להדגמה
          .map((file) => ({
            id: file.id,
            src: imageUrls[file.id] || "",
            alt: file.fileName,
            tags: file.fileType,
          }));
      }
      setFilteredImages(filtered);
      setIsLoading(false);
    }, 1000);
  }, [selectedCategory, files, imageUrls]); // הוספנו את התלויות החשובות

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate("/myWorkspace/aiFeatures")} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Smart Filtering
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/myWorkspace/aiFeatures")} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Smart Filtering
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="filtering tabs">
          <Tab label="Predefined Categories" />
          <Tab label="Custom Search" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {predefinedCategories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => handleCategorySelect(category)}
              color={selectedCategory === category ? "primary" : "default"}
              variant={selectedCategory === category ? "filled" : "outlined"}
              sx={{ px: 1 }}
            />
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <TextField
            placeholder="Search for images (e.g., 'child playing in nature')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={isLoading ? <LoadingIndicator/>: <Search />}
            disabled={isLoading || !searchQuery.trim()}
          >
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </Box>
      </TabPanel>

      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            {selectedCategory
              ? `${selectedCategory} Images`
              : searchQuery
                ? `Results for "${searchQuery}"`
                : "All Images"}
          </Typography>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ImageGrid images={filteredImages} />
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default SmartFiltering;