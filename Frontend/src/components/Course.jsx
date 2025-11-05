import { useParams } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { useNavigate } from "react-router";

const Course = () => {
  const { courseId } = useParams();
  const [fullCourse, setFullCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      try {
        const res = await axios.get("https://ai-course-builder-backend-xpe2.onrender.com/getCourseContent", {
          params: { courseId },
          withCredentials: true,
        });
        console.log(res.data);
        setFullCourse(res.data);
      } catch (err) {
        console.log(err);
        if (err.response.data == "Please login to access this resource")
          navigate("/");
      }
    };
    fetchCourse();
  }, [courseId]);

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col items-center py-5 px-10">
      {fullCourse ? (
        <div>
          <h1 className="text-3xl mb-5 font-bold">{fullCourse.courseName}</h1>

          {fullCourse.lessons.map((lesson, index2) => (
            <div key={index2} className="mb-6">
              <h2 className="text-xl mb-2 font-semibold">{lesson.title}</h2>
              <Markdown>{lesson.content}</Markdown>

              <div className="mt-5 flex gap-5">
                {lesson.videoIds.map((videoId, index3) => {
                  return (
                    <iframe
                      key={index3}
                      src={`https://www.youtube.com/embed/${videoId}`}
                      width="420"
                      height="315"
                      allowFullScreen
                    ></iframe>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Course;
