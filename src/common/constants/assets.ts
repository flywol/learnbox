/**
 * Centralized constants for application assets.
 * Use these constants instead of hardcoded strings to ensure consistency and easy maintenance.
 */

export const ASSETS = {
  IMAGES: {
    LOGO: "/assets/logo.svg",
    AUTH_BG: "/assets/auth-bg.png",
    ADD_NEW: "/assets/add-new.svg",
    ADD_NEW_2: "/assets/add-new2.svg",
    ACTIVITY_EMPTY: "/assets/activity-empty.svg",
    SUCCESS_CONFETTI: "/assets/success-confetti.svg",
    FAILURE_ICON: "/assets/failure-icon.svg", // Assuming based on FailureModal
    COURSE_DEFAULT: "/assets/course-default.png", // Placeholder
    EVENTS_EMPTY: "/assets/events-empty.svg",
    WELCOME_MODAL_BG: "/assets/welcome-modal-bg.png", // Placeholder
    EMPTY_STATE: "/assets/empty-state.svg",
    PAYMENT_EMPTY: "/assets/payment-empty.svg",
    VIDEO_PLACEHOLDER: "/assets/video-placeholder.png",
    FILE_PLACEHOLDER: "/assets/file-placeholder.png",
    QUIZ_PLACEHOLDER: "/assets/quiz-placeholder.png",
    ASSIGNMENT_PLACEHOLDER: "/assets/assignment-placeholder.png",
    LIVE_CLASS_PLACEHOLDER: "/assets/live-class-placeholder.png",
  },
  ICONS: {
    // Add icons if they are served as static assets
  }
} as const;
