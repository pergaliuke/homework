import './App.css';
import React, {useEffect, useState, useRef} from "react";

function AutoOption(props) {
  const vote = props.movie.vote_average
      && props.movie.vote_average.toFixed(1);
  const releaseYear = props.movie.release_date
      && props.movie.release_date.substring(0, 4);
  return <div
      onClick={props.onClick}
      className="option"
      tabIndex="0"
  >
    <span className="title">{props.movie.title}</span>
    <span
        className="info">{vote} Rating, {releaseYear}</span>
  </div>;
}

function Auto() {
  const [display, setDisplay] = useState(false);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    setOptions([]);
    if (search.length >= 3) {
      fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=cbb9f33fb3bccab1df539678be3d1d2d&language=en-US&query=${search}`)
      .then(response => response.json())
      .then(data => {
        setOptions(data.results.slice(0, 8));
      });

    }
  }, [search]);

  useEffect(() => {
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleClickOutside = event => {
    const {current: wrap} = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplay(false);
    }
  };

  const updateMovieDex = movieTitle => {
    setSearch(movieTitle);
    setDisplay(false);
  };

  return (
      <div ref={wrapperRef} className="toolbar">
        <input
            className="search-input"
            id="auto"
            onClick={() => setDisplay(!display)}
            placeholder="Enter movie name"
            value={search}
            autoComplete="off"
            onChange={event => setSearch(event.target.value)}
        />
        <button className="search-button" aria-label="search">
          <svg width="40" height="40" viewBox="0 0 92 92"
               xmlns="http://www.w3.org/2000/svg">
            <path
                d="M20.8 39.27c0-11.016 8.808-19.976 19.637-19.976 10.827 0 19.635 8.96 19.635 19.972 0 11.014-8.808 19.976-19.635 19.976-10.83 0-19.64-8.96-19.64-19.976zm55.472 32.037l-15.976-16.25c3.357-4.363 5.376-9.835 5.376-15.788 0-14.16-11.32-25.67-25.232-25.67-13.923 0-25.24 11.51-25.24 25.67s11.32 25.67 25.237 25.67c4.776 0 9.227-1.388 13.04-3.74L69.84 77.85c1.77 1.8 4.664 1.8 6.432 0 1.77-1.8 1.77-4.744 0-6.544z"
                fill="currentColor"/>
          </svg>
        </button>
        {display && options && (
            <div className="autoContainer">
              <div key="search"
                   className="option"
              >
                <span className="title">{search}</span>
                <span
                    className="info">Enter a movie name</span>
              </div>
              {
                options.map((movie, i) => {
                  return (
                      <AutoOption key={i}
                                  onClick={() => updateMovieDex(movie.title)}
                                  movie={movie}/>
                  )
                })
              }
            </div>
        )}
      </div>
  );
}

function App() {
  return (
      <div className="App">
        <Auto/>
      </div>
  );
}

export default App;
