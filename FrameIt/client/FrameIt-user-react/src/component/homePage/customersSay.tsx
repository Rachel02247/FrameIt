// TestimonialSection.tsx
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, Avatar, useTheme, Divider } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Sarah L.",
    quote: "FramelT changed the way I organize my memories. The AI features are just magical!",
  },
  {
    name: "Jonathan R.",
    quote: "Creating collages and managing albums has never been this easy or fun!",
  },
  {
    name: "Emily W.",
    quote: "I love how FramelT feels personal. It’s not just storage – it’s storytelling.",
  },
];

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);
  const theme = useTheme();  // גישה ל-theme

  const changeTestimonial = (newIndex: number) => setIndex(newIndex);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[index];
  const initials = testimonial.name.split(" ").map((word) => word[0]).join("");  // יצירת רישיות

  return (
    <section
      className="w-full py-16"
      style={{
        backgroundColor: theme.palette.background.default, // רקע כהה יותר מה-theme
      }}
    >
      <Box mb={4}>
        <Divider sx={{ backgroundColor: theme.palette.divider, height: 2 }} /> {/* חוצץ למעלה */}
      </Box>
      
      <div className="text-center mb-10">
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          What Customers Say
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={2}>
          Real stories. Real connections.
        </Typography>
      </div>

      <Box display="flex" justifyContent="center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ maxWidth: 345, p: 4, boxShadow: 3, borderRadius: 2, textAlign: "center" }}>
              <Avatar sx={{ width: 64, height: 64, marginBottom: 2, backgroundColor: theme.palette.primary.main }}>
                {initials}
              </Avatar>
              <CardContent>
                <Typography variant="h6" component="p" sx={{ fontStyle: "italic", color: "text.secondary" }}>
                  “{testimonial.quote}”
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                  — {testimonial.name}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </Box>

      <Box display="flex" justifyContent="center" mt={4}>
        {testimonials.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => changeTestimonial(idx)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: index === idx ? theme.palette.primary.main : theme.palette.grey[500],
              margin: "0 8px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </Box>

      <Box mt={4}>
        <Divider sx={{ backgroundColor: theme.palette.divider, height: 2 }} /> {/* חוצץ למטה */}
      </Box>
    </section>
  );
}
