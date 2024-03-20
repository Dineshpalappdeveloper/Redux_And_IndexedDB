import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import {
  addStudent,
  deleteStudent,
  updateStudent,
} from "../app/slice/studentSlice";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const heads = [
  {
    key: 0,
    label: "Student Name",
  },
  {
    key: 1,
    label: "Roll Number",
  },
  {
    key: 2,
    label: "Batch",
  },
  {
    key: 3,
    label: "Location",
  },

  {
    key: 4,
    label: "Enenvironment id",
  },
  {
    key: 5,
    label: "Action",
  },
];
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Student = () => {
  const [open, setOpen] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const students = useSelector((state) => state.student.students);
  const dispatch = useDispatch();
  const [student, setStudent] = useState({
    name: null,
    rollnumber: null,
    location: null,
    batch: null,
    enid: null,
  });
  console.log(students, "userData");

  const onchangeHandle = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
    setStudent({});
  };
  const handleCloseeditDialog = () => {
    setEditDialog(false);
    setStudent({});
  };
  const handleOpenEditDialog = (item) => {
    setStudent(item);
    setEditDialog(true);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();

    // check uniqe id
    const idExists = students.some(
      (studentid) => studentid.enid === student.enid
    );
    if (idExists) {
      toast.error("Enenvironment id Aready Edits");
    } else {
      dispatch(addStudent(student));
      setOpen(false);
      setStudent({});
      toast.success("Student Added");
    }

    console.log(idExists, "studentid");
  };
  const onSubmitData = (e) => {
    e.preventDefault();
    dispatch(updateStudent(student));
    setEditDialog(false);
    toast.success("Data Updated");
  };
  const deleteStudentById = (id) => {
    console.log(id, "delete");
    dispatch(deleteStudent(id));
    toast.success("Student Deleted");
  };

  return (
    <div>
      <div className="">
        <h1 class="text-3xl font-bold  p-4 bg-green-50 text-center">
          <span className="text-red-700">
            Crud Operation useing Redux-toolkit and React js
          </span>
        </h1>
        <h1 class="text-3xl font-bold  p-4 bg-red-50 text-center">
          Student Details
        </h1>
        <div className="flex justify-between mx-5 p-4">
          <Button
            variant="outlined"
            className="captilize m-2 p-4"
            sx={{ textTransform: "capitalize" }}
          >
            <NavLink to="/db" className="">
              IndexedDb With React js
            </NavLink>
          </Button>
          <Button
            variant="outlined"
            className="captilize m-2 p-4"
            sx={{ textTransform: "capitalize" }}
          >
            <NavLink to="/simple" className="">
              simple
            </NavLink>
          </Button>
          <Button
            variant="contained"
            className="captilize"
            size="small"
            sx={{ textTransform: "capitalize" }}
            onClick={() => setOpen(true)}
          >
            Add Student
          </Button>
        </div>
        <div>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              className="text-center"
              size="small"
            >
              <TableHead>
                <TableRow>
                  {heads &&
                    heads.map((item, index) => {
                      return <TableCell key={index}>{item.label}</TableCell>;
                    })}
                </TableRow>
              </TableHead>

              <TableBody>
                {/* no data found */}
                {students.length < 1 ? (
                  <TableCell colSpan={6}>
                    <h1 className="text-center">No Data Found</h1>
                  </TableCell>
                ) : (
                  ""
                )}
                {/* if data found */}
                {students.length > 0 &&
                  students.map((item, index) => {
                    return (
                      <TableRow
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        key={index}
                      >
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.rollnumber}</TableCell>
                        <TableCell>{item.batch}</TableCell>

                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.enid}</TableCell>
                        <TableCell>
                          {" "}
                          <IconButton
                            aria-label="delete"
                            size="large"
                            type="button"
                            onClick={() => deleteStudentById(item.enid)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpenEditDialog(item)}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div>
        {/* add Student dialog  */}
        <BootstrapDialog
          onClose={handleClose}
          sx={{ minWidth: 650 }}
          fullWidth
          maxWidth="xs"
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Student Details
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <form onSubmit={handleAddStudent}>
              <TextField
                id="outlined-basic"
                required
                margin="dense"
                value={student.name}
                label="Student Name"
                name="name"
                variant="outlined"
                fullWidth
                onChange={onchangeHandle}
              />
              <TextField
                id="outlined-basic"
                required
                margin="dense"
                value={student.rollnumber}
                label="Roll Number"
                name="rollnumber"
                variant="outlined"
                fullWidth
                onChange={onchangeHandle}
              />
              <TextField
                id="outlined-basic"
                required
                margin="dense"
                value={student.batch}
                label="Batch"
                name="batch"
                variant="outlined"
                fullWidth
                onChange={onchangeHandle}
              />

              <TextField
                id="outlined-basic"
                required
                margin="dense"
                value={student.enid}
                label="Enenvironment id"
                name="enid"
                type="number"
                variant="outlined"
                fullWidth
                onChange={onchangeHandle}
              />

              <TextField
                id="outlined-basic"
                required
                margin="dense"
                value={student.location}
                label="Location"
                name="location"
                variant="outlined"
                fullWidth
                onChange={onchangeHandle}
              />
              <div className="text-center my-5 rounded-full">
                <Button variant="contained" type="submit">
                  Add Student
                </Button>
              </div>
            </form>
          </DialogContent>
        </BootstrapDialog>
        {/* add Student dialog  */}
        {/* edit Student  dialog  */}
        <BootstrapDialog
          onClose={handleCloseeditDialog}
          sx={{ minWidth: 650 }}
          fullWidth
          maxWidth="xs"
          aria-labelledby="customized-dialog-title"
          open={editDialog}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Student Details
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseeditDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <form onSubmit={onSubmitData}>
              <TextField
                id="outlined-basic"
                required
                margin="dense"
                value={student.name}
                label="Student Name"
                name="name"
                variant="outlined"
                fullWidth
                onChange={onchangeHandle}
              />
              <TextField
                id="outlined-basic"
                required
                margin="dense"
                value={student.rollnumber}
                label="Roll Number"
                name="rollnumber"
                variant="outlined"
                fullWidth
                onChange={onchangeHandle}
              />
              <TextField
                id="outlined-basic"
                required
                margin="dense"
                value={student.batch}
                label="Batch"
                name="batch"
                variant="outlined"
                fullWidth
                onChange={onchangeHandle}
              />

              <TextField
                id="outlined-basic"
                required
                margin="dense"
                value={student.enid}
                disabled
                label="Enenvironment id"
                name="enid"
                type="number"
                variant="outlined"
                fullWidth
                onChange={onchangeHandle}
              />

              <TextField
                id="outlined-basic"
                required
                margin="dense"
                value={student.location}
                label="Location"
                name="location"
                variant="outlined"
                fullWidth
                onChange={onchangeHandle}
              />
              <div className="text-center my-5 rounded-full">
                <Button variant="contained" type="submit">
                  Update Now
                </Button>
              </div>
            </form>
          </DialogContent>
        </BootstrapDialog>
        {/* edit Student dialog  */}
      </div>
    </div>
  );
};

export default Student;
