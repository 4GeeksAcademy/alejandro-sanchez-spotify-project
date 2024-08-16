import { useState, useRef , useEffect } from "react";
import React  from "react";
import "../../styles/playlist.css";

const Playlist = () => {
    let [playlist, setPlaylist] = useState([]);
    let [currentSong, setCurrentSong] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const playlistRef = useRef("");

    let getPlaylist = () => {
        fetch('https://playground.4geeks.com/sound/songs', {
            method: 'GET',
        })
        .then((response) => response.json())
        .then(data => setPlaylist(data))
        .catch(error => console.log(error));
    }

    useEffect(() => {
        getPlaylist();
    }, []);

    useEffect(() => {
        if (playlist.songs && playlist.songs.length > 0) {
            playlistRef.current.src = `https://playground.4geeks.com${playlist.songs[currentSong].url}`;
            if (isPlaying) {
                playlistRef.current.play();
            }
        }
    }, [currentSong, playlist]);

    if (playlist.songs && playlist.songs[currentSong]) {
        console.log(playlist.songs[currentSong].name);
    } else {
        console.log("El objeto o la propiedad no existe.");
    }

    const handlePlayPause = () => {
        if (isPlaying) {
            playlistRef.current.pause();
        } else {
            playlistRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        setCurrentSong((currentSong + 1) % playlist.songs.length);
    };

    const handlePrevious = () => {
        setCurrentSong((currentSong - 1 + playlist.songs.length) % playlist.songs.length);
    };

    const handleSongClick = (index) => {
        setCurrentSong(index);
        setIsPlaying(true); // Para que la canción se reproduzca automáticamente
    };


    return (
        <div className="playlist-container container-xl bg-dark text-light p-4">
                <div className="col-12 col-md-4 mx-auto playlist-list"> 
                    <ul className="list-group list-group-flush">
                        {playlist.songs && playlist.songs.length > 0 ? (
                            playlist.songs.map((item, index) => (
                                <li key={index} 
                                className={`list-group-item bg-dark ${currentSong === index ? 'active-song fs-2' : 'text-light'}`}
                                onClick={() => handleSongClick(index)}>
                                    <span>{item.id}</span> {item.name}
                                </li>
                            ))
                        ) : (
                            <li>No songs available</li>
                        )}
                    </ul>
                </div>
                <div className="col-12 col-md-8 d-flex flex-column justify-content-center align-items-center player-controls mx-auto mt-2">
                    <audio ref={playlistRef} className="w-100">
                    </audio>
                    <div>
                        <button className="btn btn-outline-light mx-2" onClick={handlePrevious}><i class="fa-solid fa-backward"></i></button>
                        <button className="btn btn-outline-light mx-2" onClick={handlePlayPause}>{isPlaying ? <i class="fa-solid fa-pause"></i> : <i class="fa-solid fa-play"></i>}</button>
                        <button className="btn btn-outline-light mx-2" onClick={handleNext}><i class="fa-solid fa-forward"></i></button>
                    </div>
                </div>
        </div>
        
    );
};

export default Playlist;