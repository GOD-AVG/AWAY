import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profilepage.css";
import "../styles/homepage.css";

// Custom hook for double-tap detection
const useProfDoubleTap = (
  callback: (e: React.TouchEvent) => void,
  threshold: number = 300
) => {
  const lastTap = React.useRef<number>(0);

  return useCallback(
    (e: React.TouchEvent) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap.current;
      if (tapLength < threshold && tapLength > 0) {
        e.stopPropagation();
        callback(e);
      }
      lastTap.current = currentTime;
    },
    [callback, threshold]
  );
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profActiveTab, setProfActiveTab] = useState<
    "posts" | "followers" | "following"
  >("posts");
  const [profLikedPosts, setProfLikedPosts] = useState<{
    [key: number]: boolean;
  }>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [profLikeCounts, setProfLikeCounts] = useState<{
    [key: number]: number;
  }>({
    0: 10,
    1: 15,
    2: 8,
    3: 20,
    4: 12,
    5: 5,
  });
  const [profSavedPosts, setProfSavedPosts] = useState<{
    [key: number]: boolean;
  }>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);

  const toggleProfLike = useCallback((postIndex: number) => {
    let isProcessing = false;
    if (isProcessing) return;
    isProcessing = true;
    setProfLikedPosts((prev) => {
      const newLikedState = { ...prev, [postIndex]: !prev[postIndex] };
      setProfLikeCounts((prevCounts) => ({
        ...prevCounts,
        [postIndex]:
          prevCounts[postIndex] + (newLikedState[postIndex] ? 1 : -1),
      }));
      return newLikedState;
    });
    setTimeout(() => {
      isProcessing = false;
    }, 300);
  }, []);

  const toggleProfSave = useCallback((postIndex: number) => {
    setProfSavedPosts((prev) => ({
      ...prev,
      [postIndex]: !prev[postIndex],
    }));
  }, []);

  const toggleNav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsNavExpanded(!isNavExpanded);
  };

  const handleProfComment = (postIndex: number) => {
    console.log(`Comment clicked for post ${postIndex}`);
  };

  const handleProfShare = (postIndex: number) => {
    console.log(`Share clicked for post ${postIndex}`);
  };

  const handleProfilePictureClick = () => {
    console.log(`Profile picture clicked for harsha_2006`);
  };

  const handleUsernameClick = () => {
    console.log(`Username clicked for harsha_2006`);
  };

  const handleHashtagClick = (hashtag: string) => {
    console.log(`Hashtag clicked: ${hashtag}`);
  };

  const handleProfDoubleTap = useProfDoubleTap((e: React.TouchEvent) => {
    const postIndex = parseInt(
      (e.currentTarget as HTMLDivElement).dataset.postIndex || "0"
    );
    if (!profLikedPosts[postIndex]) {
      toggleProfLike(postIndex);
    }
  });

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

  const renderPostContent = (text: string) => {
    const hashtagRegex = /#(\w+)/g;
    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let match: RegExpExecArray | null;

    while ((match = hashtagRegex.exec(text)) !== null) {
      const beforeText = text.slice(lastIndex, match.index);
      const hashtag = match[1];
      if (beforeText) {
        elements.push(<span key={lastIndex}>{beforeText}</span>);
      }
      elements.push(
        <button
          key={match.index}
          className="hashtag-button"
          onClick={() => handleHashtagClick(hashtag)}
          style={{
            background: "none",
            border: "none",
            color: "#0FFF50",
            cursor: "pointer",
          }}
        >
          #{hashtag}
        </button>
      );
      lastIndex = hashtagRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      elements.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
    }

    return elements;
  };

  return (
    <div className="homepage">
      <div className="content-container">
        <div className="prof-container">
          {/* Profile Header */}
          <div className="prof-header">
            <div className="prof-cover-image">
              <img
                src="https://picsum.photos/1500/500?random=10"
                alt="Cover"
                className="prof-cover-img"
              />
            </div>
            <div className="prof-info">
              <button
                className="profile-picture-button"
                onClick={handleProfilePictureClick}
                aria-label="View harsha_2006's profile picture"
                style={{ background: "none", border: "none", padding: 0 }}
              >
                <div className="prof-picture-container">
                  <img
                    src="https://picsum.photos/150/150?random=11"
                    alt="Profile"
                    className="prof-pic"
                  />
                </div>
              </button>
              <div className="prof-details">
                <button
                  className="username-button"
                  onClick={handleUsernameClick}
                  aria-label="View harsha_2006's profile"
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <h1 className="prof-username">harsha_2006</h1>
                </button>
                <p className="prof-handle">@harsha2006</p>
                <p className="prof-bio">
                  Living life one post at a time. 🌟 #SocialMediaLover
                </p>
                <div className="prof-meta">
                  <span className="prof-join-date">Joined June 2023</span>
                  <span className="prof-follow-count">
                    <strong>250</strong> Following
                  </span>
                  <span className="prof-follow-count">
                    <strong>1.2K</strong> Followers
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className="prof-tabs">
            <button
              className={`prof-tab ${
                profActiveTab === "posts" ? "active" : ""
              }`}
              onClick={() => setProfActiveTab("posts")}
            >
              Posts
            </button>
            <button
              className={`prof-tab ${
                profActiveTab === "followers" ? "active" : ""
              }`}
              onClick={() => setProfActiveTab("followers")}
            >
              Followers
            </button>
            <button
              className={`prof-tab ${
                profActiveTab === "following" ? "active" : ""
              }`}
              onClick={() => setProfActiveTab("following")}
            >
              Following
            </button>
          </div>
          {/* Tab Content */}
          <div className="prof-tab-content">
            {profActiveTab === "posts" && (
              <div className="prof-posts-container">
                {/* Post 1 */}
                <div className="content-card">
                  <div className="card-header">
                    <button
                      className="profile-picture-button"
                      onClick={handleProfilePictureClick}
                      aria-label="View harsha_2006's profile picture"
                    >
                      <img
                        src="https://picsum.photos/40/40?random=11"
                        alt="Profile"
                        className="profile-picture"
                      />
                    </button>
                    <button
                      className="username-button"
                      onClick={handleUsernameClick}
                      aria-label="View harsha_2006's profile"
                    >
                      <span className="username">harsha_2006</span>
                    </button>
                    <span className="timestamp">1h ago</span>
                  </div>
                  <div
                    className="card-content"
                    data-post-index="0"
                    onTouchStart={handleProfDoubleTap}
                  >
                    <p>
                      {renderPostContent(
                        "Chasing sunsets and good vibes! 🌅 #Life"
                      )}
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="like-container">
                      <svg
                        className={`like-button ${
                          profLikedPosts[0] ? "active" : ""
                        } ${!profLikedPosts[0] ? "shake" : ""}`}
                        viewBox="0 0 100 100"
                        onClick={() => toggleProfLike(0)}
                        role="button"
                        aria-label={
                          profLikedPosts[0] ? "Unlike post" : "Like post"
                        }
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleProfLike(0);
                          }
                        }}
                      >
                        <polygon points="20,20 80,20 100,50 50,95 0,50" />
                      </svg>
                      <span className="like-count">{profLikeCounts[0]}</span>
                    </div>
                    <svg
                      className="comment-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfComment(0)}
                      role="button"
                      aria-label="Comment on post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfComment(0);
                        }
                      }}
                    >
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                    <svg
                      className="share-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfShare(0)}
                      role="button"
                      aria-label="Share post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfShare(0);
                        }
                      }}
                    >
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                    </svg>
                    <button
                      className={`save-button ${
                        profSavedPosts[0] ? "saved" : ""
                      }`}
                      onClick={() => toggleProfSave(0)}
                      aria-label={
                        profSavedPosts[0] ? "Unsave post" : "Save post"
                      }
                      tabIndex={0}
                    >
                      <svg viewBox="0 0 24 24" className="save-icon">
                        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Post 2 */}
                <div className="content-card">
                  <div className="card-header">
                    <button
                      className="profile-picture-button"
                      onClick={handleProfilePictureClick}
                      aria-label="View harsha_2006's profile picture"
                    >
                      <img
                        src="https://picsum.photos/40/40?random=11"
                        alt="Profile"
                        className="profile-picture"
                      />
                    </button>
                    <button
                      className="username-button"
                      onClick={handleUsernameClick}
                      aria-label="View harsha_2006's profile"
                    >
                      <span className="username">harsha_2006</span>
                    </button>
                    <span className="timestamp">3h ago</span>
                  </div>
                  <div
                    className="card-content"
                    data-post-index="1"
                    onTouchStart={handleProfDoubleTap}
                  >
                    <img
                      src="https://i.pinimg.com/originals/52/e2/0c/52e20cf74a46febe85a00b2867059b1c.gif"
                      alt="Post image"
                      className="post-image"
                    />
                    <p>{renderPostContent("City nights! 🏙️ #UrbanLife")}</p>
                  </div>
                  <div className="card-footer">
                    <div className="like-container">
                      <svg
                        className={`like-button ${
                          profLikedPosts[1] ? "active" : ""
                        } ${!profLikedPosts[1] ? "shake" : ""}`}
                        viewBox="0 0 100 100"
                        onClick={() => toggleProfLike(1)}
                        role="button"
                        aria-label={
                          profLikedPosts[1] ? "Unlike post" : "Like post"
                        }
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleProfLike(1);
                          }
                        }}
                      >
                        <polygon points="20,20 80,20 100,50 50,95 0,50" />
                      </svg>
                      <span className="like-count">{profLikeCounts[1]}</span>
                    </div>
                    <svg
                      className="comment-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfComment(1)}
                      role="button"
                      aria-label="Comment on post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfComment(1);
                        }
                      }}
                    >
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                    <svg
                      className="share-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfShare(1)}
                      role="button"
                      aria-label="Share post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfShare(1);
                        }
                      }}
                    >
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                    </svg>
                    <button
                      className={`save-button ${
                        profSavedPosts[1] ? "saved" : ""
                      }`}
                      onClick={() => toggleProfSave(1)}
                      aria-label={
                        profSavedPosts[1] ? "Unsave post" : "Save post"
                      }
                      tabIndex={0}
                    >
                      <svg viewBox="0 0 24 24" className="save-icon">
                        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Post 3 */}
                <div className="content-card">
                  <div className="card-header">
                    <button
                      className="profile-picture-button"
                      onClick={handleProfilePictureClick}
                      aria-label="View harsha_2006's profile picture"
                    >
                      <img
                        src="https://picsum.photos/40/40?random=11"
                        alt="Profile"
                        className="profile-picture"
                      />
                    </button>
                    <button
                      className="username-button"
                      onClick={handleUsernameClick}
                      aria-label="View harsha_2006's profile"
                    >
                      <span className="username">harsha_2006</span>
                    </button>
                    <span className="timestamp">5h ago</span>
                  </div>
                  <div
                    className="card-content"
                    data-post-index="2"
                    onTouchStart={handleProfDoubleTap}
                  >
                    <p>
                      {renderPostContent(
                        "Exploring new horizons! 🚀 #Adventure"
                      )}
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="like-container">
                      <svg
                        className={`like-button ${
                          profLikedPosts[2] ? "active" : ""
                        } ${!profLikedPosts[2] ? "shake" : ""}`}
                        viewBox="0 0 100 100"
                        onClick={() => toggleProfLike(2)}
                        role="button"
                        aria-label={
                          profLikedPosts[2] ? "Unlike post" : "Like post"
                        }
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleProfLike(2);
                          }
                        }}
                      >
                        <polygon points="20,20 80,20 100,50 50,95 0,50" />
                      </svg>
                      <span className="like-count">{profLikeCounts[2]}</span>
                    </div>
                    <svg
                      className="comment-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfComment(2)}
                      role="button"
                      aria-label="Comment on post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfComment(2);
                        }
                      }}
                    >
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                    <svg
                      className="share-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfShare(2)}
                      role="button"
                      aria-label="Share post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfShare(2);
                        }
                      }}
                    >
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.70l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.70L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                    </svg>
                    <button
                      className={`save-button ${
                        profSavedPosts[2] ? "saved" : ""
                      }`}
                      onClick={() => toggleProfSave(2)}
                      aria-label={
                        profSavedPosts[2] ? "Unsave post" : "Save post"
                      }
                      tabIndex={0}
                    >
                      <svg viewBox="0 0 24 24" className="save-icon">
                        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Post 4 */}
                <div className="content-card">
                  <div className="card-header">
                    <button
                      className="profile-picture-button"
                      onClick={handleProfilePictureClick}
                      aria-label="View harsha_2006's profile picture"
                    >
                      <img
                        src="https://picsum.photos/40/40?random=11"
                        alt="Profile"
                        className="profile-picture"
                      />
                    </button>
                    <button
                      className="username-button"
                      onClick={handleUsernameClick}
                      aria-label="View harsha_2006's profile"
                    >
                      <span className="username">harsha_2006</span>
                    </button>
                    <span className="timestamp">1d ago</span>
                  </div>
                  <div
                    className="card-content"
                    data-post-index="3"
                    onTouchStart={handleProfDoubleTap}
                  >
                    <img
                      src="https://picsum.photos/600/400?random=13"
                      alt="Post image"
                      className="post-image"
                    />
                    <p>{renderPostContent("Coffee and code! ☕ #TechLife")}</p>
                  </div>
                  <div className="card-footer">
                    <div className="like-container">
                      <svg
                        className={`like-button ${
                          profLikedPosts[3] ? "active" : ""
                        } ${!profLikedPosts[3] ? "shake" : ""}`}
                        viewBox="0 0 100 100"
                        onClick={() => toggleProfLike(3)}
                        role="button"
                        aria-label={
                          profLikedPosts[3] ? "Unlike post" : "Like post"
                        }
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleProfLike(3);
                          }
                        }}
                      >
                        <polygon points="20,20 80,20 100,50 50,95 0,50" />
                      </svg>
                      <span className="like-count">{profLikeCounts[3]}</span>
                    </div>
                    <svg
                      className="comment-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfComment(3)}
                      role="button"
                      aria-label="Comment on post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfComment(3);
                        }
                      }}
                    >
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                    <svg
                      className="share-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfShare(3)}
                      role="button"
                      aria-label="Share post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfShare(3);
                        }
                      }}
                    >
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                    </svg>
                    <button
                      className={`save-button ${
                        profSavedPosts[3] ? "saved" : ""
                      }`}
                      onClick={() => toggleProfSave(3)}
                      aria-label={
                        profSavedPosts[3] ? "Unsave post" : "Save post"
                      }
                      tabIndex={0}
                    >
                      <svg viewBox="0 0 24 24" className="save-icon">
                        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Post 5 */}
                <div className="content-card">
                  <div className="card-header">
                    <button
                      className="profile-picture-button"
                      onClick={handleProfilePictureClick}
                      aria-label="View harsha_2006's profile picture"
                    >
                      <img
                        src="https://picsum.photos/40/40?random=11"
                        alt="Profile"
                        className="profile-picture"
                      />
                    </button>
                    <button
                      className="username-button"
                      onClick={handleUsernameClick}
                      aria-label="View harsha_2006's profile"
                    >
                      <span className="username">harsha_2006</span>
                    </button>
                    <span className="timestamp">2d ago</span>
                  </div>
                  <div
                    className="card-content"
                    data-post-index="4"
                    onTouchStart={handleProfDoubleTap}
                  >
                    <p>
                      {renderPostContent(
                        "Morning runs are the best! 🏃‍♂️ #Fitness"
                      )}
                    </p>
                  </div>
                  <div className="card-footer">
                    <div className="like-container">
                      <svg
                        className={`like-button ${
                          profLikedPosts[4] ? "active" : ""
                        } ${!profLikedPosts[4] ? "shake" : ""}`}
                        viewBox="0 0 100 100"
                        onClick={() => toggleProfLike(4)}
                        role="button"
                        aria-label={
                          profLikedPosts[4] ? "Unlike post" : "Like post"
                        }
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleProfLike(4);
                          }
                        }}
                      >
                        <polygon points="20,20 80,20 100,50 50,95 0,50" />
                      </svg>
                      <span className="like-count">{profLikeCounts[4]}</span>
                    </div>
                    <svg
                      className="comment-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfComment(4)}
                      role="button"
                      aria-label="Comment on post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfComment(4);
                        }
                      }}
                    >
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                    <svg
                      className="share-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfShare(4)}
                      role="button"
                      aria-label="Share post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfShare(4);
                        }
                      }}
                    >
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                    </svg>
                    <button
                      className={`save-button ${
                        profSavedPosts[4] ? "saved" : ""
                      }`}
                      onClick={() => toggleProfSave(4)}
                      aria-label={
                        profSavedPosts[4] ? "Unsave post" : "Save post"
                      }
                      tabIndex={0}
                    >
                      <svg viewBox="0 0 24 24" className="save-icon">
                        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Post 6 */}
                <div className="content-card">
                  <div className="card-header">
                    <button
                      className="profile-picture-button"
                      onClick={handleProfilePictureClick}
                      aria-label="View harsha_2006's profile picture"
                    >
                      <img
                        src="https://picsum.photos/40/40?random=11"
                        alt="Profile"
                        className="profile-picture"
                      />
                    </button>
                    <button
                      className="username-button"
                      onClick={handleUsernameClick}
                      aria-label="View harsha_2006's profile"
                    >
                      <span className="username">harsha_2006</span>
                    </button>
                    <span className="timestamp">3d ago</span>
                  </div>
                  <div
                    className="card-content"
                    data-post-index="5"
                    onTouchStart={handleProfDoubleTap}
                  >
                    <img
                      src="https://picsum.photos/600/400?random=14"
                      alt="Post image"
                      className="post-image"
                    />
                    <p>{renderPostContent("Beach day vibes! 🌊 #Summer")}</p>
                  </div>
                  <div className="card-footer">
                    <div className="like-container">
                      <svg
                        className={`like-button ${
                          profLikedPosts[5] ? "active" : ""
                        } ${!profLikedPosts[5] ? "shake" : ""}`}
                        viewBox="0 0 100 100"
                        onClick={() => toggleProfLike(5)}
                        role="button"
                        aria-label={
                          profLikedPosts[5] ? "Unlike post" : "Like post"
                        }
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggleProfLike(5);
                          }
                        }}
                      >
                        <polygon points="20,20 80,20 100,50 50,95 0,50" />
                      </svg>
                      <span className="like-count">{profLikeCounts[5]}</span>
                    </div>
                    <svg
                      className="comment-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfComment(5)}
                      role="button"
                      aria-label="Comment on post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfComment(5);
                        }
                      }}
                    >
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                    <svg
                      className="share-button"
                      viewBox="0 0 24 24"
                      onClick={() => handleProfShare(5)}
                      role="button"
                      aria-label="Share post"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProfShare(5);
                        }
                      }}
                    >
                      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                    </svg>
                    <button
                      className={`save-button ${
                        profSavedPosts[5] ? "saved" : ""
                      }`}
                      onClick={() => toggleProfSave(5)}
                      aria-label={
                        profSavedPosts[5] ? "Unsave post" : "Save post"
                      }
                      tabIndex={0}
                    >
                      <svg viewBox="0 0 24 24" className="save-icon">
                        <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {profActiveTab === "followers" && (
              <div className="prof-followers-container">
                <p>No followers data available yet.</p>
              </div>
            )}
            {profActiveTab === "following" && (
              <div className="prof-following-container">
                <p>No following data available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="navigation" ref={navRef}>
        <div
          className={`nav-container ${isNavExpanded ? "expanded" : "shrunk"}`}
        >
          <div className="nav-left-space" style={{ width: "40px" }}></div>
          <button className="nav-logo" onClick={toggleNav}>
            AWAY
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
            <button className="nav-button" onClick={(e) => e.stopPropagation()}>
              A
            </button>
            <button className="nav-button" onClick={(e) => e.stopPropagation()}>
              B
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

export default ProfilePage;
