document.getElementById('searchBtn').addEventListener('click', async () => {
    const keyword = document.getElementById('keyword').value;
    const location = document.getElementById('location').value;
    const connection = document.getElementById('connection').value;

    const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, location, connection })
    });

    const profiles = await response.json();
    displayProfiles(profiles);
});

function displayProfiles(profiles) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    profiles.slice(0, 5).forEach(profile => {
        const profileDiv = document.createElement('div');
        profileDiv.className = 'profile';
        profileDiv.innerHTML = `
            <img src="${profile.image}" alt="Profile Picture" width="50" />
            <p>Name: ${profile.name}</p>
            <p>About: ${profile.about}</p>
            <p>Match: ${profile.match}%</p>
            <a href="${profile.linkedin}" target="_blank">LinkedIn Profile</a>
        `;
        resultsDiv.appendChild(profileDiv);
    });
}
