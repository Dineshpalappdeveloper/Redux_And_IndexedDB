import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
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
import { STUDENT_DATA } from "../app/data/data";

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

  // {
  //   key: 5,
  //   label: "Action",
  // },
];
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;
const connectIndexedDb = () => {
  if (!indexedDB) {
    console.log("IndexedDb Not supported in this Browser");
  } else {
    const request = indexedDB.open("students", 1);
    console.log("welcome in indexedDb");
    // if error then
    request.onerror = function (event) {
      console.error("An error occurred with IndexedDB");
      console.error(event);
    };
    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains("studentData")) {
        const objectStore = db.createObjectStore("studentData", {
          keyPath: "id",
        });

        // objectStore.createIndex("name", "name", {
        //   unique: false,
        // });
      }
    };
    request.onsuccess = () => {
      console.log("Database opened successfully");

      const db = request.result;

      // var tx = db.transaction("studentData", "readwrite");

      // return tx.complete;
    };
  }
};
const ReactWithIndexed = () => {
  const [open, setOpen] = useState(false);
  const [allstudent, setAllStudent] = useState([]);
  const [student, setStudent] = useState({
    name: null,
    rollnumber: null,
    location: null,
    batch: null,
    id: null,
  });
  useEffect(() => {
    connectIndexedDb();
    getAllStudent();
  }, []);

  console.log(allstudent, "allstudent");

  const onchangeHandle = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };
  //   const handleClickOpen = (item) => {
  //     setOpen(true);
  //     setStudent(item);
  //   };
  const handleClose = () => {
    setOpen(false);
    setStudent({});
  };
  const handleCloseeditDialog = () => {
    // setEditDialog(false);
    setStudent({});
  };
  const handleOpenEditDialog = (item) => {
    setStudent(item);
    setOpen(true);
    // setEditDialog(true);
  };
  // for finfing greatest id
  function findGreatestId(array) {
    if (array.length === 0) {
      return null; // Return null if the array is empty
    }

    let greatestId = array[0].id;

    for (let i = 1; i < array.length; i++) {
      if (array[i].id > greatestId) {
        greatestId = array[i].id;
      }
    }

    // Return the greatest id
    return greatestId;
  }

  const handleaAddStudent = (e) => {
    e.preventDefault();
    let newid = findGreatestId(allstudent) + 1;
    const dbPromise = indexedDB.open("students", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("studentData", "readwrite");
      const studentData = tx.objectStore("studentData");
      const studentInformation = studentData.put({
        id: newid,
        name: student?.name,
        rollnumber: student?.rollnumber,
        location: student?.location,
        batch: student?.batch,
      });

      studentInformation.onsuccess = () => {
        tx.oncomplete = () => {
          db.close();
        };
        alert("student Added");
      };
      studentInformation.onerror = (event) => {
        console.log(event);
        alert("error geting when adding student");
      };
    };

    // check uniqe id
    // const idExists = students.some(
    //   (studentid) => studentid.enid === student.enid
    // );
    // if (idExists) {
    //   alert("Enenvironment id Aready Edits");
    // } else {
    //   // dispatch(addStudent(student));
    //   setOpen(false);
    //   setStudent({});
    // }

    // console.log(idExists, "studentid");
  };
  const onSubmitData = (e) => {
    e.preventDefault();
    // dispatch(updateStudent(student));
    // setEditDialog(false);
  };
  const deleteStudentById = (id) => {
    console.log(id, "delete");
    // dispatch(deleteStudent(id));
  };
  const getAllStudent = () => {
    const dbPromise = indexedDB.open("students", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("studentData", "readwrite");
      const studentData = tx.objectStore("studentData");
      const studentInformation = studentData.getAll();

      studentInformation.onsuccess = (query) => {
        setAllStudent(query.srcElement.result);
      };
      tx.oncomplete = () => {
        db.close();
      };
      studentInformation.onerror = (event) => {
        console.log(event);
        alert("error geting when loading student initial data");
      };
    };
  };
  return (
    <div>
      <div>
        <div className="">
          <h1 class="text-3xl font-bold  p-4 bg-green-50 text-center">
            <span className="text-red-700">
              Crud Operation useing IndexedDb and React js
            </span>
          </h1>
          <h1 class="text-3xl font-bold  p-4 bg-red-50 text-center">
            Student Details
          </h1>
          <div className="flex justify-end p-10">
            <Button
              variant="contained"
              className="captilize"
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
                  {allstudent.length < 1 ? (
                    <TableCell colSpan={6}>
                      <h1 className="text-center">No Data Found</h1>
                    </TableCell>
                  ) : (
                    ""
                  )}
                  {/* if data found */}
                  {allstudent.length > 0 &&
                    allstudent.map((item, index) => {
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
                          {/* <TableCell>
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
                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
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
            <form onSubmit={handleaAddStudent}>
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
                value={student.location}
                label="Location"
                name="location"
                variant="outlined"
                fullWidth
                onChange={onchangeHandle}
              />
              <div className="text-center my-5 rounded-full">
                <Button variant="contained" type="submit">
                  submit
                </Button>
              </div>
            </form>
          </DialogContent>
        </BootstrapDialog>
        {/* add Student dialog  */}
      </div>
    </div>
  );
};

export default ReactWithIndexed;
