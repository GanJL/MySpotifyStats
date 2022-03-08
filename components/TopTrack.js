import { useEffect, useState } from 'react'
import { round } from 'react-spotify-web-playback/lib/utils'
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import MainStyles from '../styles/Main.module.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const TopTrack = ({data, selectedTrack}) => {
 
  const [numFlag, setNumFlag] = useState(false)

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  function listArtists(data) {
    let output = ""
    let artists = data.artists
    artists.map((artist,i)=>{
      if (i>0) {
        output += artist.name + ", "
        setNumFlag(true)
      }
      else {
        output += artist.name
      }
      
    })
    
    return output
  }

  function getDaysSince(date) {

    let release_date = new Date(date)
    let today_date = new Date()
    let diffTime = Math.abs(today_date - release_date);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    let output = ""
    if (diffDays > 365) {

      let years = Math.floor(diffDays/365);
      let months = Math.floor(years*365%12);
      output = years + ' years ' + months + ' months'
    }
    else {
      let months = Math.floor(diffDays/30);
      output = months + ' months'
    }

    return output
 

  }

  function popularityProcess(num) {

    let output = ''
    if (num <= 20) {
      output = 'Very Low'
    }
    else if (num <= 40) {
      output = 'Low'
    }
    else if (num <= 60) {
      output = 'Moderate'
    }
    else if (num <= 80) {
      output = 'High'
    }
    else {
      output = 'Very High'
    }

    return output + ' (' + num + '/100)'
    
  }


  return (
    <Col>
      <Card style={{ width: '21.5rem', fontSize: '0.9rem', height: '95vh' }}>
        <Card.Img variant="top" src={data.album.images[1].url} />

        <Card.Body>
          <Card.Title>Track Information</Card.Title>
          <ListGroup className="list-group-flush">
            <ListGroupItem>Name: {data.name}</ListGroupItem>
            <ListGroupItem>{numFlag ? (<span>Artist Names: </span> ) : (<span>Artist Name: </span> )}{listArtists(data)}</ListGroupItem>
            <ListGroupItem>Length: {millisToMinutesAndSeconds(data.duration_ms)}</ListGroupItem>
            <ListGroupItem>Popularity in Spotify: {popularityProcess(data.popularity)}</ListGroupItem>
          </ListGroup>
        </Card.Body>

        <Card.Body>
          <Card.Title>Album Information</Card.Title>
          <ListGroup className="list-group-flush">
            <ListGroupItem><div className={MainStyles.hide}>Name: {data.album.name}</div></ListGroupItem>
            <ListGroupItem>Release Date: {data.album.release_date}</ListGroupItem>
            <ListGroupItem>Time Since Release: {getDaysSince(data.album.release_date)}</ListGroupItem>
            <ListGroupItem>Number of Tracks in Album: {data.album.total_tracks}</ListGroupItem>
            
          </ListGroup>
        </Card.Body>

        <Card.Body>
          {/* <Card.Link href="#"> */}

          <div className={MainStyles.btnBox1}>
            <div className={MainStyles.btnSpace}>
            <a className={MainStyles.removeUnderline} onClick={e=>selectedTrack(e,data.uri)} href=''>
              <div className={MainStyles.btn}>
              Listen Here
              </div>
            </a>
            </div>
            <div className={MainStyles.btnSpace}>
              <a className={MainStyles.removeUnderline} href={data.external_urls.spotify} target={"_blank"}>    
                <div className={MainStyles.btn}>
                  Listen on App     
                </div>
              </a>
            </div>
          </div>

  
        </Card.Body>
      </Card>
      
    </Col>
    
  )
}
