import React from "react";
import { Route, Routes } from "react-router-dom";
import Student from "../component/Student";
import ReactWithIndexed from "../component/ReactWithIndexed";
import Simple from "../component/Simple";

const GlobalRouters = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Student />} />
        <Route path="/db" element={<ReactWithIndexed />} />
        <Route path="/simple" element={<Simple />} />
      </Routes>
    </div>
  );
};

export default GlobalRouters;
