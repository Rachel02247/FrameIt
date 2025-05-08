"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Upload, ImageIcon, Users } from "lucide-react"

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      title: "העלאת תמונות",
      description: "העלה תמונות בקלות לתיקיות מאורגנות בענן",
      icon: <Upload className="h-6 w-6" />,
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      title: "יצירת קולאז׳ים",
      description: "צור קולאז׳ים מרהיבים מהתמונות האהובות עליך",
      icon: <ImageIcon className="h-6 w-6" />,
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      title: "שיתוף משפחתי",
      description: "שתף אלבומים עם בני משפחה וחברים בקלות",
      icon: <Users className="h-6 w-6" />,
      image: "/placeholder.svg?height=600&width=800",
    },
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-white z-0"></div>

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-right">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-pink-600">FrameIt</span> - הדרך החכמה לנהל את הזכרונות המשפחתיים שלך
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mr-0">
                פלטפורמה חכמה לניהול, ארגון ושיתוף תמונות משפחתיות בענן, עם יכולות AI מתקדמות
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                  התחל עכשיו - חינם
                </Button>
                <Button size="lg" variant="outline">
                  צפה בהדגמה
                </Button>
              </div>
            </motion.div>

            <div className="mt-12">
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                {tabs.map((tab, index) => (
                  <Button
                    key={index}
                    variant={activeTab === index ? "default" : "outline"}
                    className={activeTab === index ? "bg-pink-600 hover:bg-pink-700" : ""}
                    onClick={() => setActiveTab(index)}
                  >
                    {tab.icon}
                    <span className="mr-2">{tab.title}</span>
                  </Button>
                ))}
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto lg:mr-0"
              >
                <h3 className="text-xl font-bold mb-2">{tabs[activeTab].title}</h3>
                <p className="text-gray-600">{tabs[activeTab].description}</p>
              </motion.div>
            </div>
          </div>

          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white"
            >
              <Image
                src={tabs[activeTab].image || "/placeholder.svg"}
                alt={tabs[activeTab].title}
                width={800}
                height={600}
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
