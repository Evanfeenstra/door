# door

### usage
```jsx
import {DoorProvider} from 'door'
import * as actions from './actions'

function App(){
    return <DoorProvider actions={actions}>
        {/* YOUR APP HERE */}
    </DoorProvider>
}
```

### actions
`door` is injected as the last argument in each "action", with two methods:
- `door.setState`: set state into the context
- `door.setStore`: set state that is persisted to localStorage
```js
export function login(username, password, door) {
    try {
        const user = await axios.pos('/loginroute', {username,password})
        door.setState({user})
    }
}

// you can call the actions with simply:
// login(username,password)
```

### accessing state

every property you set into state or store can be accessed with useDoor

```js
import {useDoor} from 'door'

function MyUserComponent(){
    const door = useDoor()
    const {user,setState} = door
    return <div>

        <span>{user.name}</span>

        <button onClick={()=>setState({user:null})}>
            click to logout
        </button>
        
    </div>
}
```