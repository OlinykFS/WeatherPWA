document.addEventListener("DOMContentLoaded", () => {
    fetch('/files')
        .then(res => res.json())
        .then(files => {
            const list = document.getElementById('filesList');
            files.forEach(fileName => {
                const li = document.createElement('li');
                const a = document.createElement('a');

                a.href = '/files/' + fileName;
                a.target = '_blank';
                a.innerText = fileName;
                a.className = "block bg-blue-500 dark:bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition";

                li.appendChild(a);
                list.appendChild(li);
            });
        })
        .catch(err => console.error('[script.js] Ошибка загрузки списка файлов:', err));
});
