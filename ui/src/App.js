import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React,{useState, useEffect} from 'react'; 

function App() {
  const [comments,setComments]=useState([]);
  const [token, setToken]=useState("initial");

  useEffect(() => {
    fetchComments();
  }, []);  

  const fetchComments=async ()=>{
    // const response=await Axios('https://zoom-on-air-new-monicat11.vercel.app/api/meeting');
  //   axios.get('http://localhost:3001/test').then(
  //     console.log("res.data")
  // );
  const response=await axios.get('/api/test');
  console.log(response.data);
}

  function handleChange(e){
    setToken(e.target.value);
    console.log("token");
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <form>
          <label>
            Name:
            <input type="text" name="name" onClick={(evt) => this.handleChange(evt)} />
          </label>
          <input type="submit" value="Submit" />        
        </form> */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
