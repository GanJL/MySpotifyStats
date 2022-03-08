import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { 
  getTopTracks,
  getTopArtists, 
  getPlaybackState, 
  getCurrentPlaying, 
  updateToken, 
  getUserPlaylist,
  getUserPlaylistTracks,
  audioAnalysisMulti,
  getUserName
} from '../api/api'

import { TopTrack } from '../components/TopTrack';
import { TopArtist } from '../components/TopArtist';
import Player from '../components/Player';
import Loading from '../components/Loading';
import Select from 'react-select'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MainStyles from '../styles/Main.module.css'

const Home = () => {

  const router = useRouter()

  const [token, setToken] = useState("")
  const [topTracks, setTopTracks] = useState(null)
  const [topArtists, setTopArtists] = useState(null)
  const [updateFlag, setUpdateFlag] = useState(false)
  const [currentPlaying, setCurrentPlaying] = useState("")
  const [loaded, isLoaded] = useState(false)
  const [timeRangeTrack, setTimeRangeTrack] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState({})
  const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState(null)
  const [audioAnalysis, setAudioAnalysis] = useState(null)
  const [userName, setUserName] = useState(null)
  const selectedTrack = (e,track) => { 

    e.preventDefault()

    setCurrentPlaying(track);


  };

  const handleCurrentPlaying = async (token) => {

    const song = await getCurrentPlaying(token)

    console.log(song);
    if (song) {
      const songUri = song.item.uri;
      setCurrentPlaying(songUri)

    }


  }

  const logout = () => {
    localStorage.clear()
    router.push('/')
  }

  const handleTopTracks = async (token,timeRange='short_term') => {

    const tracks = await getTopTracks(token,timeRange)
    .then((tracks)=>{


        if (tracks) {
          const tracksData = tracks.items
          console.log(tracksData);
          let tracks_arr = []
  
            tracksData.map((data)=>{
          
              tracks_arr.push(data)
      
            })
        }
        
      setTopTracks(tracks_arr)
      console.log(tracks_arr);

      
    }) 
    .catch((err)=>{console.log(err)})

  };

  const handleTopArtists = async (token,timeRange='short_term') => {
    const artists = await getTopArtists(token,timeRange)
    .then((artists)=>{
      const artistsData = artists.items

      console.log(artistsData);

      let artists_arr = []

      if (artistsData) {
        artistsData.map((artists)=>{
      
          artists_arr.push(artists)
  
        })
      }
     
      setTopArtists(artists_arr)

    })    

  };

  const handlePlayback = async (token) => {
    const playback = await getPlaybackState(token)
    .then((playback)=>{
      // const data = playback.device.name
      console.log(playback);
      // setCurrentPlayback(playback);
    })
 

  };

  const handleUserPlaylist = async (token) => {

    const tracks = await getUserPlaylist(token)
    .then((playlists)=>{

        if (playlists) {
          console.log(playlists);
          const playlistsData = playlists.items
          let playlists_arr = []
  
            playlistsData.map((playlist)=>{
              let playlistObj = {}
              playlistObj['value'] = playlist.id
              playlistObj['label'] = playlist.name
              playlists_arr.push(playlistObj)
            })

            setPlaylists(playlists_arr)
        }
        
      
    }) 
    .catch((err)=>{console.log(err)})

  };

  const handleUserPlaylistTracks = async (token,id) => {

    if (id != null) {
      const tracks = await getUserPlaylistTracks(token,id)
      .then((tracks)=>{
  
          const tracksItems = tracks.items
          let tracks_arr = []
          if (tracksItems) {
              tracksItems.map((tracksItem)=>{
              let trackObj = {}
              trackObj['label'] = tracksItem.track.name
              trackObj['value'] = tracksItem.track.id
              tracks_arr.push(trackObj)
            })
          }
          setSelectedPlaylistTracks(tracks_arr)
          // return tracks_arr;
          // console.log(tracks_arr);
          handleSelectedPlaylistTracks(tracks_arr)
      }) 
      .catch((err)=>{console.log(err)})
    }
    

  };

  function handleSelectedPlaylistTracks(tracks){
    let playlist = tracks
    let tracks_arr = []
    playlist.map((trackObj)=>{
      tracks_arr.push(trackObj.value)
    })
    console.log(tracks_arr.join());
    getAudioAnalysis(token,tracks_arr.join())
  }

  const getAudioAnalysis = async (token,trackIDs) => {

      const data = await audioAnalysisMulti(token,trackIDs)
      .then((info)=>{
        setAudioAnalysis(info.audio_features)
      }) 
      .catch((err)=>{console.log(err)})
    
  };

  function getPlaylistTracks(data) {

    handleUserPlaylistTracks(token,data.value)

  }
  const getName = async (token) => {
    const data = await getUserName(token)
    .then((info)=>{
      setUserName(info.display_name)
    }) 
    .catch((err)=>{console.log(err)})

  }

  useEffect(()=>{

    const token = localStorage.getItem("access_token")
    
    if (token) {

      updateToken()
      .then(()=>{

        setToken(token)
        handleTopTracks(token,timeRangeTrack)
        handleTopArtists(token,timeRangeTrack)
        // handleCurrentPlaying(token)
        isLoaded(true)
        handleUserPlaylist(token)
        // handleUserPlaylistTracks(token,selectedPlaylist.value)
        getName(token)
        if (selectedPlaylistTracks) {
          console.log("in");
          handleSelectedPlaylistTracks
        }
        

        setTimeout(()=>{
          setUpdateFlag(!updateFlag)
          console.log("Pending Token Update !");
        },15*60*1000)
      })


    }
   
  },[updateFlag,timeRangeTrack,selectedPlaylist])

  return <>

      {loaded ? (
      
        <div className={MainStyles.outerContainer}>
          <div className={MainStyles.logout}>
            <Button variant="success" onClick={logout}>Logout</Button>
          </div>
          <div className={MainStyles.welcome}>
            <div className={MainStyles.hello}>Hello, {userName}</div>
          </div>
          <div className={MainStyles.stats}>
            <div className={MainStyles.timeRange}>Set Time Range Filter:</div>
            <div className={MainStyles.filter}>
              <label className=''>
              <input type="radio" onChange={e => setTimeRangeTrack(e.target.value)} name="time_range" value="short_term" className=""/> Last Month
              </label>
              <label className=''>
              <input type="radio" onChange={e => setTimeRangeTrack(e.target.value)} name="time_range" value="medium_term" className=""/> Last 6 Months
              </label>
              <label className=''>
              <input type="radio" onChange={e => setTimeRangeTrack(e.target.value)} name="time_range" value="long_term" className=""/> All Time
              </label>
            </div>
          </div>

          {timeRangeTrack ? 
          (<div>
            <div className={MainStyles.header}>
              Top User Tracks
            </div>
            <Row>
              {
                topTracks && (topTracks.map((data, i) => {
                  return <TopTrack data={data} key={i} selectedTrack={selectedTrack}/>;
                  })
                )
              }
            </Row>
            <div className={MainStyles.header}>
              Top User Artists
            </div>
            <Row>
              {
                topArtists && (topArtists.map((data, i) => {
                  return <TopArtist data={data} key={i}/>;
                  })
                )
              }      
            </Row>
            <Player accessToken={token} trackUri={currentPlaying}/>

            <div>
                <Select options={playlists} onChange={getPlaylistTracks}/>
            </div>

            {selectedPlaylistTracks ? (<div>
                  <Select options={selectedPlaylistTracks}/>
            </div>) : ""}
          
          </div>) : ""
          }
    </div>

      ) : <Loading />}

      }

    </>;
};

export default Home;
