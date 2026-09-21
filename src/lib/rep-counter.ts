export interface Keypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

export type ExerciseType =
  | 'pushups'
  | 'diamond_pushups'
  | 'squats'
  | 'lunges'
  | 'bicep_curls'
  | 'glute_bridges'
  | 'plank'
  | 'jumping_jacks';

export interface RepState {
  count: number;
  stage: 'up' | 'down' | 'hold';
  feedback: string;
  angle: number;
  formQuality: 'good' | 'warning' | 'idle';
  holdSeconds?: number;
}

/**
 * Calculates 2D angle in degrees formed at point b (between ray b->a and ray b->c)
 */
export function calculateAngle(a: Keypoint, b: Keypoint, c: Keypoint): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360 - angle;
  }

  return Math.round(angle);
}

function findBestKeypoint(keypoints: Keypoint[], names: string[]): Keypoint | undefined {
  let best: Keypoint | undefined;
  let maxScore = -1;

  for (const name of names) {
    const kp = keypoints.find((k) => k.name === name);
    if (kp && (kp.score ?? 1) > maxScore) {
      best = kp;
      maxScore = kp.score ?? 1;
    }
  }

  return best;
}

/**
 * Push-ups Form & Rep Counter
 * Tracks Shoulder-Elbow-Wrist angle
 * Form check: Shoulder-Hip-Ankle should remain straight
 */
export function countPushups(keypoints: Keypoint[], currentState: RepState): RepState {
  const leftShoulder = keypoints.find((k) => k.name === 'left_shoulder');
  const leftElbow = keypoints.find((k) => k.name === 'left_elbow');
  const leftWrist = keypoints.find((k) => k.name === 'left_wrist');

  const rightShoulder = keypoints.find((k) => k.name === 'right_shoulder');
  const rightElbow = keypoints.find((k) => k.name === 'right_elbow');
  const rightWrist = keypoints.find((k) => k.name === 'right_wrist');

  // Choose side with higher visibility
  const leftScore = ((leftShoulder?.score || 0) + (leftElbow?.score || 0) + (leftWrist?.score || 0)) / 3;
  const rightScore = ((rightShoulder?.score || 0) + (rightElbow?.score || 0) + (rightWrist?.score || 0)) / 3;

  const [shoulder, elbow, wrist] =
    leftScore >= rightScore
      ? [leftShoulder, leftElbow, leftWrist]
      : [rightShoulder, rightElbow, rightWrist];

  if (!shoulder || !elbow || !wrist || (shoulder.score || 0) < 0.25 || (elbow.score || 0) < 0.25 || (wrist.score || 0) < 0.25) {
    return {
      ...currentState,
      feedback: 'Step back so arms are fully visible in frame',
      formQuality: 'idle',
    };
  }

  const armAngle = calculateAngle(shoulder, elbow, wrist);
  const next = { ...currentState, angle: armAngle };

  // Body alignment check (back sag or pike)
  const hip = findBestKeypoint(keypoints, ['left_hip', 'right_hip']);
  const ankle = findBestKeypoint(keypoints, ['left_ankle', 'right_ankle']);
  let bodySagging = false;
  if (hip && ankle && (hip.score || 0) > 0.25 && (ankle.score || 0) > 0.25) {
    const bodyAngle = calculateAngle(shoulder, hip, ankle);
    if (bodyAngle < 150) {
      bodySagging = true;
    }
  }

  if (bodySagging) {
    next.feedback = 'Keep your back straight! Do not sag hips';
    next.formQuality = 'warning';
  } else if (armAngle >= 150) {
    if (currentState.stage === 'down') {
      next.count += 1;
      next.stage = 'up';
      next.feedback = 'Excellent rep! Drive down again.';
      next.formQuality = 'good';
    } else {
      next.stage = 'up';
      next.feedback = 'Lower your chest to the floor';
      next.formQuality = 'good';
    }
  } else if (armAngle <= 95 && currentState.stage === 'up') {
    next.stage = 'down';
    next.feedback = 'Good depth! Now push up explosive!';
    next.formQuality = 'good';
  } else if (armAngle > 95 && armAngle < 150) {
    if (currentState.stage === 'up') {
      next.feedback = 'Go deeper (break 90°)';
    } else {
      next.feedback = 'Push all the way to top lock';
    }
  }

  return next;
}

/**
 * Squats Form & Rep Counter
 * Tracks Hip-Knee-Ankle angle
 */
export function countSquats(keypoints: Keypoint[], currentState: RepState): RepState {
  const leftHip = keypoints.find((k) => k.name === 'left_hip');
  const leftKnee = keypoints.find((k) => k.name === 'left_knee');
  const leftAnkle = keypoints.find((k) => k.name === 'left_ankle');

  const rightHip = keypoints.find((k) => k.name === 'right_hip');
  const rightKnee = keypoints.find((k) => k.name === 'right_knee');
  const rightAnkle = keypoints.find((k) => k.name === 'right_ankle');

  const leftScore = ((leftHip?.score || 0) + (leftKnee?.score || 0) + (leftAnkle?.score || 0)) / 3;
  const rightScore = ((rightHip?.score || 0) + (rightKnee?.score || 0) + (rightAnkle?.score || 0)) / 3;

  const [hip, knee, ankle] =
    leftScore >= rightScore
      ? [leftHip, leftKnee, leftAnkle]
      : [rightHip, rightKnee, rightAnkle];

  if (!hip || !knee || !ankle || (hip.score || 0) < 0.25 || (knee.score || 0) < 0.25 || (ankle.score || 0) < 0.25) {
    return {
      ...currentState,
      feedback: 'Position camera to see hips, knees, and feet',
      formQuality: 'idle',
    };
  }

  const kneeAngle = calculateAngle(hip, knee, ankle);
  const next = { ...currentState, angle: kneeAngle };

  if (kneeAngle > 160) {
    if (currentState.stage === 'down') {
      next.count += 1;
      next.stage = 'up';
      next.feedback = 'Solid squat! Keep the tempo going.';
      next.formQuality = 'good';
    } else {
      next.stage = 'up';
      next.feedback = 'Squat down (hips back and down)';
      next.formQuality = 'good';
    }
  } else if (kneeAngle < 95 && currentState.stage === 'up') {
    next.stage = 'down';
    next.feedback = 'Great depth! Drive through your heels.';
    next.formQuality = 'good';
  } else if (kneeAngle >= 95 && kneeAngle <= 160) {
    if (currentState.stage === 'up') {
      next.feedback = 'Go lower into parallel depth';
    } else {
      next.feedback = 'Stand all the way upright';
    }
  }

  return next;
}

/**
 * Lunges Form & Rep Counter
 */
export function countLunges(keypoints: Keypoint[], currentState: RepState): RepState {
  const hip = findBestKeypoint(keypoints, ['left_hip', 'right_hip']);
  const knee = findBestKeypoint(keypoints, ['left_knee', 'right_knee']);
  const ankle = findBestKeypoint(keypoints, ['left_ankle', 'right_ankle']);

  if (!hip || !knee || !ankle || (hip.score || 0) < 0.25 || (knee.score || 0) < 0.25 || (ankle.score || 0) < 0.25) {
    return {
      ...currentState,
      feedback: 'Step into view to track lunge depth',
      formQuality: 'idle',
    };
  }

  const lungeAngle = calculateAngle(hip, knee, ankle);
  const next = { ...currentState, angle: lungeAngle };

  if (lungeAngle > 155) {
    if (currentState.stage === 'down') {
      next.count += 1;
      next.stage = 'up';
      next.feedback = 'Strong lunge! Switch or repeat.';
      next.formQuality = 'good';
    } else {
      next.stage = 'up';
      next.feedback = 'Step forward and bend knees to 90°';
      next.formQuality = 'good';
    }
  } else if (lungeAngle < 100 && currentState.stage === 'up') {
    next.stage = 'down';
    next.feedback = 'Perfect depth! Press through front foot.';
    next.formQuality = 'good';
  }

  return next;
}

/**
 * Plank Form & Duration Tracker
 */
export function checkPlank(keypoints: Keypoint[], currentState: RepState): RepState {
  const shoulder = findBestKeypoint(keypoints, ['left_shoulder', 'right_shoulder']);
  const hip = findBestKeypoint(keypoints, ['left_hip', 'right_hip']);
  const ankle = findBestKeypoint(keypoints, ['left_ankle', 'right_ankle']);

  if (!shoulder || !hip || !ankle || (shoulder.score || 0) < 0.25 || (hip.score || 0) < 0.25 || (ankle.score || 0) < 0.25) {
    return {
      ...currentState,
      feedback: 'Show side profile: shoulder, hip, and ankles',
      formQuality: 'idle',
    };
  }

  const spineAngle = calculateAngle(shoulder, hip, ankle);
  const next = { ...currentState, angle: spineAngle };

  // Ideal plank spine line is roughly 160° - 195°
  if (spineAngle >= 155 && spineAngle <= 195) {
    next.feedback = 'Locked in! Core tight, spine neutral.';
    next.formQuality = 'good';
    next.stage = 'hold';
  } else if (spineAngle < 155) {
    next.feedback = 'Hips are piking too high! Lower hips slightly.';
    next.formQuality = 'warning';
    next.stage = 'up';
  } else {
    next.feedback = 'Hips are sagging! Engage core and glutes.';
    next.formQuality = 'warning';
    next.stage = 'up';
  }

  return next;
}

/**
 * Jumping Jacks Rep Counter
 */
export function countJumpingJacks(keypoints: Keypoint[], currentState: RepState): RepState {
  const leftWrist = keypoints.find((k) => k.name === 'left_wrist');
  const rightWrist = keypoints.find((k) => k.name === 'right_wrist');
  const leftShoulder = keypoints.find((k) => k.name === 'left_shoulder');
  const rightShoulder = keypoints.find((k) => k.name === 'right_shoulder');
  const leftAnkle = keypoints.find((k) => k.name === 'left_ankle');
  const rightAnkle = keypoints.find((k) => k.name === 'right_ankle');

  if (!leftWrist || !rightWrist || !leftShoulder || !rightShoulder || !leftAnkle || !rightAnkle) {
    return {
      ...currentState,
      feedback: 'Step back to fit entire body in camera',
      formQuality: 'idle',
    };
  }

  const handsOverhead = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
  const feetSpread = Math.abs(leftAnkle.x - rightAnkle.x) > Math.abs(leftShoulder.x - rightShoulder.x) * 1.5;

  const next = { ...currentState, angle: handsOverhead ? 180 : 0 };

  if (handsOverhead && feetSpread && currentState.stage === 'up') {
    next.stage = 'down';
    next.feedback = 'Feet apart, hands high! Return to center.';
    next.formQuality = 'good';
  } else if (!handsOverhead && !feetSpread && currentState.stage === 'down') {
    next.count += 1;
    next.stage = 'up';
    next.feedback = 'Great jack! Keep moving.';
    next.formQuality = 'good';
  }

  return next;
}

/**
 * Unified Exercise Dispatcher
 */
export function countExerciseRep(
  exercise: ExerciseType,
  keypoints: Keypoint[],
  currentState: RepState
): RepState {
  switch (exercise) {
    case 'pushups':
      return countPushups(keypoints, currentState);
    case 'squats':
      return countSquats(keypoints, currentState);
    case 'lunges':
      return countLunges(keypoints, currentState);
    case 'plank':
      return checkPlank(keypoints, currentState);
    case 'jumping_jacks':
      return countJumpingJacks(keypoints, currentState);
    default:
      return currentState;
  }
}
