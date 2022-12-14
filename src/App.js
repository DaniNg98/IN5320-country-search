import React, { useState, useEffect } from 'react';
import './App.css';
import Table from './Table.js';
import Search from './Search.js';
import PageSize from './PageSize.js';
import Pagination from './Pagination.js';

function App() {
  /* Create state:
        - apiData: List containing dictionaries of countries from API.
        - searchQuery: The query parameter that should be added to &search=
        - pageNumber: The page that is requested
  */

  const [apiData, setApiData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(); // Default = No search query
  const [pageNumber, setPageNumber] = useState(1); //Default = Page 1
  const [pageSize, setPageSize] = useState(10);
  const [lastPage, setLastPage] = useState();
  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);

  useEffect(() => {
    // All parameters are appended to this URL.
    let apiQuery = 'https://dhis2-app-course.ifi.uio.no/api?';

    if (pageNumber == 1) {
      setDisablePrev(true);
    } else {
      setDisablePrev(false);
    }

    if (pageNumber == lastPage) {
      setDisableNext(true);
    } else {
      setDisableNext(false);
    }

    // If searchQuery isn't empty add &search=searchQuery to the API request.
    if (searchQuery) {
      apiQuery = apiQuery + '&search=' + searchQuery;
    }

    // Add what page we are requesting to the API request.
    apiQuery = apiQuery + '&page=' + pageNumber;

    // Choose page size
    apiQuery = apiQuery + '&pageSize=' + pageSize;

    // Query data from API.
    console.log('Querying: ' + apiQuery);
    fetch(apiQuery)
      .then((results) => results.json())
      .then((data) => {
        // Then add response to state.
        setApiData(data);
        setLastPage(data.pager.pageCount);
      });
  }, [searchQuery, pageNumber, pageSize]); // Array containing which state changes that should re-reun useEffect()

  return (
    <div className='App'>
      <h1>Country lookup</h1>
      <Search setSearchQuery={setSearchQuery} />
      <Table apiData={apiData} />
      <Pagination
        apiData={apiData}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        disablePrev={disablePrev}
        disableNext={disableNext}
        setLastPage={setLastPage}
        lastPage={lastPage}
      />
      <PageSize setPageSize={setPageSize} />
    </div>
  );
}

export default App;
