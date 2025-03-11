import { getFirestore, doc, getDoc } from "firebase/firestore";
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

export { getPlayerStats, getPlayerMatchHistory };
