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
  formMessage.textContent = "Bilgileriniz güvenli şekilde gönderiliyor...";

  const formData = new FormData(applicationForm);

  const applicationType =
    applicationForm.dataset.applicationType;

  const privacyConsent =
    document.getElementById("privacy-consent").checked;

  const answers = {
    "Katılma motivasyonu":
      formData.get("motivation") || "Belirtilmedi",

    "Havacılık ilgi alanları":
      formData.get("interests") || "Belirtilmedi"
  };

  const applicationData = {
    status:"beklemede",
    application_type: applicationType,
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
  console.error("Başvuru hatası:", error);

  formMessage.style.color = "#ffffff";
  formMessage.style.background = "#a8324a";
  formMessage.textContent = "Gerçek hata: " + error.message;

  submitButton.disabled = false;
  submitButton.textContent = "Başvuruyu Gönder";
  return;
}
  

  formMessage.style.color = "#07182d";
  formMessage.style.background = "#72f4b1";
  formMessage.textContent =
    "Başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.";

  applicationForm.reset();

  submitButton.disabled = false;
  submitButton.textContent = "Başvuruyu Gönder";
});