import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Grid, FolderPlus, Share2, ImageIcon, Brain } from "lucide-react"
import FeatureCard from "@/components/feature-card"
import HeroSection from "@/components/hero-section"
import TestimonialSection from "@/components/testimonial-section"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="FrameIt Logo" width={40} height={40} className="object-contain" />
            <span className="text-2xl font-bold">FrameIt</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-pink-600 transition-colors">
              תכונות
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-pink-600 transition-colors">
              איך זה עובד
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-pink-600 transition-colors">
              המלצות
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden sm:flex">
              התחברות
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700">הרשמה חינם</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">תכונות מרכזיות</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              FrameIt מציעה מגוון רחב של כלים לניהול, ארגון ושיתוף התמונות המשפחתיות שלך בצורה חכמה ונוחה
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FolderPlus className="h-10 w-10 text-pink-600" />}
              title="ארגון תיקיות חכם"
              description="צור תיקיות מותאמות אישית לארגון התמונות שלך בצורה שמתאימה לך"
            />
            <FeatureCard
              icon={<Grid className="h-10 w-10 text-pink-600" />}
              title="יצירת קולאז׳ים"
              description="עצב קולאז׳ים מרהיבים מהתמונות האהובות עליך בכמה קליקים פשוטים"
            />
            <FeatureCard
              icon={<ImageIcon className="h-10 w-10 text-pink-600" />}
              title="אוספים מיוחדים"
              description="צור אוספים מיוחדים לאירועים, חגים או כל נושא שתבחר"
            />
            <FeatureCard
              icon={<Brain className="h-10 w-10 text-pink-600" />}
              title="סינון חכם מבוסס AI"
              description="זיהוי פנים וסינון חכם של תמונות לפי אנשים, מקומות ואירועים"
            />
            <FeatureCard
              icon={<Share2 className="h-10 w-10 text-pink-600" />}
              title="שיתוף קל ומהיר"
              description="שתף אלבומים ותמונות עם בני משפחה וחברים בקלות ובמהירות"
            />
            <FeatureCard
              icon={<Download className="h-10 w-10 text-pink-600" />}
              title="גישה מכל מקום"
              description="צפה, הורד ונהל את התמונות שלך מכל מכשיר ובכל זמן"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">איך זה עובד</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              בכמה צעדים פשוטים תוכלו להתחיל לארגן ולשתף את הזכרונות המשפחתיים שלכם
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-pink-100 hover:border-pink-200 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-pink-100 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-pink-600 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">הרשמה והעלאת תמונות</h3>
                <p className="text-gray-600">צור חשבון חינמי והתחל להעלות את התמונות שלך לענן בצורה מאובטחת</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-100 hover:border-pink-200 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-pink-100 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-pink-600 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">ארגון וסידור</h3>
                <p className="text-gray-600">ארגן את התמונות בתיקיות, צור אוספים מיוחדים והשתמש בסינון החכם</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-pink-100 hover:border-pink-200 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-pink-100 w-12 h-12 flex items-center justify-center mb-4">
                  <span className="text-pink-600 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">שיתוף ושמירה</h3>
                <p className="text-gray-600">שתף את התמונות עם המשפחה והחברים, צור קולאז׳ים ושמור זכרונות לנצח</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">התחל לארגן את הזכרונות המשפחתיים שלך עוד היום</h2>
          <p className="max-w-2xl mx-auto mb-8">
            הצטרף לאלפי משפחות שכבר משתמשות ב-FrameIt כדי לשמור, לארגן ולשתף את הרגעים המיוחדים שלהם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
              הרשמה חינם
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-pink-700">
              למידע נוסף
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/images/logo.png" alt="FrameIt Logo" width={40} height={40} className="object-contain" />
                <span className="text-xl font-bold text-white">FrameIt</span>
              </div>
              <p className="max-w-xs">
                FrameIt - פלטפורמה לניהול תמונות משפחתיות בענן.
                <br />
                <span className="text-sm italic">it makes us family</span>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-bold mb-4">ניווט מהיר</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="hover:text-pink-400 transition-colors">
                      דף הבית
                    </Link>
                  </li>
                  <li>
                    <Link href="#features" className="hover:text-pink-400 transition-colors">
                      תכונות
                    </Link>
                  </li>
                  <li>
                    <Link href="#how-it-works" className="hover:text-pink-400 transition-colors">
                      איך זה עובד
                    </Link>
                  </li>
                  <li>
                    <Link href="#testimonials" className="hover:text-pink-400 transition-colors">
                      המלצות
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-4">משאבים</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="hover:text-pink-400 transition-colors">
                      מדריכים
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-pink-400 transition-colors">
                      שאלות נפוצות
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-pink-400 transition-colors">
                      תמיכה
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-pink-400 transition-colors">
                      בלוג
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-bold mb-4">משפטי</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="hover:text-pink-400 transition-colors">
                      תנאי שימוש
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-pink-400 transition-colors">
                      פרטיות
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-pink-400 transition-colors">
                      מדיניות עוגיות
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© {new Date().getFullYear()} FrameIt. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
