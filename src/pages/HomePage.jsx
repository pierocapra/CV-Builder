// HomePage.jsx
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl bg-white shadow-xl rounded-2xl p-10 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to CV Builder</h2>
          <p className="text-gray-600 mb-6 text-lg">
            Build, personalize, and download your resume with ease. 
            Save your data securely and access your CV anytime.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link
              to="/login"
              className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 transition rounded-full text-lg"
            >
              Login & Save Progress
            </Link>
            <Link
              to="/cv-editor"
              className="px-6 py-3 text-blue-600 border border-blue-600 hover:bg-blue-50 transition rounded-full text-lg"
            >
              Try Without Saving
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
