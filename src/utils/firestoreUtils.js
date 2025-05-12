import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Save a game result to the scoreboard collection in Firestore
 * @param {Object} gameResult - The game result object to save
 */
export const saveGameResult = async ({ username, score, gameMode, remainingTime }) => {
  try {
    if (!username || typeof username !== "string") {
      throw new Error("Invalid username");
    }
    if (!score || typeof score !== "number") {
      throw new Error("Invalid score");
    }
    if (!gameMode || typeof gameMode !== "string") {
      throw new Error("Invalid game mode");
    }
    if (remainingTime === undefined || typeof remainingTime !== "number") {
      throw new Error("Invalid remaining time");
    }

    await addDoc(collection(db, "scoreboard"), {
      username,
      score,
      gameMode,
      remainingTime,
      date: new Date().toISOString(),
    });
    console.log("Game result saved successfully!");
  } catch (error) {
    console.error("Error saving game result:", error);
  }
};

/**
 * Listen for real-time updates to the scoreboard
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} Unsubscribe function to stop listening
 */
export const listenToScoreboard = (callback) => {
  try {
    const scoreboardQuery = query(
      collection(db, "scoreboard"),
      orderBy("score", "desc") // Order by highest score
    );
    return onSnapshot(scoreboardQuery, (snapshot) => {
      const scores = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(scores);
    });
  } catch (error) {
    console.error("Error listening to scoreboard:", error);
    return () => {}; // Return a no-op function in case of error
  }
};