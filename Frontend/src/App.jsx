import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home";
import MyCourses from "./components/MyCourses";
import Course from "./components/Course";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myCourses" element={<MyCourses />} />
          <Route path="/myCourses/:courseId" element={<Course />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
