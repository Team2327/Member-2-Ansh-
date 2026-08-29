import { moodService } from "./services/moodService";

function App() {
  const testUserId = "mood-test-user";

  function testAddMood() {
    try {
      const mood = moodService.addMoodEntry(
        testUserId,
        4,
        "Feeling good today"
      );

      console.log("MOOD ADDED:", mood);
    } catch (error) {
      console.error("ADD MOOD ERROR:", error);
    }
  }

  function testGetMoods() {
    const moods = moodService.getMoodEntries(testUserId);

    console.log("USER MOODS:", moods);
  }

  function testLatestMood() {
    const latest = moodService.getLatestMood(testUserId);

    console.log("LATEST MOOD:", latest);
  }

  function testDeleteMood() {
    const moods = moodService.getMoodEntries(testUserId);

    if (moods.length === 0) {
      console.log("No mood entry available to delete.");
      return;
    }

    const latestMood = moods[moods.length - 1];

    moodService.deleteMoodEntry(
      testUserId,
      latestMood.id
    );

    console.log("MOOD DELETED:", latestMood.id);

    console.log(
      "MOODS AFTER DELETE:",
      moodService.getMoodEntries(testUserId)
    );
  }

  return (
    <div>
      <h1>EMORA Mood Service Test</h1>

      <button onClick={testAddMood}>
        Add Mood
      </button>

      <button onClick={testGetMoods}>
        Get My Moods
      </button>

      <button onClick={testLatestMood}>
        Get Latest Mood
      </button>

      <button onClick={testDeleteMood}>
        Delete Latest Mood
      </button>
    </div>
  );
}

export default App;