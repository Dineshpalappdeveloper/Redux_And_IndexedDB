import React, { useEffect } from "react";
const indexedDB = window.indexedDB;
const connectIndexedDb = () => {
  if (!indexedDB) {
    console.log("IndexedDb Not supported in this Browser");
  } else {
    console.log("welcome in indexedDb");

    const dbName = "studentDatabase";
    const dbVersion = 1;

    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = function (event) {
      console.error("Database error: ", event.target.errorCode);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      const objectStore = db.createObjectStore("students", {
        keyPath: "id",
        autoIncrement: true,
      });

      // Define indexes if needed
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("batch", "batch", { unique: false });
      objectStore.createIndex("rollNumber", "rollNumber", { unique: true });
      objectStore.createIndex("location", "location", { unique: false });
    };

    request.onsuccess = function (event) {
      const db = event.target.result;

      addStudent(db, {
        name: "Dinesh",
        batch: "A",
        rollNumber: "001",
        location: "Bihar",
      });
    };

    function addStudent(db, studentData) {
      const transaction = db.transaction(["students"], "readwrite");
      const objectStore = transaction.objectStore("students");
      const request = objectStore.add(studentData);

      request.onsuccess = function (event) {
        console.log("Student added to the database");
      };

      request.onerror = function (event) {
        console.error(
          "Error adding student to the database: ",
          event.target.errorCode
        );
      };
    }

    function getAllStudents(db) {
      const transaction = db.transaction(["students"], "readonly");
      const objectStore = transaction.objectStore("students");
      const request = objectStore.getAll();

      request.onsuccess = function (event) {
        const students = event.target.result;
        console.log("All students:", students);
      };

      request.onerror = function (event) {
        console.error(
          "Error retrieving students from the database: ",
          event.target.errorCode
        );
      };
    }
    if (false) {
      getAllStudents();
    }
  }
};
const Simple = () => {
  useEffect(() => {
    connectIndexedDb();
  });
  return (
    <div>
      Simple
      <h1>Inspect Window then view database </h1>
    </div>
  );
};

export default Simple;
