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
  const privacyConsent =
    document.getElementById("privacy-consent").checked;

  const answers = {
    "1. Yönetim kurulu motivasyonu":
      formData.get("question_1"),

    "2. Havacılığın anlamı ve somut ilgi örneği":
      formData.get("question_2"),

    "3. Katkı alanları, deneyimler ve özel yetkinlikler":
      formData.get("question_3"),

    "4. Kendi isteğiyle başlatacağı ilk çalışma":
      formData.get("question_4"),

    "5. Bir yıllık başarı hedefi ve geliştirme önerisi":
      formData.get("question_5"),

    "6. Bütçesiz görünürlük çalışması":
      formData.get("question_6"),

    "7. Kriz ve sorumluluk yönetimi":
      formData.get("question_7"),

    "8. Geri bildirim ve fikir ayrılığı yönetimi":
      formData.get("question_8"),

    "9. Zaman ve operasyonel sorumluluk yönetimi":
      formData.get("question_9"),

    "10. Yönetim kurulu özellikleri ve adayın farkı":
      formData.get("question_10")
  };

  const applicationData = {
    status:"beklemede",
    application_type: "yonetim",
    full_name: formData.get("full_name").trim(),
    email: formData.get("email").trim(),
    student_number: formData.get("student_number").trim(),
    phone: formData.get("phone")?.trim() || null,
    department: formData.get("department").trim(),
    class_level: formData.get("class_level"),
    answers: answers,
    privacy_consent: privacyConsent
  };

  const { error } = await supabaseClient
    .from("applications")
    .insert([applicationData]);

  if (error) {
    console.error("Yönetim başvurusu hatası:", error);

    formMessage.style.color = "#ffffff";
    formMessage.style.background = "#a8324a";
    formMessage.textContent =
      "Başvuru gönderilemedi: " + error.message;

    submitButton.disabled = false;
    submitButton.textContent = "Başvuruyu Gönder";
    return;
  }

  formMessage.style.color = "#07182d";
  formMessage.style.background = "#72f4b1";
  formMessage.textContent =
    "Yönetim kurulu başvurunuz başarıyla alındı.";

  applicationForm.reset();
  submitButton.disabled = false;
  submitButton.textContent = "Başvuruyu Gönder";
});