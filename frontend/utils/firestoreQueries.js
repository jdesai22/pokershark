import { getFirestore, doc, getDoc, setDoc, addDoc } from "firebase/firestore";
import { firestore } from "@/config";

async function getPlayerStats(uuid) {
  const docRef = doc(firestore, "player-overall-stats", uuid); // Reference to the document

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Document data:", data);
      return data; // Access the nested player_overall_stats
    } else {
      console.log("No such document!");
      return null; // Or throw an error, depending on your error handling
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null; // Or throw an error, depending on your error handling
  }
}

async function getPlayerMatchHistory(uuid) {
  const docRef = doc(firestore, "player-match-history", uuid); // Reference to the document

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Document data:", data);
      return data; // Access the nested player_overall_stats
    } else {
      console.log("No such document!");
      return null; // Or throw an error, depending on your error handling
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null; // Or throw an error, depending on your error handling
  }
}

/**
 * create a function to create a new user in the player-overall-stats database
 * data should be { earnings: [], fold_ratio: 0, vpip: 0, win_loss_ratio: .1818}
 *  */

async function createNewPlayerStats(uuid) {
  console.log("Creating new player stats for:", uuid);
  const docRef = doc(firestore, "player-overall-stats", uuid);
  try {
    await setDoc(docRef, {
      earnings: [],
      fold_ratio: 0,
      vpip: 0,
      win_loss_ratio: 0,
    });
  } catch (error) {
    console.error("Error creating player stats:", error);
  }
}

/**
 * create a function to create a new player in the player-match-history database
 * data_should be {match_stats: {}, matches_played: []}
 */

async function createNewPlayerMatchHistory(uuid) {
  const docRef = doc(firestore, "player-match-history", uuid);
  try {
    await setDoc(docRef, { match_stats: {}, matches_played: [] });
  } catch (error) {
    console.error("Error creating player match history:", error);
  }
}

export {
  getPlayerStats,
  getPlayerMatchHistory,
  createNewPlayerStats,
  createNewPlayerMatchHistory,
};
