async function downloadVideo() {
    let url = document.getElementById("url").value.trim();
    let result = document.getElementById("result");

    if (!url) {
        alert("Bhai URL toh dalo!");
        return;
    }

    result.innerHTML = `<div class="loader"></div><p>Processing...</p>`;

    try {
        // Humne localhost:3000 par apna server chalaya hai
        const response = await fetch(`http://localhost:3000/fetch-video?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        if (data.success) {
            result.innerHTML = `
                <video src="${data.downloadUrl}" controls></video>
                <br>
                <a href="${data.downloadUrl}" target="_blank" class="download-link">⬇ Download Video</a>
            `;
        } else {
            result.innerHTML = `<p style="color:red;">Error: ${data.message}</p>`;
        }
    } catch (error) {
        result.innerHTML = `<p style="color:red;">Backend se connect nahi ho pa raha! (node server.js chalu hai?)</p>`;
    }
}