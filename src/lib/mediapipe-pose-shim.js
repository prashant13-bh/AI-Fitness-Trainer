// Shim for @mediapipe/pose to fix Next.js build issues
export const Pose = function() {
  this.setOptions = () => {};
  this.onResults = () => {};
  this.send = async () => {};
};

export const VERSION = "0.5.1675469404";

export default { Pose, VERSION };
