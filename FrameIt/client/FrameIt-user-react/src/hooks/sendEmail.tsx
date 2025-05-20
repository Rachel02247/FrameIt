import emailjs from "@emailjs/browser"
import { toPng } from "html-to-image"

export const sendEmail = async (element: HTMLElement) => {

    const tokenEmail = sessionStorage.getItem("token")?.split(".")[1]
    const userEmail = tokenEmail ? JSON.parse(atob(tokenEmail)) : null

    const userName = sessionStorage.getItem("name");

  try {
    const dataUrl = await toPng(element, { quality: 0.95 })

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_email: userEmail,
        message: "Here is your collage!",
        user_name: userName,
        collage_base64: dataUrl,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )

    alert("Email sent successfully!")
  } catch (error) {
    console.error("Error sending email:", error)
    alert("Failed to send email.")
  }
}
