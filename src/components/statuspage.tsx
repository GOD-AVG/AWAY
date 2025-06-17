import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/statuspage.css";

interface Status {
  type: "image" | "video";
  url: string;
}

interface Profile {
  username: string;
  profilePic: string;
  statuses: Status[];
}

const StatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewedStatuses, setViewedStatuses] = useState<{ [profileIndex: number]: { [statusIndex: number]: boolean } }>(
    Array.from({ length: 16 }, (_, profileIndex) => ({
      [profileIndex]: Array.from({ length: 3 }, () => false),
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {})
  );
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number | null>(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);

  const profiles: Profile[] = Array.from({ length: 16 }, (_, index) => ({
    username: `user_${index + 1}`,
    profilePic: `https://picsum.photos/50/50?random=${index + 1}`,
    statuses: [
      { type: "image", url: `https://picsum.photos/300/400?random=${index * 3 + 1}` },
      { type: "video", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { type: "image", url: `https://picsum.photos/300/400?random=${index * 3 + 3}` },
    ],
  }));

  const toggleNav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsNavExpanded(!isNavExpanded);
  };

  const openStoryView = (profileIndex: number) => {
    setSelectedProfileIndex(profileIndex);
    setCurrentStatusIndex(0);
    setProgress(0);
  };

  const closeStoryView = () => {
    setSelectedProfileIndex(null);
    setCurrentStatusIndex(0);
    setProgress(0);
  };

  const nextStatus = useCallback(() => {
    if (selectedProfileIndex === null) return;
    const currentProfile = profiles[selectedProfileIndex];
    setViewedStatuses((prev) => ({
      ...prev,
      [selectedProfileIndex]: {
        ...prev[selectedProfileIndex],
        [currentStatusIndex]: true,
      },
    }));

    if (currentStatusIndex < currentProfile.statuses.length - 1) {
      setCurrentStatusIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      const nextProfileIndex = selectedProfileIndex + 1;
      if (nextProfileIndex < profiles.length) {
        setSelectedProfileIndex(nextProfileIndex);
        setCurrentStatusIndex(0);
        setProgress(0);
      } else {
        closeStoryView();
      }
    }
  }, [selectedProfileIndex, currentStatusIndex, profiles]);

  const prevStatus = () => {
    if (selectedProfileIndex === null) return;
    if (currentStatusIndex > 0) {
      setCurrentStatusIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (selectedProfileIndex === null) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStatus();
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [selectedProfileIndex, currentStatusIndex, nextStatus]);

  const handleSwipe = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const startX = e.touches[0].clientX;
    const endX = touch.clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) nextStatus();
      else prevStatus();
    }
  };

  const handleTap = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    if (tapX > rect.width / 2) nextStatus();
    else prevStatus();
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const isProfileCompletelyViewed = (profileIndex: number) => {
    return Object.values(viewedStatuses[profileIndex]).every((status) => status);
  };

  const hasProfileBeenViewedAtAll = (profileIndex: number) => {
    return Object.values(viewedStatuses[profileIndex]).some((status) => status);
  };

  useEffect(() => {
    const handleTapOrTouch = (e: MouseEvent | TouchEvent) => {
      if (!isNavExpanded || !navRef.current) return;
      if (navRef.current.contains(e.target as Node)) {
        return;
      }
      setIsNavExpanded(false);
    };

    if (isNavExpanded) {
      document.addEventListener("click", handleTapOrTouch);
      document.addEventListener("touchstart", handleTapOrTouch, {
        passive: true,
      });
    }

    return () => {
      document.removeEventListener("click", handleTapOrTouch);
      document.removeEventListener("touchstart", handleTapOrTouch);
    };
  }, [isNavExpanded]);

  return (
    <div className="status-page">
      <div className="status-content-container">
        <div className="status-grid">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="status-profile"
              onClick={() => openStoryView(index)}
            >
              <div className="status-profile-pic-container">
                <img
                  src={profile.profilePic}
                  alt={`${profile.username}'s profile`}
                  className={`status-profile-pic ${
                    isProfileCompletelyViewed(index)
                      ? "completely-viewed"
                      : hasProfileBeenViewedAtAll(index)
                      ? "viewed"
                      : "unviewed"
                  }`}
                />
              </div>
              <span className="status-username">{profile.username}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedProfileIndex !== null && (
        <div
          className="status-story-view"
          onTouchEnd={handleSwipe}
          onClick={handleTap}
        >
          <div className="status-progress-bar-container">
            {profiles[selectedProfileIndex].statuses.map((_, idx) => (
              <div key={idx} className="status-progress-bar">
                <div
                  className="status-progress"
                  style={{
                    width: idx < currentStatusIndex ? "100%" : idx === currentStatusIndex ? `${progress}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>
          <div className="status-username-display">
            <img
              src={profiles[selectedProfileIndex].profilePic}
              alt={`${profiles[selectedProfileIndex].username}'s profile`}
              className="status-username-pic"
            />
            <span>{profiles[selectedProfileIndex].username}</span>
          </div>
          <button className="status-nav-button status-prev-button" onClick={prevStatus} aria-label="Previous status">
            <svg viewBox="0 0 24 24" className="status-nav-icon">
              <path d="M15 18L9 12l6-6" />
            </svg>
          </button>
          {profiles[selectedProfileIndex].statuses[currentStatusIndex].type === "image" ? (
            <img
              src={profiles[selectedProfileIndex].statuses[currentStatusIndex].url}
              alt={`Status ${currentStatusIndex + 1}`}
              className="status-story-image"
            />
          ) : (
            <video
              className="status-story-video"
              autoPlay
              muted
              playsInline
              onEnded={nextStatus}
            >
              <source src={profiles[selectedProfileIndex].statuses[currentStatusIndex].url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <button className="status-nav-button status-next-button" onClick={nextStatus} aria-label="Next status">
            <svg viewBox="0 0 24 24" className="status-nav-icon">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div className="status-message-input-container">
            <input
              type="text"
              className="status-message-input"
              placeholder="Type a message..."
              value={message}
              onChange={handleMessageChange}
            />
          </div>
          <button className="status-close-button" onClick={closeStoryView} aria-label="Close story view">
            <svg viewBox="0 0 24 24" className="status-close-icon">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="navigation" ref={navRef}>
        <div
          className={`nav-container ${isNavExpanded ? "expanded" : "shrunk"}`}
        >
          <div className="nav-left-space" style={{ width: "40px" }}></div>
          <button className="nav-logo" onClick={toggleNav}>
            SAGA
          </button>
          <div className="nav-buttons">
            <button
              className="nav-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/home");
              }}
              aria-label="Go to homepage"
            >
              <svg
                viewBox="0 0 24 24"
                className="home-icon"
                fill="none"
                stroke="#F4F3EF"
                strokeWidth="2"
              >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </button>
            <button
              className="nav-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/messages");
              }}
              aria-label="Go to messages page"
            >
              <svg
                viewBox="0 0 24 24"
                className="message-icon"
                fill="none"
                stroke="#F4F3EF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                <path d="M8 12h.01M12 12h.01M16 12h.01" fill="currentColor" />
              </svg>
            </button>
            <button
              className="nav-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/status");
              }}
              aria-label="Go to status page"
            >
              <svg
                viewBox="0 0 24 24"
                className="status-icon"
                fill="none"
                stroke="#F4F3EF"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </button>
            <button
              className="nav-button profile-button"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/profile");
              }}
              aria-label="Go to profile page"
            >
              <svg
                viewBox="0 0 24 24"
                className="profile-icon"
                fill="none"
                stroke="#F4F3EF"
                strokeWidth="2"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
