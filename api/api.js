
export const updateToken = async () => {
        
    const clientSecret = process.env.SECRET;
    const clientId = process.env.ID;

    let refresh_token = localStorage.getItem("refresh_token");

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            "Accept": "application/json",
            'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: `grant_type=refresh_token&refresh_token=${refresh_token}&client_id=${clientId}`

    });

    const data = await result.json();

    if (data.access_token) {

        handleAccessToken(data.access_token)
        
        return true

    }

}

export const handleAccessToken = (token) => {

    var hours = 1; 
    var now = new Date().getTime();
    var setupTime = localStorage.getItem('setupTime');

    if (setupTime == null) {
        localStorage.setItem('setupTime', now)
    } 
// 60*60*1000
    else {
        if(now-setupTime > hours*15*60*1000) {
            localStorage.removeItem('access_token')
            localStorage.setItem('setupTime', now);
            localStorage.setItem("access_token", token)
            console.log("Access Token Refreshed!");
        }
    }

}

export const requestAuthorization = () => {

    const AUTHORIZE = "https://accounts.spotify.com/authorize"
    const clientSecret = process.env.SECRET;
    const clientId = process.env.ID
    const redirect_uri = 'http://localhost:3000/';

    let url = AUTHORIZE;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-top-read user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url

};

export const getCode = () => 
{
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

export const callAuthorizationApi = async (code) => {

    
    const clientSecret = process.env.SECRET;
    const clientId = process.env.ID;
    const redirect_uri = 'http://localhost:3000/';
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            "Accept": "application/json",
            'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`

    });

    const data = await result.json();

    if (data.access_token) {
        localStorage.setItem("access_token", data.access_token)
    }

    if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token)
    }

    // console.log(data);
    // window.history.pushState("", "", redirect_uri)

    return data.access_token



};

export const getTopArtists = async (token,time_range) => {

    const result = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=5`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token, 
        },
        
    })

    const data = await result.json()

    return data
    

}

export const getTopTracks = async (token,time_range) => {

    const result = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=5`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token, 
        },
        
    })

    const data = await result.json()

    return data


}

export const getPlaybackState = async (token) => {

    const result = await fetch(`https://api.spotify.com/v1/me/player`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token, 
        },
        
    })
    
    const data = await result.json()

    return data
    

}

export const getCurrentPlaying = async (token) => {

    console.log("Get Current Playing Pending");

    const result = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token, 
        },
        
    })
    
    const data = await result.json()

    if (data) {

        console.log("Get Current Playing Successful");
        return data

    }
    else {

        console.log("Get Current Playing Error");
        return data


    }

}

export const getUserName = async (token) => {

    const result = await fetch(`https://api.spotify.com/v1/me`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token, 
        },
        
    })
    
    const data = await result.json()
    console.log(data);
    return data
    

}

export const getUserPlaylist = async (token) => {

    const result = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token, 
        },
        
    })
    
    const data = await result.json()

    return data
    
}

export const getUserPlaylistTracks = async (token,playlist_id) => {

    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token, 
        },
        
    })
    
    const data = await result.json()

    return data
    
}

export const audioAnalysisMulti = async (token,trackIDs) => {

    const result = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIDs}`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + token, 
        },
    })
    
    const data = await result.json()

    return data
    
}