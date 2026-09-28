const publicSupabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: "oht-public-form"
    }
  }
);
const applicationForm = document.getElementById("application-form");
const submitButton = document.getElementById("submit-button");
const formMessage = document.getElementById("form-message");

applicationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  submitButton.disabled = true;
  submitButton.textContent = "Başvuru gönderiliyor...";

  formMessage.style.display = "block";
  formMessage.style.color = "#07182d";
  formMessage.style.background = "#72d2f4";
  formMessage.textContent =
    "Bilgileriniz güvenli şekilde gönderiliyor...";

  const formData = new FormData(applicationForm);

  const getText = (name) =>
  String(formData.get(name) ?? "").trim();

  const privacyConsent =
    document.getElementById("privacy-consent").checked;

  const answers = {
    "1. Yayın ekibine katılma motivasyonu":
      formData.get("publication_motivation"),

    "2. Öncelikli çalışma alanı":
      formData.get("work_area"),

    "3. İlgilendiği yayın projesi":
      formData.get("publication_preference"),

    "4. Deneyimler ve öğrenmek istediği alanlar":
      formData.get("experience"),

    "5. Portfolyo bağlantısı":
      formData.get("portfolio") || "Paylaşılmadı",

    "6. İlk içerik fikri":
      formData.get("content_idea"),

    "7. Araştırma ve kaynak doğrulama yöntemi":
      formData.get("research_method"),

    "8. Geri bildirime yaklaşımı":
      formData.get("feedback"),

    "9. Haftalık ayırabileceği zaman":
      formData.get("availability"),

    "10. Yayın ekibine sağlayacağı farklı katkı":
      formData.get("contribution")
  
   
    };
    const applicationData = {
  application_type: "yayin",
  status:"beklemede",
  full_name: getText("full_name"),
  email: getText("email"),
  student_number: getText("student_number"),
  phone: getText("phone") || null,
  department: getText("department"),
  class_level: getText("class_level"),
  answers: answers,
  privacy_consent: privacyConsent
};
  try {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/applications`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(applicationData),
      signal: controller.signal
    }
  );

  clearTimeout(timeout);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }
} catch (error) {
  console.error("Yayın ekibi başvuru hatası:", error);

  formMessage.style.color = "#ffffff";
  formMessage.style.background = "#a8324a";
  formMessage.textContent =
    error.name === "AbortError"
      ? "Bağlantı zaman aşımına uğradı. Lütfen tekrar deneyin."
      : "Başvuru gönderilemedi: " + error.message;

  submitButton.disabled = false;
  submitButton.textContent = "Başvuruyu Gönder";
  return;
}
  

  formMessage.style.color = "#07182d";
  formMessage.style.background = "#72f4b1";
  formMessage.textContent =
    "OHT Yayın Ekibi başvurunuz başarıyla alındı.";

  applicationForm.reset();
  submitButton.disabled = false;
  submitButton.textContent = "Başvuruyu Gönder";
});