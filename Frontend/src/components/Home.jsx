import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { Eye, EyeOff, Lock, User, PlayCircle } from "lucide-react";
import { FaRocket } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [topic, setTopic] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [gradientPosition, setGradientPosition] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /*const value = document.cookie.includes("biscuit=");
    setIsLoggedIn(value);*/
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          "https://ai-course-builder-backend-xpe2.onrender.com/me",
          { withCredentials: true }
        );
        if (res.data && res.data.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((p) => (p + 1) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleClick = async (userName, password) => {
    try {
      let res;
      if (isLogin) {
        res = await axios.post(
          "https://ai-course-builder-backend-xpe2.onrender.com/login",
          { userName, password },
          { withCredentials: true }
        );
      } else {
        res = await axios.post(
          "https://ai-course-builder-backend-xpe2.onrender.com/signup",
          { userName, password },
          { withCredentials: true }
        );
      }
      setIsLoggedIn(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleClick(formData.username, formData.password);
  };

  const handleGenerate = async () => {
    try {
      if (!topic.trim()) return;
      setLoading(true);
      const res = await axios.post(
        "https://ai-course-builder-backend-xpe2.onrender.com/generate",
        { query: topic },
        { withCredentials: true }
      );
      console.log("generated successfully");
      navigate("/myCourses");
    } catch (err) {
      console.log("Error is ---> " + err);
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <PlayCircle className="w-6 h-6" />,
      title: "Smart Lesson Generation",
      description: "AI-powered content creation",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Curated Video Content",
      description: "Hand-picked YouTube videos",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "One-Prompt Creation",
      description: "Instant course generation",
    },
  ];

  return (
    <div>
      {!isLoggedIn ? (
        <div
          className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-12"
          style={{
            background: `linear-gradient(${gradientPosition}deg, #0f0c29, #302b63, #24243e)`,
            transition: "background 0.5s ease",
          }}
        >
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-indigo-400 opacity-20 rounded-full animate-pulse"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 5 + 5}s`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>

          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-gray-100">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-white">
                  Transform a single prompt into comprehensive lessons
                </h1>
                <p className="text-lg text-gray-300 leading-relaxed">
                  With curated YouTube videos. Powered by advanced AI to create
                  engaging learning experiences instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="bg-gray-800 bg-opacity-60 backdrop-blur-md rounded-lg p-6 shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300"
                  >
                    <div className="text-indigo-400 mb-4">{f.icon}</div>
                    <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-400">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {isLogin ? "Welcome Back" : "Create your account"}
                </h2>
                <p className="text-gray-400 mt-2">
                  {isLogin
                    ? "Sign in to continue creating courses"
                    : "Sign up to start building courses"}
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Enter your username"
                      className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full bg-gray-900 text-white pl-10 pr-12 py-3 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}{" "}
                  <button
                    onClick={() => setIsLogin((s) => !s)}
                    className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center py-10 gap-12">
          <button
            className="absolute top-10 left-10 p-3 bg-sky-600 rounded-lg hover:bg-sky-700 font-semibold text-lg"
            onClick={() => navigate("/myCourses")}
          >
            My Courses
          </button>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-sky-400 flex items-center gap-3">
            <FaRocket className="animate-bounce" /> Course Generator
          </h1>

          <p className="text-gray-300 text-lg sm:text-xl text-center max-w-md">
            Course generation may take 2-3 minutes. Sit back and relax while AI
            creates your content.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg items-center">
            <input
              type="text"
              placeholder="Enter Topic Here..."
              className="flex-1 border border-white rounded-lg p-4 outline-none text-lg"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
            />
            <button
              className="p-4 w-full sm:w-fit bg-sky-600 cursor-pointer rounded-lg hover:bg-sky-700 font-semibold text-lg transition-all duration-300"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <span className="loader border-t-4 border-b-4 border-white w-5 h-5 rounded-full animate-spin"></span>
                  Generating...
                </span>
              ) : (
                "Generate"
              )}
            </button>
          </div>

          <style>{`
.loader {
border-left-color: transparent;
border-right-color: transparent;
}
`}</style>
        </div>
      )}
    </div>
  );
};

export default Home;
