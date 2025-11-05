import { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "./CourseCard";

const MyCourses = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const func = async () => {
      try {
        const res = await axios.get("https://ai-course-builder-backend-xpe2.onrender.com/getAllCourses", {
          withCredentials: true,
        });
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    func();
  }, []);

  return (
    <div className="flex flex-col items-center py-10 h-screen w-full bg-black text-white">
      {data ? (
        <div className="flex flex-col gap-5">
          {data.map((courseObj, index) => {
            return (
              <CourseCard
                key={index}
                courseId={courseObj._id}
                courseName={courseObj.courseName}
              />
            );
          })}
        </div>
      ) : (
        <div>Loading....</div>
      )}
    </div>
  );
};

export default MyCourses;
