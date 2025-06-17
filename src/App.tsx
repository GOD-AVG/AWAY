import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LogoPage from "./components/logopage";
import AuthPage from "./components/authpage";
import HomePage from "./components/homepage";
import ProfilePage from "./components/ProfilePage";
import StatusPage from "./components/statuspage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogoPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/status" element={<StatusPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
