import { createSlice } from "@reduxjs/toolkit"


const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notificationChange(state, action) {
      const { payload } = action
      return payload
    }
  }
})

export const setNotification = (content, time) => {
  return async dispatch => {
    dispatch(notificationChange(content))
    setTimeout(() => {
      dispatch(notificationChange(''))
    }, time * 1000)
  }
}


export const { notificationChange } = notificationSlice.actions
export default notificationSlice.reducer