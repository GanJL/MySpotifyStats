import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import MainStyles from '../styles/Main.module.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const TopArtist = ({data}) => {

  function listGenres(genres) {
    let output = ""
    genres.map((genre,i)=>{

      if (genres.length>0) {
        if (genres.length-1 == i){
          output += genre
        }
        else {
          output += genre + ", "
        }
        
      }
      else {
        output += genre
      }
      
    })
    
    return output.toUpperCase()
  }

  function processFollowers(num) {

    if (num > 99999){
      let million = Math.floor(num / 1000000)

      let h_thousand = Math.floor((num%(million*1000000)) / 1000)
      
      let output = million + '.' + h_thousand +' million'

      return output 
    }
    else {

      let t_thousand = Math.floor(num / 1000)

      let thousand = num%(t_thousand*1000)
      
      let output = t_thousand + '.' + thousand +' k'

      return output 
    }
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
    <Card style={{ width: '21.5rem', fontSize: '0.9rem', height: '44rem', marginBottom: '10px' }}>
        <Card.Img variant="top" src={data.images[1].url} />

        <Card.Body>
          <Card.Title>Artist Information</Card.Title>
          <ListGroup className="list-group-flush">
            <ListGroupItem>Name: {data.name}</ListGroupItem>
            <ListGroupItem>Genres: {listGenres(data.genres)}</ListGroupItem>
            <ListGroupItem>Number of Followers: {processFollowers(data.followers.total)}</ListGroupItem>
            <ListGroupItem>Artist Popularity in Spotify: {popularityProcess(data.popularity)}</ListGroupItem>
          </ListGroup>
        </Card.Body>

        <Card.Body>

          <div className={MainStyles.btnBox2}>
            <div className={MainStyles.btnSpace}>
            <a href={data.external_urls.spotify} className={MainStyles.removeUnderline} target={"_blank"}>
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
