import { PayloadAction, createSlice} from '@reduxjs/toolkit'
import { RootState } from './store'


// Define a type for the slice state
interface UserState {
  user: any
}

// Define the initial state using that type
const initialState: UserState = {
  user:{

  }
}



export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions
export const selectCount = (state: RootState) => state.user.user
export default userSlice.reducer