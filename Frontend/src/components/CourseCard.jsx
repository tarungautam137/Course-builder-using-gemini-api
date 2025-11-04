import { useNavigate } from "react-router";

const CourseCard = ({ courseId, courseName }) => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-sky-500 px-5 py-2 rounded-lg hover:bg-sky-600 cursor-pointer"
      onClick={() => navigate(`/myCourses/${courseId}`)}
    >
      {courseName}
    </div>
  );
};

export default CourseCard;
