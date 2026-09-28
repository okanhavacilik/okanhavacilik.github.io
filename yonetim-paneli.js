const applicationList = document.getElementById("application-list");
const logoutButton = document.getElementById("logout-button");
const filterButtons = document.querySelectorAll(".filter-button");

const totalCount = document.getElementById("total-count");
const pendingCount = document.getElementById("pending-count");
const reviewCount = document.getElementById("review-count");
const approvedCount = document.getElementById("approved-count");

let applications = [];
let activeFilter = "tumu";

function safeText(value) {
  const element = document.createElement("div");
  element.textContent = value ?? "-";
  return element.innerHTML;
}

function getApplicationType(type) {
  const types = {
    topluluk: "Topluluk Üyeliği",
    yonetim: "Yönetim Kurulu",
    yayin: "Yayın Ekibi"
  };

  return types[type] || type || "Başvuru";
}

function getStatusText(status) {
  const statuses = {
    beklemede: "Onaylanmamış",
    inceleniyor: "İnceleniyor",
    onaylandi: "Onaylandı",
    reddedildi: "Reddedildi"
  };

  return statuses[status] || "Onaylanmamış";
}

function createAnswersHTML(answers) {
  if (!answers || typeof answers !== "object") {
    return "<p>Bu başvuru için ek cevap bulunmuyor.</p>";
  }

  return Object.entries(answers)
    .map(([question, answer]) => {
      return `
        <div class="answer-item">
          <strong>${safeText(question)}</strong>
          <p>${safeText(answer)}</p>
        </div>
      `;
    })
    .join("");
}

function updateCounters() {
  totalCount.textContent = applications.length;

  pendingCount.textContent = applications.filter(
    application => application.status === "beklemede"
  ).length;

  reviewCount.textContent = applications.filter(
    application => application.status === "inceleniyor"
  ).length;

  approvedCount.textContent = applications.filter(
    application => application.status === "onaylandi"
  ).length;
}

function displayApplications() {
  const filteredApplications =
    activeFilter === "tumu"
      ? applications
      : applications.filter(
          application => application.status === activeFilter
        );

  if (filteredApplications.length === 0) {
    applicationList.innerHTML = `
      <p class="empty-message">
        Bu bölümde gösterilecek başvuru bulunmuyor.
      </p>
    `;
    return;
  }

  applicationList.innerHTML = filteredApplications
    .map(application => {
      const status = application.status || "beklemede";

      return `
        <article class="application-card">

          <div class="application-top">
            <div>
              <h2>${safeText(application.full_name)}</h2>

              <p class="application-type">
                ${safeText(getApplicationType(application.application_type))}
              </p>
            </div>

            <span class="status status-${safeText(status)}">
              ${safeText(getStatusText(status))}
            </span>
          </div>

          <div class="applicant-info">

            <div class="info-item">
              <small>E-posta</small>
              ${safeText(application.email)}
            </div>

            <div class="info-item">
              <small>Telefon</small>
              ${safeText(application.phone)}
            </div>

            <div class="info-item">
              <small>Öğrenci numarası</small>
              ${safeText(application.student_number)}
            </div>

            <div class="info-item">
              <small>Bölüm</small>
              ${safeText(application.department)}
            </div>

            <div class="info-item">
              <small>Sınıf</small>
              ${safeText(application.class_level)}
            </div>

            <div class="info-item">
              <small>Başvuru tarihi</small>
              ${
                application.created_at
                  ? new Date(application.created_at).toLocaleString("tr-TR")
                  : "-"
              }
            </div>

          </div>

          <div class="answers">
            <h3>Başvuru Cevapları</h3>
            ${createAnswersHTML(application.answers)}
          </div>

          <div class="card-actions">

            <button
              type="button"
              class="status-button review-button"
              data-id="${application.id}"
              data-new-status="inceleniyor">
              İnceleniyor
            </button>

            <button
              type="button"
              class="status-button approve-button"
              data-id="${application.id}"
              data-new-status="onaylandi">
              Onayla
            </button>

            <button
              type="button"
              class="status-button reject-button"
              data-id="${application.id}"
              data-new-status="reddedildi">
              Reddet
            </button>

          </div>

        </article>
      `;
    })
    .join("");
}

async function loadApplications() {
  applicationList.innerHTML = `
    <p class="empty-message">Başvurular yükleniyor...</p>
  `;

  const { data, error } = await supabaseClient
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Başvurular alınamadı:", error);

    applicationList.innerHTML = `
      <p class="empty-message">
        Başvurular yüklenemedi: ${safeText(error.message)}
      </p>
    `;

    return;
  }

  applications = data || [];

  updateCounters();
  displayApplications();
}

async function updateApplicationStatus(applicationId, newStatus) {
  const { error } = await supabaseClient
    .from("applications")
    .update({ status: newStatus })
    .eq("id", applicationId);

  if (error) {
    console.error("Durum güncellenemedi:", error);
    alert("Başvuru durumu güncellenemedi: " + error.message);
    return;
  }

  const selectedApplication = applications.find(
    application => String(application.id) === String(applicationId)
  );

  if (selectedApplication) {
    selectedApplication.status = newStatus;
  }

  updateCounters();
  displayApplications();
}

applicationList.addEventListener("click", event => {
  const button = event.target.closest("[data-new-status]");

  if (!button) {
    return;
  }

  updateApplicationStatus(
    button.dataset.id,
    button.dataset.newStatus
  );
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));

    button.classList.add("active");
    activeFilter = button.dataset.status;

    displayApplications();
  });
});

logoutButton.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "yonetici-girisi.html";
});

async function protectManagementPanel() {
  const { data, error } = await supabaseClient.auth.getUser();
  const user = data?.user;

  if (
    error ||
    !user ||
    user.email?.toLowerCase() !== "erensema908@gmail.com"
  ) {
    window.location.href = "yonetici-girisi.html";
    return;
  }

  await loadApplications();
}

protectManagementPanel();