import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/homepage.css";

// Custom hook for double-tap detection
const useDoubleTap = (
  callback: (e: React.TouchEvent) => void,
  threshold: number = 300
) => {
  const lastTap = useRef<number>(0);

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

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({
    0: 12,
    1: 12,
    2: 12,
    3: 12,
    4: 12,
  });
  const [savedPosts, setSavedPosts] = useState<{ [key: number]: boolean }>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [followedUsers, setFollowedUsers] = useState<{
    [key: number]: boolean;
  }>({
    0: false,
    1: false,
    2: false,
    4: false,
  });
  const navRef = useRef<HTMLDivElement>(null);

  const toggleNav = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsNavExpanded(!isNavExpanded);
  };

  const toggleLike = useCallback((postIndex: number) => {
    console.log(`Toggling like for post ${postIndex}`);
    let isProcessing = false;
    if (isProcessing) return;
    isProcessing = true;
    setLikedPosts((prev) => {
      const newLikedState = { ...prev, [postIndex]: !prev[postIndex] };
      setLikeCounts((prevCounts) => ({
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

  const toggleSave = useCallback((postIndex: number) => {
    setSavedPosts((prev) => ({
      ...prev,
      [postIndex]: !prev[postIndex],
    }));
  }, []);

  const toggleFollow = useCallback((postIndex: number) => {
    setFollowedUsers((prev) => ({
      ...prev,
      [postIndex]: !prev[postIndex],
    }));
  }, []);

  const handleComment = (postIndex: number) => {
    console.log(`Comment clicked for post ${postIndex}`);
  };

  const handleShare = (postIndex: number) => {
    console.log(`Share clicked for post ${postIndex}`);
  };

  const handleProfilePictureClick = (username: string) => {
    console.log(`Profile picture clicked for ${username}`);
  };

  const handleUsernameClick = (username: string) => {
    console.log(`Username clicked for ${username}`);
  };

  const handleHashtagClick = (hashtag: string) => {
    console.log(`Hashtag clicked: ${hashtag}`);
  };

  const handleDoubleTap = useDoubleTap((e: React.TouchEvent) => {
    const postIndex = parseInt(
      (e.currentTarget as HTMLDivElement).dataset.postIndex || "0"
    );
    if (!likedPosts[postIndex]) {
      toggleLike(postIndex);
    }
  });

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
    <div className="homepage">
      <div className="content-container">
        {/* Demo Post 1: Text */}
        <div className="content-card">
          <div className="card-header">
            <button
              className="profile-picture-button"
              onClick={() => handleProfilePictureClick("user1")}
              aria-label="View user1's profile picture"
            >
              <img
                src="https://picsum.photos/40/40?random=1"
                alt="User1 profile"
                className="profile-picture"
              />
            </button>
            <button
              className="username-button"
              onClick={() => handleUsernameClick("user1")}
              aria-label="View user1's profile"
            >
              <span className="username">user1</span>
            </button>
            <span className="timestamp">2h ago</span>
            <button
              className={`follow-button ${followedUsers[0] ? "following" : ""}`}
              onClick={() => toggleFollow(0)}
              aria-label={followedUsers[0] ? "Unfollow user1" : "Follow user1"}
            >
              {followedUsers[0] ? "Following" : "Follow"}
            </button>
          </div>
          <div
            className="card-content"
            data-post-index="0"
            onTouchStart={handleDoubleTap}
          >
            <p>
              {renderPostContent(
                "Exploring the mountains today! Loving the fresh air and stunning views. 🏞️ #NatureLover"
              )}
            </p>
          </div>
          <div className="card-footer">
            <div className="like-container">
              <svg
                className={`like-button ${likedPosts[0] ? "active" : ""} ${
                  !likedPosts[0] ? "shake" : ""
                }`}
                viewBox="0 0 100 100"
                onClick={() => toggleLike(0)}
                role="button"
                aria-label={likedPosts[0] ? "Unlike post" : "Like post"}
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleLike(0);
                  }
                }}
              >
                <polygon points="20,20 80,20 100,50 50,95 0,50" />
              </svg>
              <span className="like-count">{likeCounts[0]}</span>
            </div>
            <svg
              className="comment-button"
              viewBox="0 0 24 24"
              onClick={() => handleComment(0)}
              role="button"
              aria-label="Comment on post"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleComment(0);
                }
              }}
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <svg
              className="share-button"
              viewBox="0 0 24 24"
              onClick={() => handleShare(0)}
              role="button"
              aria-label="Share post"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleShare(0);
                }
              }}
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
            <button
              className={`save-button ${savedPosts[0] ? "saved" : ""}`}
              onClick={() => toggleSave(0)}
              aria-label={savedPosts[0] ? "Unsave post" : "Save post"}
              tabIndex={0}
            >
              <svg viewBox="0 0 24 24" className="save-icon">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>
        {/* Demo Post 2: Image */}
        <div className="content-card">
          <div className="card-header">
            <button
              className="profile-picture-button"
              onClick={() => handleProfilePictureClick("user2")}
              aria-label="View user2's profile picture"
            >
              <img
                src="https://picsum.photos/40/40?random=2"
                alt="User2 profile"
                className="profile-picture"
              />
            </button>
            <button
              className="username-button"
              onClick={() => handleUsernameClick("user2")}
              aria-label="View user2's profile"
            >
              <span className="username">harsha_2006</span>
            </button>
            <span className="timestamp">5h ago</span>
            <button
              className={`follow-button ${followedUsers[1] ? "following" : ""}`}
              onClick={() => toggleFollow(1)}
              aria-label={followedUsers[1] ? "Unfollow user2" : "Follow user2"}
            >
              {followedUsers[1] ? "Following" : "Follow"}
            </button>
          </div>
          <div
            className="card-content"
            data-post-index="1"
            onTouchStart={handleDoubleTap}
          >
            <img
              src="https://i.pinimg.com/originals/52/e2/0c/52e20cf74a46febe85a00b2867059b1c.gif"
              alt="Spider-Man in action"
              className="post-image"
            />
            <p>{renderPostContent("spiderman is an emotion. 🌅 #spiderman")}</p>
          </div>
          <div className="card-footer">
            <div className="like-container">
              <svg
                className={`like-button ${likedPosts[1] ? "active" : ""} ${
                  !likedPosts[1] ? "shake" : ""
                }`}
                viewBox="0 0 100 100"
                onClick={() => toggleLike(1)}
                role="button"
                aria-label={likedPosts[1] ? "Unlike post" : "Like post"}
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleLike(1);
                  }
                }}
              >
                <polygon points="20,20 80,20 100,50 50,95 0,50" />
              </svg>
              <span className="like-count">{likeCounts[1]}</span>
            </div>
            <svg
              className="comment-button"
              viewBox="0 0 24 24"
              onClick={() => handleComment(1)}
              role="button"
              aria-label="Comment on post"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleComment(1);
                }
              }}
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <svg
              className="share-button"
              viewBox="0 0 24 24"
              onClick={() => handleShare(1)}
              role="button"
              aria-label="Share post"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleShare(1);
                }
              }}
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
            <button
              className={`save-button ${savedPosts[1] ? "saved" : ""}`}
              onClick={() => toggleSave(1)}
              aria-label={savedPosts[1] ? "Unsave post" : "Save post"}
              tabIndex={0}
            >
              <svg viewBox="0 0 24 24" className="save-icon">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>
        {/* Demo Post 3: Video */}
        <div className="content-card">
          <div className="card-header">
            <button
              className="profile-picture-button"
              onClick={() => handleProfilePictureClick("user3")}
              aria-label="View user3's profile picture"
            >
              <img
                src="https://picsum.photos/40/40?random=3"
                alt="User3 profile"
                className="profile-picture"
              />
            </button>
            <button
              className="username-button"
              onClick={() => handleUsernameClick("user3")}
              aria-label="View user3's profile"
            >
              <span className="username">user3</span>
            </button>
            <span className="timestamp">8h ago</span>
            <button
              className={`follow-button ${followedUsers[2] ? "following" : ""}`}
              onClick={() => toggleFollow(2)}
              aria-label={followedUsers[2] ? "Unfollow user3" : "Follow user3"}
            >
              {followedUsers[2] ? "Following" : "Follow"}
            </button>
          </div>
          <div
            className="card-content"
            data-post-index="2"
            onTouchStart={handleDoubleTap}
          >
            <video className="post-video" controls>
              <source
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <p>{renderPostContent("City lights and good vibes! 🌃 #BUNNY")}</p>
          </div>
          <div className="card-footer">
            <div className="like-container">
              <svg
                className={`like-button ${likedPosts[2] ? "active" : ""} ${
                  !likedPosts[2] ? "shake" : ""
                }`}
                viewBox="0 0 100 100"
                onClick={() => toggleLike(2)}
                role="button"
                aria-label={likedPosts[2] ? "Unlike post" : "Like post"}
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleLike(2);
                  }
                }}
              >
                <polygon points="20,20 80,20 100,50 50,95 0,50" />
              </svg>
              <span className="like-count">{likeCounts[2]}</span>
            </div>
            <svg
              className="comment-button"
              viewBox="0 0 24 24"
              onClick={() => handleComment(2)}
              role="button"
              aria-label="Comment on post"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleComment(2);
                }
              }}
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <svg
              className="share-button"
              viewBox="0 0 24 24"
              onClick={() => handleShare(2)}
              role="button"
              aria-label="Share post"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleShare(2);
                }
              }}
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
            <button
              className={`save-button ${savedPosts[2] ? "saved" : ""}`}
              onClick={() => toggleSave(2)}
              aria-label={savedPosts[2] ? "Unsave post" : "Save post"}
              tabIndex={0}
            >
              <svg viewBox="0 0 24 24" className="save-icon">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
          </div>
        </div>
        {/* Demo Post 4: Ad */}
        <div className="content-card ad-card">
          <div className="card-header">
            <button
              className="profile-picture-button"
              onClick={() => handleProfilePictureClick("sponsored")}
              aria-label="View sponsored profile picture"
            >
              <img
                src="https://picsum.photos/40/40?random=4"
                alt="Sponsored profile"
                className="profile-picture"
              />
            </button>
            <button
              className="username-button"
              onClick={() => handleUsernameClick("sponsored")}
              aria-label="View sponsored profile"
            >
              <span className="username">sponsored</span>
            </button>
            <span className="timestamp">Promoted</span>
          </div>
          <div
            className="card-content"
            data-post-index="3"
            onTouchStart={handleDoubleTap}
          >
            <img
              src="https://images-porsche.imgix.net/-/media/243EAB8F810C4DE395A5DD4C0D154B9F_197D59EBE2B0444DAD1D8C930220A2FC_CZ26W03IX0010-911-carrera-s-side?w=2560&h=697&q=45&crop=faces%2Centropy%2Cedges&auto=format"
              alt="Porsche car"
              className="post-image"
            />
            <p>{renderPostContent("porsche is demonic #cars #porsche")}</p>
          </div>
          <div className="card-footer">
            <div className="like-container">
              <svg
                className={`like-button ${likedPosts[3] ? "active" : ""} ${
                  !likedPosts[3] ? "shake" : ""
                }`}
                viewBox="0 0 100 100"
                onClick={() => toggleLike(3)}
                role="button"
                aria-label={likedPosts[3] ? "Unlike post" : "Like post"}
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleLike(3);
                  }
                }}
              >
                <polygon points="20,20 80,20 100,50 50,95 0,50" />
              </svg>
              <span className="like-count">{likeCounts[3]}</span>
            </div>
            <svg
              className="comment-button"
              viewBox="0 0 24 24"
              onClick={() => handleComment(3)}
              role="button"
              aria-label="Comment on post"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleComment(3);
                }
              }}
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <svg
              className="share-button"
              viewBox="0 0 24 24"
              onClick={() => handleShare(3)}
              role="button"
              aria-label="Share post"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleShare(3);
                }
              }}
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
            <button
              className={`save-button ${savedPosts[3] ? "saved" : ""}`}
              onClick={() => toggleSave(3)}
              aria-label={savedPosts[3] ? "Unsave post" : "Save post"}
              tabIndex={0}
            >
              <svg viewBox="0 0 24 24" className="save-icon">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
          </div>
          <div className="ad-action">
            <button className="action-button shop-now">Shop Now</button>
          </div>
        </div>
        {/* Demo Post 5: Text */}
        <div className="content-card">
          <div className="card-header">
            <button
              className="profile-picture-button"
              onClick={() => handleProfilePictureClick("user4")}
              aria-label="View user4's profile picture"
            >
              <img
                src="https://picsum.photos/40/40?random=5"
                alt="User4 profile"
                className="profile-picture"
              />
            </button>
            <button
              className="username-button"
              onClick={() => handleUsernameClick("user4")}
              aria-label="View user4's profile"
            >
              <span className="username">user4</span>
            </button>
            <span className="timestamp">12h ago</span>
            <button
              className={`follow-button ${followedUsers[4] ? "following" : ""}`}
              onClick={() => toggleFollow(4)}
              aria-label={followedUsers[4] ? "Unfollow user4" : "Follow user4"}
            >
              {followedUsers[4] ? "Following" : "Follow"}
            </button>
          </div>
          <div
            className="card-content"
            data-post-index="4"
            onTouchStart={handleDoubleTap}
          >
            <p>
              {renderPostContent(
                "Just tried this amazing coffee shop! ☕ #CoffeeLovers"
              )}
            </p>
          </div>
          <div className="card-footer">
            <div className="like-container">
              <svg
                className={`like-button ${likedPosts[4] ? "active" : ""} ${
                  !likedPosts[4] ? "shake" : ""
                }`}
                viewBox="0 0 100 100"
                onClick={() => toggleLike(4)}
                role="button"
                aria-label={likedPosts[4] ? "Unlike post" : "Like post"}
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleLike(4);
                  }
                }}
              >
                <polygon points="20,20 80,20 100,50 50,95 0,50" />
              </svg>
              <span className="like-count">{likeCounts[4]}</span>
            </div>
            <svg
              className="comment-button"
              viewBox="0 0 24 24"
              onClick={() => handleComment(4)}
              role="button"
              aria-label="Comment on post"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleComment(4);
                }
              }}
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <svg
              className="share-button"
              viewBox="0 0 24 24"
              onClick={() => handleShare(4)}
              role="button"
              aria-label="Share post"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<SVGSVGElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleShare(4);
                }
              }}
            >
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
            </svg>
            <button
              className={`save-button ${savedPosts[4] ? "saved" : ""}`}
              onClick={() => toggleSave(4)}
              aria-label={savedPosts[4] ? "Unsave post" : "Save post"}
              tabIndex={0}
            >
              <svg viewBox="0 0 24 24" className="save-icon">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            </button>
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

export default HomePage;
