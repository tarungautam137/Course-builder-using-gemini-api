import { BrowserRouter, Routes, Route, HashRouter } from "react-router";
import Home from "./components/Home";
import MyCourses from "./components/MyCourses";
import Course from "./components/Course";

const App = () => {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myCourses" element={<MyCourses />} />
          <Route path="/myCourses/:courseId" element={<Course />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
