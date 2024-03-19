// reducers/studentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [],
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    addStudent: (state, action) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action) => {
      console.log(action, "action");
      state.students = state.students.map((item) => {
        if (item.enid === action.payload.enid) return action.payload;
        return item;
      });
    },
    deleteStudent: (state, action) => {
      state.students = state.students.filter(
        (student) => student.enid !== action.payload
      );
    },
    // Add reducers for updating and reading students if needed
  },
});

export const { addStudent, deleteStudent, updateStudent } =
  studentSlice.actions;
export default studentSlice.reducer;
