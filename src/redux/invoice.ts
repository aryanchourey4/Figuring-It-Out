import { PayloadAction, createSlice} from '@reduxjs/toolkit'
import { RootState } from './store'


// Define a type for the slice state
interface UserState {
  value: any
}

// Define the initial state using that type
const initialState: UserState = {
  value: {
    
  }
}



export const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoice: (state, action: PayloadAction<any>) => {
      state.value = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setInvoice } = invoiceSlice.actions
export const selectCount = (state: RootState) => state.invoice.value
export default invoiceSlice.reducer