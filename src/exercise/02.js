// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import { useState } from 'react';

function useLocalStorageState(key, defaultValue){
  const [state, setState] = React.useState(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }else{
      return defaultValue
    } 
  })
  React.useEffect( ()=>{
    console.log("calling useEffect")
    window.localStorage.setItem(key, JSON.stringify(state))}, [key, state]);
  
  return [state, setState] 
}
function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  console.log("rendering");
  const [name, setName] = useLocalStorageState("name", "");

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  const [count, setCount] = React.useState(0);
  return <><button onClick={() => setCount(count+1)}>{count}</button><Greeting /></>
}

export default App
