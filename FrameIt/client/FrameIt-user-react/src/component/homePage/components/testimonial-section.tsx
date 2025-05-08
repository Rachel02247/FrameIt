import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "דנה כהן",
      role: "אמא לשלושה",
      content: "FrameIt שינתה את הדרך שבה אני מארגנת את התמונות המשפחתיות שלנו. הסינון החכם חוסך לי המון זמן!",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "יוסי לוי",
      role: "צלם חובב",
      content: "אני מאוד אוהב את האפשרות ליצור קולאז׳ים ואוספים מיוחדים. ממליץ בחום לכל מי שאוהב לצלם ולשמור זכרונות.",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "מיכל אברהם",
      role: "סבתא גאה",
      content: "בזכות FrameIt אני יכולה לראות את התמונות של הנכדים שלי בקלות, גם כשאני לא איתם. פשוט נהדר!",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">מה המשתמשים שלנו אומרים</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            אלפי משפחות כבר משתמשות ב-FrameIt כדי לארגן ולשתף את הזכרונות היקרים להם
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 border-pink-100">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-pink-500 text-pink-500" />
                  ))}
                </div>

                <p className="text-gray-600">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
