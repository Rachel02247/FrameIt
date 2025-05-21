import emailjs from "@emailjs/browser";
import { toJpeg } from "html-to-image";
import { toast } from "react-toastify";

export const sendEmail = async (element: HTMLElement) => {
  const tokenEmail = sessionStorage.getItem("token")?.split(".")[1];
  const emailPayload = tokenEmail ? JSON.parse(atob(tokenEmail)) : null;
  const userEmail =
    emailPayload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
    'framit.norply@gmail.com';

  const userName = sessionStorage.getItem("name");

  const toastId = toast.loading("Sending email...");

  try {
    let quality = 0.95;
    let dataUrl = await toJpeg(element, { quality });

    const maxSize = 50 * 1024; // 50KB

    // הורדת איכות עד שעוברים את התנאי או מגיעים לסף איכות מינימלי
    while ((dataUrl.length * 3) / 4 > maxSize && quality > 0.1) {
      console.log(`Image size: ${Math.round((dataUrl.length * 3) / 4)} bytes, quality: ${quality.toFixed(2)}`);
      quality -= 0.05;
      dataUrl = await toJpeg(element, { quality });
    }

    const finalSize = Math.round((dataUrl.length * 3) / 4);
    console.log(`Final image size: ${finalSize} bytes, quality: ${quality.toFixed(2)}`);

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_email: userEmail ?? 'r0527102247@gmail.com',
        message: "Here is your collage!",
        user_name: userName,
        collage_base64: dataUrl,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    toast.update(toastId, {
      render: "Email sent successfully!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    toast.update(toastId, {
      render: "Failed to send email. Please try again.",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};
