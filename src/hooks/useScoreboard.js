import { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig"; // Ensure Firebase is initialized
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

const useScoreboard = () => {
  const [globalScoreboard, setGlobalScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scoreboardQuery = query(
      collection(db, "scoreboard"),
      orderBy("score", "desc"), // Order by highest score
      limit(10) // Get top 10 players
    );

    const unsubscribe = onSnapshot(scoreboardQuery, (snapshot) => {
      const scores = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGlobalScoreboard(scores);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return { globalScoreboard, loading };
};

export default useScoreboard;