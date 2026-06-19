import { useEffect } from 'react';

/**
 * Hook to apply anti-copy and screenshot protections across the site.
 * Block right-click, block print/save/inspect shortcuts,
 * handle PrintScreen key, and blur content when losing visibility.
 */
export const useAntiCopyProtection = () => {
  useEffect(() => {
    // 1. Block Right-Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Block Keyboard Shortcuts (Ctrl+C, Ctrl+P, Ctrl+S, Ctrl+U, F12)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C (Copy)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
      }
      // Ctrl+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
      }
      // Ctrl+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
      }
      // Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }
      // F12 (Dev Tools)
      if (e.key === 'F12') {
        e.preventDefault();
      }
    };

    // 3. Detect PrintScreen Key
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        // Attempt to clear clipboard by copying empty string
        navigator.clipboard.writeText('');
        // Optional alert (commented out to be less intrusive, or uncomment to warn)
        // alert("Screenshots are disabled on this site.");
      }
    };

    // 4. Handle Visibility Change (blur on losing focus/multitasking)
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        document.body.style.filter = 'blur(20px)';
      } else {
        document.body.style.filter = 'none';
      }
    };

    // Attach event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial check just in case it mounts while hidden
    handleVisibilityChange();

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.body.style.filter = 'none';
    };
  }, []);
};
