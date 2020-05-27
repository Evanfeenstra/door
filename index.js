import React, {useState, useContext, useEffect} from 'react'

const door = React.createContext({})

const localStorageKey = '_door'

function useDoor(){
  var ctx = useContext(door)
  return ctx||{}
}

function createActions(actions, theDoor){
  if(typeof actions!=='object') return {}
  var r = {}
  for (const key in actions) {
    let value = actions[key]
    if(typeof value!=='function') continue
    if (actions.hasOwnProperty(key)) {
      r[key] = function() {
        const args = arguments||[]
        return value(...args,theDoor)
      } 
    }
  }
  return r
}

function DoorProvider(props){

  const [store,setStore] = useState({})
  const [state,setState] = useState({})

  function setTheState(a){
    if(typeof a!=='object') return
    setState(current=>{
      return {...current,...a}
    })
  }
  function setTheStore(a){
    if(typeof a!=='object') return
    setStore(current=>{
      let newStore = {...current,...a}
      localStorage.setItem(localStorageKey, JSON.stringify(newStore))
      return newStore
    })
  }
  async function hyrdateStore(){
    const theStore = await getStore()
    if(theStore) setStore(theStore)
  }

  useEffect(()=>{
    hyrdateStore()
  }, [])

  const theDoor = {
    ...store,
    ...state,
    setState:setTheState,
    setStore:setTheStore,
  }
  return <door.Provider value={{
    ...theDoor,
    actions: createActions(props.actions, theDoor)
  }}>
    {props.children}
  </door.Provider>
}

export {useDoor, DoorProvider}

export async function getStore(){
  const theStore = await localStorage.getItem(localStorageKey)
  if (theStore) {
    try {
      const parsedStore = JSON.parse(theUI)
      if(parsedStore) return parsedStore
    } catch(e){}
  }
  return {}
}