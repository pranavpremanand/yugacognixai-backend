const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const RECAPTCHA_SECRET_KEY = "6Lf7g8YqAAAAAKmotRHMd3_hsEl6JXJdyHgwTNpM";
const PROJECT_ID = "my-project-14519-1738150820845";
const RECAPTCHA_SITE_KEY = "6Lf7g8YqAAAAAB1WsfCwhyYVM2vqV1BO0bp4HMdi";

// Verify reCAPTCHA token
app.post("/api/verify-recaptcha", async (req, res) => {
  const { token } = req.body;

  try {
    const url = new URL("https://www.google.com/recaptcha/api/siteverify");
    url.searchParams.append("secret", RECAPTCHA_SECRET_KEY);
    url.searchParams.append("response", token);

    const response = await fetch(url, { method: "POST" });
    const captchaData = await response.json();

    if (!captchaData) {
      res
        .status(400)
        .json({ success: false, message: "reCAPTCHA verification failed" });
    }

    if (!captchaData.success || captchaData.score < 0.5) {
      res
        .status(400)
        .json({ success: false, message: "reCAPTCHA verification failed" });
    } else {
      res.status(200).json({
        success: captchaData.success,
        score: captchaData.score,
        data: captchaData,
      });
    }
  } catch (error) {
    console.error(
      "Error verifying reCAPTCHA:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
