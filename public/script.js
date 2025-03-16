async function fetchWeather(city) {
  try {
    const res = await fetch(`/api/weather?city=${city}`);
    if (!res.ok) throw new Error("Błąd pogody");
    const data = await res.json();
    document.getElementById("city-name").textContent = data.location.name;
    document.getElementById("temp").textContent = `${data.current.temp_c}°C`;
    document.getElementById("condition-description").textContent =
      data.current.condition.text;
  } catch (err) {
    console.error("Błąd pobierania pogody:", err);
  }
}

fetchWeather("Wroclaw");

document.getElementById("getWeatherBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Wpisz nazwę miasta");
  }
});

if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      const subscribeBtn = document.getElementById("subscribeBtn");
      if (subscribeBtn) {
        subscribeBtn.style.display = "block";
        subscribeBtn.addEventListener("click", async () => {
          await subscribe(registration);
          subscribeBtn.style.display = "none";
        });

        registration.pushManager.getSubscription().then((subscription) => {
          if (subscription) subscribeBtn.style.display = "none";
        });
      }
    })
    .catch((err) => console.error("Błąd SW/Push:", err));
} else {
  console.log("Przeglądarka nie wspiera SW lub Push API.");
}

async function subscribe(registration) {
  const { vapidPublicKey } = await fetch("/api/vapid-key").then((r) =>
    r.json()
  );
  const convertedKey = urlBase64ToUint8Array(vapidPublicKey);
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey,
  });

  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById("installBtn");
  installBtn.style.display = "block";

  installBtn.onclick = async () => {
    installBtn.style.display = "none";
    deferredPrompt.prompt();
    deferredPrompt = null;
  };
});

const sendPushButton = document.getElementById("sendPush");
if (sendPushButton) {
  sendPushButton.addEventListener("click", async () => {
    const city = document.getElementById("city-name").textContent;
    const temp = document.getElementById("temp").textContent;
    const condition = document.getElementById(
      "condition-description"
    ).textContent;

    const payload = {
      title: `Pogoda w ${city}`,
      body: `Temperatura: ${temp}, ${condition}`,
    };

    try {
      await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Błąd wysyłania powiadomienia:", err);
    }
  });
}
