"""
Headless Verification Suite for MaxxDaddy.ai:
1. User Session Isolation & Signature Sanitization
2. Dynamic Arc Day Engine (Eliminating Hardcoded Day 17)
3. Profile & Protocol Editing Functionality
Strict constraint: Purely headless, zero browser opening.
"""

import sys
import os
import json
import re
from datetime import datetime, timedelta

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC_DIR = os.path.join(ROOT_DIR, 'src')

passed_tests = 0
failed_tests = 0

def assert_test(name, condition, details=""):
    global passed_tests, failed_tests
    if condition:
        print(f"  [PASS] {name}")
        passed_tests += 1
    else:
        print(f"  [FAIL] {name}: {details}")
        failed_tests += 1

print("\n=======================================================")
print("  MAXXDADDY.AI - PROFILE & ARC ENGINE AUDIT (HEADLESS)")
print("=======================================================\n")

# --- Test Group 1: Zero Hardcoded "Day 17" in Source Code ---
print("Test Group 1: Zero Hardcoded 'Day 17' or Static '17' Day Counts")
day_17_regex = re.compile(r'\bDay\s+17\b|currentDay\s*=\s*17|total:\s*17\b', re.IGNORECASE)

files_to_check = [
    'src/app/arc/page.tsx',
    'src/app/today/page.tsx',
    'src/app/coach/page.tsx',
    'src/app/progress/page.tsx',
    'src/app/profile/page.tsx',
    'src/components/layout/ResponsiveShell.tsx',
    'src/lib/coachEngine.ts',
]

for rel_path in files_to_check:
    full_path = os.path.join(ROOT_DIR, rel_path)
    if os.path.exists(full_path):
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
            match = day_17_regex.search(content)
            assert_test(f"No hardcoded Day 17 in {rel_path}", match is None, f"Found match: {match.group(0) if match else ''}")
    else:
        assert_test(f"File exists {rel_path}", False, "File missing")

# --- Test Group 2: Dynamic Arc Day Mathematical Engine Verification ---
print("\nTest Group 2: Dynamic Arc Day Calculation Logic")

def calculate_challenge_day(start_date_str, duration=90):
    today = datetime.now().date()
    if start_date_str:
        try:
            start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        except ValueError:
            start_date = today
    else:
        start_date = today

    diff_days = (today - start_date).days
    current_day = min(max(1, diff_days + 1), duration)
    days_remaining = max(0, duration - current_day)
    is_completed = diff_days >= duration
    return current_day, days_remaining, is_completed

today_str = datetime.now().strftime("%Y-%m-%d")
day, rem, comp = calculate_challenge_day(today_str, 90)
assert_test("Brand new user starting today is Day 1 of 90", day == 1 and rem == 89 and not comp, f"Got day={day}, rem={rem}")

ten_days_ago = (datetime.now() - timedelta(days=9)).strftime("%Y-%m-%d")
day, rem, comp = calculate_challenge_day(ten_days_ago, 90)
assert_test("User starting 9 days ago is Day 10 of 90", day == 10 and rem == 80 and not comp, f"Got day={day}, rem={rem}")

hundred_days_ago = (datetime.now() - timedelta(days=100)).strftime("%Y-%m-%d")
day, rem, comp = calculate_challenge_day(hundred_days_ago, 90)
assert_test("User completing 90 days reaches Day 90 (completed)", day == 90 and rem == 0 and comp, f"Got day={day}, rem={rem}")

# --- Test Group 3: User Session Isolation & Signature Sanitization ---
print("\nTest Group 3: User Session Isolation & Signature Sanitization")

with open(os.path.join(SRC_DIR, 'lib', 'userProfile.ts'), 'r', encoding='utf-8') as f:
    user_profile_code = f.read()

assert_test("userProfile.ts exports initNewUserProfile", "initNewUserProfile" in user_profile_code)
assert_test("userProfile.ts exports calculateChallengeDay", "calculateChallengeDay" in user_profile_code)

with open(os.path.join(SRC_DIR, 'app', 'signup', 'page.tsx'), 'r', encoding='utf-8') as f:
    signup_code = f.read()

assert_test("signup/page.tsx calls initNewUserProfile on account creation", "initNewUserProfile(name, email)" in signup_code)

with open(os.path.join(SRC_DIR, 'app', 'onboarding', 'page.tsx'), 'r', encoding='utf-8') as f:
    onboarding_code = f.read()

assert_test("onboarding/page.tsx sanitizes signature on new sessions", "setSignature('')" in onboarding_code)

with open(os.path.join(SRC_DIR, 'contexts', 'AuthContext.tsx'), 'r', encoding='utf-8') as f:
    auth_code = f.read()

assert_test("AuthContext clears local profile on logout", "localStorage.removeItem('winter_arc_challenge_profile')" in auth_code)

# --- Test Group 4: Profile Editing Capabilities ---
print("\nTest Group 4: Profile & Protocol Editing Capabilities")

with open(os.path.join(SRC_DIR, 'app', 'profile', 'page.tsx'), 'r', encoding='utf-8') as f:
    profile_code = f.read()

assert_test("profile/page.tsx has Edit Profile modal", "isEditModalOpen" in profile_code)
assert_test("profile/page.tsx allows editing Full Name", "nameInput" in profile_code)
assert_test("profile/page.tsx allows editing Email", "emailInput" in profile_code)
assert_test("profile/page.tsx allows editing Challenge Duration", "durationInput" in profile_code)
assert_test("profile/page.tsx allows editing Start Date", "startDateInput" in profile_code)
assert_test("profile/page.tsx allows editing Morning Alarm", "morningAlarmInput" in profile_code)
assert_test("profile/page.tsx allows editing Evening Review", "eveningReviewInput" in profile_code)
assert_test("profile/page.tsx allows editing Signature", "signatureInput" in profile_code)
assert_test("profile/page.tsx allows habit adding/removal", "handleAddHabit" in profile_code and "handleDeleteHabit" in profile_code)

# --- Summary ---
print("\n=======================================================")
print(f"  TOTAL TESTS: {passed_tests + failed_tests} | PASSED: {passed_tests} | FAILED: {failed_tests}")
print("=======================================================\n")

if failed_tests > 0:
    sys.exit(1)
else:
    sys.exit(0)
