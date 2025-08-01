
import './App.css'
import {FormControl, InputGroup, Container, Button} from "react-bootstrap";
import {useState, useEffect} from "react";


const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

console.log('Client ID:', clientId);
console.log('Client Secret:', clientSecret);

function App() {
  
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let authParms = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
      };

      fetch("https://accounts.spotify.com/api/token", authParms)
      .then((response) => response.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  async function search() {
    let artistParamas = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    const artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      artistParamas
    )
    .then((result ) => result.json())
    .then((data) => {
        return data.artists.items[0].id;
      });
    
    await fetch(
      "https://api.spotify.com/v1/artists/" + artistID + "/albums?include_groups=album,single&limit=50",
      artistParamas
    )
    .then((result) => result.json())
    .then((data) => {
        setAlbums(data.items);
      });

    console.log("Search Input: " + searchInput);
    console.log("Artist ID: " + artistID);
    console.log("Albums: ", albums);
  }

  return (
    <Container>
    <InputGroup>
      <FormControl
        placeholder="Search For Artist"
        type="input"
        aria-label="Search for an Artist"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            search();
          } // search function
        }}
        onChange={(event) => setSearchInput(event.target.value)} // setSearch
        style={{
          width: "300px",
          height: "35px",
          borderWidth: "0px",
          borderStyle: "solid",
          borderRadius: "5px",
          marginRight: "10px",
          paddingLeft: "10px",
        }}
      />
      // search function
      <Button onClick={search}>Search</Button>
    </InputGroup>
  </Container>
  );
}

export default App
