import emailjs from "@emailjs/browser";
import { toPng } from "html-to-image";

export const sendEmail = async (element: HTMLElement) => {
  const tokenEmail = sessionStorage.getItem("token")?.split(".")[1];
  const emailPlayload = tokenEmail ? JSON.parse(atob(tokenEmail)) : null;
  const userEmail = emailPlayload?.email || 'r0527102247@gmail.com';

  const userName = sessionStorage.getItem("name");

  try {
    console.log("Sending email...");
    console.log(userEmail);
    console.log(userName);
    let quality = 0.95;
    let dataUrl = await toPng(element, { quality });

    while (dataUrl.length > 50 * 1024 && quality > 0.1) {
      quality -= 0.05;
      dataUrl = await toPng(element, { quality });
    }

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
    console.log("Email sent successfully!");
    console.log(userEmail);
    console.log(userName);
    alert("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    alert("Failed to send email.");
  }
};
