document.addEventListener("DOMContentLoaded", () => {
    let deferredPrompt;
    const installPrompt = document.getElementById('installPrompt');
    const installBtn = document.getElementById('installBtn');

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(() => console.log("✅ [PWA] Service Worker зарегистрирован!"))
            .catch(err => console.error("❌ [PWA] Ошибка регистрации SW:", err));
    }
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredPrompt = event;
        if (installPrompt) {
            installPrompt.classList.remove('hidden');
        }
    });

    if (installBtn) {
        installBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(choice => {
                    if (choice.outcome === 'accepted') {
                        console.log("✅ [PWA] PWA установлена!");
                    } else {
                        console.log("❌ [PWA] Установка PWA отменена.");
                    }
                    deferredPrompt = null;
                    if (installPrompt) {
                        installPrompt.classList.add('hidden');
                    }
                });
            }
        });
    }
});
