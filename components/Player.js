import SpotifyPlayer from "react-spotify-web-playback"

export default function Player( { accessToken, trackUri }) {
    if (!accessToken) return null

    console.log('inside ' + trackUri);


    return (
    
    <SpotifyPlayer 
        token={accessToken}
        showSaveIcon
        uris={trackUri ? [trackUri]: []}
        play={trackUri? true: false}

    />
  )
}
