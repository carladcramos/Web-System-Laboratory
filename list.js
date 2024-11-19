document.addEventListener('DOMContentLoaded', function () {
    const addSongForm = document.getElementById('add-song-form');
    const songNameInput = document.getElementById('song-name');
    const songArtistInput = document.getElementById('song-artist');
    const songList = document.getElementById('song-items');
    const searchInput = document.getElementById('search-input');
  
    addSongForm.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const songName = songNameInput.value.trim();
        const songArtist = songArtistInput.value.trim();
        
        if (songName && songArtist) {
            const newSongItem = document.createElement('li');
            newSongItem.innerHTML = `<span class="song">${songName}</span><span class="artist">${songArtist}</span>
                                     <button class="delete">Delete</button>`;
            songList.appendChild(newSongItem);
  
            songNameInput.value = '';
            songArtistInput.value = '';
        }
    });
  
    songList.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete')) {
            const songItem = event.target.parentElement;
            songList.removeChild(songItem);
        }
    });
  
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const songItems = Array.from(songList.children);
  
        songItems.forEach(item => {
            const songName = item.querySelector('.song').textContent.toLowerCase();
            const songArtist = item.querySelector('.artist').textContent.toLowerCase();
            const matches = songName.includes(searchTerm) || songArtist.includes(searchTerm);
            item.style.display = matches ? '' : 'none';
        });
    });
  });
  