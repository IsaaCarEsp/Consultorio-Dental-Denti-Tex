/* Función para vCard */
function downloadVCard() {
  const vcardData =
    `BEGIN:VCARD
VERSION:3.0
FN:Consultorio Dental Denti-Tex
ORG:Consultorio Odontológico
TEL;TYPE=CELL:+525512472621
TITLE:Odontología Integral
NOTE:Guardado desde Tarjeta Digital
END:VCARD`;

  const blob = new Blob([vcardData], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Contacto_Consultorio_Dental.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* Acordeón FAQ */
function toggleFaq(button) {
  const answer = button.nextElementSibling;
  const icon = button.querySelector('i');

  if (answer.style.display === "block") {
    answer.style.display = "none";
    icon.style.transform = "rotate(0deg)";
  } else {
    answer.style.display = "block";
    icon.style.transform = "rotate(180deg)";
  }
}
document.querySelector('#download-vcard').addEventListener('click', downloadVCard);

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => toggleFaq(button));
});

const businessStatus = document.querySelector('#business-status');
const businessStatusLabel = document.querySelector('#business-status-label');

if (businessStatus && businessStatusLabel) {
  const mexicoCityClock = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Mexico_City',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  function updateBusinessStatus() {
    const dateParts = Object.fromEntries(
      mexicoCityClock.formatToParts(new Date()).map(({ type, value }) => [type, value]),
    );
    const weekdays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const currentDay = weekdays[dateParts.weekday];
    const currentTime = Number(dateParts.hour) * 60 + Number(dateParts.minute);
    const todaysSchedule = document.querySelector(`.schedule-item[data-day="${currentDay}"]`);
    const openTime = todaysSchedule?.dataset.open;
    const closeTime = todaysSchedule?.dataset.close;
    const isOpen = Boolean(openTime && closeTime)
      && currentTime >= timeToMinutes(openTime)
      && currentTime < timeToMinutes(closeTime);

    businessStatusLabel.textContent = isOpen ? 'Abierto Ahora' : 'Cerrado Ahora';
    businessStatus.classList.toggle('is-closed', !isOpen);
  }

  function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  updateBusinessStatus();
  window.setInterval(updateBusinessStatus, 60_000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      updateBusinessStatus();
    }
  });
}

const loadingScreen = document.querySelector('#loading-screen');

if (loadingScreen) {
  loadingScreen.hidden = false;

  let hasHiddenLoadingScreen = false;
  const maxLoadingTimeout = window.setTimeout(hideLoadingScreen, 8000);

  function hideLoadingScreen() {
    if (hasHiddenLoadingScreen) {
      return;
    }

    hasHiddenLoadingScreen = true;
    window.clearTimeout(maxLoadingTimeout);
    loadingScreen.classList.add('is-hidden');
    window.setTimeout(() => {
      loadingScreen.hidden = true;
    }, 300);
  }

  if (document.readyState === 'complete') {
    window.setTimeout(hideLoadingScreen, 500);
  } else {
    window.addEventListener('load', () => {
      window.setTimeout(hideLoadingScreen, 500);
    }, { once: true });
  }
}