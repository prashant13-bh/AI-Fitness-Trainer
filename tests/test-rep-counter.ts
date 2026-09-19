import {
  calculateAngle,
  countPushups,
  countSquats,
  checkPlank,
  Keypoint,
  RepState,
} from '../src/lib/rep-counter';

console.log('🧪 Starting Biomechanical Kinematics & Rep Counter Test Suite...\n');

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

// -------------------------------------------------------------
// Test 1: Angle Calculation Accuracy
// -------------------------------------------------------------
console.log('Test 1: Vector Angle Trigonometry:');
const pointA: Keypoint = { x: 0, y: 100, score: 0.9 };
const pointB: Keypoint = { x: 0, y: 0, score: 0.9 };
const pointC: Keypoint = { x: 100, y: 0, score: 0.9 };
const angle90 = calculateAngle(pointA, pointB, pointC);
assert(angle90 === 90, `90-degree corner: expected 90, got ${angle90}°`);

const straightA: Keypoint = { x: 0, y: -100, score: 0.9 };
const straightB: Keypoint = { x: 0, y: 0, score: 0.9 };
const straightC: Keypoint = { x: 0, y: 100, score: 0.9 };
const angle180 = calculateAngle(straightA, straightB, straightC);
assert(angle180 === 180, `180-degree straight line: expected 180, got ${angle180}°`);

// -------------------------------------------------------------
// Test 2: Push-up Full Rep Cycle (Up -> Down -> Up = +1 rep)
// -------------------------------------------------------------
console.log('\nTest 2: Push-up Rep State Machine:');
let pushupState: RepState = {
  count: 0,
  stage: 'up',
  feedback: 'Get ready',
  angle: 0,
  formQuality: 'idle',
};

// 2a. Positioned in plank / top push-up (arms extended: 170°)
const topFrame: Keypoint[] = [
  { name: 'left_shoulder', x: 100, y: 100, score: 0.9 },
  { name: 'left_elbow', x: 100, y: 150, score: 0.9 },
  { name: 'left_wrist', x: 100, y: 200, score: 0.9 },
  { name: 'left_hip', x: 200, y: 100, score: 0.9 },
  { name: 'left_ankle', x: 300, y: 100, score: 0.9 },
];
pushupState = countPushups(topFrame, pushupState);
assert(pushupState.stage === 'up' && pushupState.count === 0, 'Top position: stage remains up, count is 0');

// 2b. Incomplete descent (only 120°): should NOT count as down yet
const partialFrame: Keypoint[] = [
  { name: 'left_shoulder', x: 100, y: 100, score: 0.9 },
  { name: 'left_elbow', x: 120, y: 140, score: 0.9 },
  { name: 'left_wrist', x: 100, y: 180, score: 0.9 },
  { name: 'left_hip', x: 200, y: 100, score: 0.9 },
  { name: 'left_ankle', x: 300, y: 100, score: 0.9 },
];
pushupState = countPushups(partialFrame, pushupState);
assert(pushupState.stage === 'up' && pushupState.count === 0, 'Partial depth: does not trigger false rep');

// 2c. Deep descent (Elbow bends to 80°): triggers 'down' stage
const bottomFrame: Keypoint[] = [
  { name: 'left_shoulder', x: 100, y: 100, score: 0.9 },
  { name: 'left_elbow', x: 150, y: 100, score: 0.9 },
  { name: 'left_wrist', x: 150, y: 160, score: 0.9 },
  { name: 'left_hip', x: 200, y: 100, score: 0.9 },
  { name: 'left_ankle', x: 300, y: 100, score: 0.9 },
];
pushupState = countPushups(bottomFrame, pushupState);
assert(pushupState.stage === 'down', 'Deep bottom: stage transitions to down');

// 2d. Push back to top lockout (Elbow extends > 155°): triggers count = 1!
pushupState = countPushups(topFrame, pushupState);
assert(pushupState.count === 1 && pushupState.stage === 'up', 'Full lockout: count increments to 1 rep!');

// -------------------------------------------------------------
// Test 3: Form Error Detection (Sagging Hips Warning)
// -------------------------------------------------------------
console.log('\nTest 3: Posture & Form Correction Warning:');
const saggingFrame: Keypoint[] = [
  { name: 'left_shoulder', x: 100, y: 100, score: 0.9 },
  { name: 'left_elbow', x: 100, y: 150, score: 0.9 },
  { name: 'left_wrist', x: 100, y: 200, score: 0.9 },
  { name: 'left_hip', x: 200, y: 160, score: 0.9 }, // Hips dropping down heavily
  { name: 'left_ankle', x: 300, y: 100, score: 0.9 },
];
const warningState = countPushups(saggingFrame, pushupState);
assert(
  warningState.formQuality === 'warning' && warningState.feedback.includes('sag'),
  `Sagging hips detected: warning issued ("${warningState.feedback}")`
);

// -------------------------------------------------------------
// Test 4: Squats Rep Cycle
// -------------------------------------------------------------
console.log('\nTest 4: Squats Rep State Machine:');
let squatState: RepState = {
  count: 0,
  stage: 'up',
  feedback: 'Stand tall',
  angle: 0,
  formQuality: 'idle',
};

// Standing tall (Knee straight: 175°)
const standingSquat: Keypoint[] = [
  { name: 'left_hip', x: 100, y: 100, score: 0.9 },
  { name: 'left_knee', x: 100, y: 180, score: 0.9 },
  { name: 'left_ankle', x: 100, y: 260, score: 0.9 },
];
squatState = countSquats(standingSquat, squatState);
assert(squatState.stage === 'up' && squatState.count === 0, 'Standing: stage up, count 0');

// Parallel squat depth (Knee angle 85°)
const deepSquat: Keypoint[] = [
  { name: 'left_hip', x: 60, y: 180, score: 0.9 },
  { name: 'left_knee', x: 120, y: 180, score: 0.9 },
  { name: 'left_ankle', x: 120, y: 260, score: 0.9 },
];
squatState = countSquats(deepSquat, squatState);
assert(squatState.stage === 'down', 'Deep squat: reached down stage');

// Return to standing
squatState = countSquats(standingSquat, squatState);
assert(squatState.count === 1 && squatState.stage === 'up', 'Drive to top: count increments to 1 squat!');

// -------------------------------------------------------------
// Test 5: Plank Alignment
// -------------------------------------------------------------
console.log('\nTest 5: Plank Spine Alignment:');
let plankState: RepState = {
  count: 0,
  stage: 'up',
  feedback: 'Get into plank',
  angle: 0,
  formQuality: 'idle',
};

// Perfect straight plank
const perfectPlank: Keypoint[] = [
  { name: 'left_shoulder', x: 100, y: 100, score: 0.9 },
  { name: 'left_hip', x: 200, y: 100, score: 0.9 },
  { name: 'left_ankle', x: 300, y: 100, score: 0.9 },
];
plankState = checkPlank(perfectPlank, plankState);
assert(plankState.formQuality === 'good' && plankState.stage === 'hold', 'Straight plank: form is GOOD, stage is HOLD');

// Piking hips high
const pikingPlank: Keypoint[] = [
  { name: 'left_shoulder', x: 100, y: 140, score: 0.9 },
  { name: 'left_hip', x: 200, y: 80, score: 0.9 }, // Hips sticking up
  { name: 'left_ankle', x: 300, y: 140, score: 0.9 },
];
plankState = checkPlank(pikingPlank, plankState);
assert(plankState.formQuality === 'warning' && plankState.feedback.includes('piking'), 'Piking hips: warning issued');

// -------------------------------------------------------------
// Summary
// -------------------------------------------------------------
console.log(`\n========================================`);
console.log(`Summary: ${passed} passed, ${failed} failed.`);
if (failed === 0) {
  console.log('🎉 ALL BIOMECHANICAL TESTS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.error('❌ Some tests failed.');
  process.exit(1);
}
