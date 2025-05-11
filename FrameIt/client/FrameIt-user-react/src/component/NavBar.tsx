/* eslint-disable react-refresh/only-export-components */
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default () => {
  const { language } = useLanguage();

  return (
    <>
      <Link to="/home">
        <img
          style={{
            width: 50,
            top: 20,
            [language === "he" ? "left" : "right"]: 40,
            position: "absolute",
            zIndex: 2,
          }}
          src="img/logo.png"
          alt="logo"
        />
      </Link>
    </>
  );
};