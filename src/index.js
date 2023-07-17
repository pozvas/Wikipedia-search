import axios from "axios";
import fetchJsonp from "fetch-jsonp";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import * as React from "react"
import * as ReactDOM from "react-dom/client"



class WikiSearch {
  data = []
  input = ''
  constructor(){
    makeObservable(this, {
      data: observable,
      input: observable,
      records: computed,
      Fetch: action
    })
  }
  get records(){
    return this.data.map((el) => (
      <a href={el.src}>
        <h5>{el.name}</h5>
      </a>
    )) 
  }
  Fetch(){
    if (!document.getElementById("in").value){
      this.data = []
      return
    }
    axios({
      method: 'get',
      url: "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + document.getElementById("in").value + '&limit=10',
      responseType: 'json'
    })
    .then((json) => {
      console.log(json)
      runInAction(() =>{
        this.data = json.data[1].map((el, i) =>({name: json.data[1][i], src: json.data[3][i]}))
      })
    })
    .catch(error => alert(error.message))
  }
}

const wikiSearch = new WikiSearch()

const App = observer(() => (
  <div>
    <input id="in" onKeyDown={(e) => {
      if(e.key === 'Enter')
        wikiSearch.Fetch()}}>
        </input>
    <button onClick={() => {wikiSearch.Fetch()}}> Search</button>
    <div className="container searchResultsShow">
      {wikiSearch.records}
    </div>
  </div>
))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App/>
);


