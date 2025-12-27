import { Keypoint } from "@tensorflow-models/pose-detection";

export interface RepState {
  count: number;
  stage: "up" | "down";
  feedback: string;
}

export function calculateAngle(a: Keypoint, b: Keypoint, c: Keypoint): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return angle;
}

export function countPushups(
  keypoints: Keypoint[],
  currentState: RepState
): RepState {
  // Keypoints: 5: left_shoulder, 7: left_elbow, 9: left_wrist
  // We'll use left side for now (assuming side view or front view)
  // Better to check confidence and pick the most visible side
  
  const shoulder = keypoints.find((k) => k.name === "left_shoulder");
  const elbow = keypoints.find((k) => k.name === "left_elbow");
  const wrist = keypoints.find((k) => k.name === "left_wrist");

  if (!shoulder || !elbow || !wrist || 
      (shoulder.score || 0) < 0.3 || 
      (elbow.score || 0) < 0.3 || 
      (wrist.score || 0) < 0.3) {
    return { ...currentState, feedback: "Adjust camera to see arm clearly" };
  }

  const angle = calculateAngle(shoulder, elbow, wrist);

  const newState = { ...currentState };

  // Logic:
  // UP stage: Angle > 160 (Arms extended)
  // DOWN stage: Angle < 90 (Chest close to floor)

  if (angle > 160) {
    newState.stage = "up";
    newState.feedback = "Go down";
  }

  if (angle < 90 && currentState.stage === "up") {
    newState.stage = "down";
    newState.feedback = "Push up!";
    // We count when they complete the rep (return to up) or reach the bottom?
    // Usually count at the top of the movement after a successful down
  }
  
  if (angle > 160 && currentState.stage === "down") {
      newState.count += 1;
      newState.stage = "up";
      newState.feedback = "Good rep!";
  }

  return newState;
}

export function countSquats(
    keypoints: Keypoint[],
    currentState: RepState
  ): RepState {
    // Keypoints: 11: left_hip, 13: left_knee, 15: left_ankle
    
    const hip = keypoints.find((k) => k.name === "left_hip");
    const knee = keypoints.find((k) => k.name === "left_knee");
    const ankle = keypoints.find((k) => k.name === "left_ankle");
  
    if (!hip || !knee || !ankle || 
        (hip.score || 0) < 0.3 || 
        (knee.score || 0) < 0.3 || 
        (ankle.score || 0) < 0.3) {
      return { ...currentState, feedback: "Adjust camera to see legs clearly" };
    }
  
    const angle = calculateAngle(hip, knee, ankle);
  
    const newState = { ...currentState };
  
    // Logic:
    // UP stage: Angle > 160 (Standing)
    // DOWN stage: Angle < 100 (Squat depth)
  
    if (angle > 160) {
      newState.stage = "up";
      newState.feedback = "Squat down";
    }
  
    if (angle < 100 && currentState.stage === "up") {
      newState.stage = "down";
      newState.feedback = "Drive up!";
    }
    
    if (angle > 160 && currentState.stage === "down") {
        newState.count += 1;
        newState.stage = "up";
        newState.feedback = "Good squat!";
    }
  
    return newState;
  }
export function countLunges(
    keypoints: Keypoint[],
    currentState: RepState
  ): RepState {
    // Keypoints: 11: left_hip, 13: left_knee, 15: left_ankle
    // Similar to squats but with a deeper angle or checking both legs
    
    const hip = keypoints.find((k) => k.name === "left_hip");
    const knee = keypoints.find((k) => k.name === "left_knee");
    const ankle = keypoints.find((k) => k.name === "left_ankle");
  
    if (!hip || !knee || !ankle || 
        (hip.score || 0) < 0.3 || 
        (knee.score || 0) < 0.3 || 
        (ankle.score || 0) < 0.3) {
      return { ...currentState, feedback: "Adjust camera to see legs clearly" };
    }
  
    const angle = calculateAngle(hip, knee, ankle);
  
    const newState = { ...currentState };
  
    // Logic:
    // UP stage: Angle > 160 (Standing)
    // DOWN stage: Angle < 100 (Lunge depth)
  
    if (angle > 160) {
      newState.stage = "up";
      newState.feedback = "Step forward and lunge";
    }
  
    if (angle < 100 && currentState.stage === "up") {
      newState.stage = "down";
      newState.feedback = "Push back up!";
    }
    
    if (angle > 160 && currentState.stage === "down") {
        newState.count += 1;
        newState.stage = "up";
        newState.feedback = "Good lunge!";
    }
  
    return newState;
  }

export function checkPlank(
    keypoints: Keypoint[],
    currentState: RepState
  ): RepState {
    // Keypoints: 5: left_shoulder, 11: left_hip, 15: left_ankle
    // Body should be in a straight line (angle ~180)
    
    const shoulder = keypoints.find((k) => k.name === "left_shoulder");
    const hip = keypoints.find((k) => k.name === "left_hip");
    const ankle = keypoints.find((k) => k.name === "left_ankle");
  
    if (!shoulder || !hip || !ankle || 
        (shoulder.score || 0) < 0.3 || 
        (hip.score || 0) < 0.3 || 
        (ankle.score || 0) < 0.3) {
      return { ...currentState, feedback: "Adjust camera to see full body side-view" };
    }
  
    const angle = calculateAngle(shoulder, hip, ankle);
  
    const newState = { ...currentState };
  
    // Logic:
    // Straight line: Angle between 160 and 200
    if (angle > 160 && angle < 200) {
        newState.feedback = "Hold it! Perfect form.";
        newState.stage = "down"; // Using 'down' as 'active' for plank
    } else {
        newState.feedback = "Keep your back straight!";
        newState.stage = "up";
    }
  
    return newState;
  }
