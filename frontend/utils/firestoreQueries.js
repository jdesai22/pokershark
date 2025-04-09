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
      folded: 0,
      played: 0,
      won: 0,
      vpip_total: 0,
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

/**
 * create a function to add a new match to the player-match-history database
 * input data: uuid, match_name (string), match_date (date), buy_in (number), final_amount (number), hands_played (number), hands_won (number), hands_won_details (array of strings)
 * output data: none
 */

async function addNewMatchToPlayerMatchHistory(
  uuid,
  match_name,
  match_date,
  buy_in,
  final_amount,
  hands_played,
  hands_won,
  hands_folded,
  vpip_hands,
  hands_won_details
) {
  const docRef = doc(firestore, "player-match-history", uuid);
  // add match_name to the matches_played array stored within the document with id uuid
  const docSnap = await getDoc(docRef);

  let data;
  if (docSnap.exists()) {
    data = docSnap.data();
  } else {
    // Create a new document if it doesn't exist
    data = { match_stats: {}, matches_played: [] };
  }

  // console.log("data", data);
  data.match_stats[match_name] = {
    date: match_date,
    buy_in: buy_in,
    final_amount: final_amount,
    hands_played: hands_played,
    hands_won: hands_won,
    hands_folded: hands_folded,
    vpip_hands: vpip_hands,
    hands_won_details: hands_won_details,
  };
  data.matches_played.push(match_name);
  await setDoc(docRef, data);

  await updatePlayerStats(
    uuid,
    hands_folded,
    hands_played,
    hands_won,
    vpip_hands,
    final_amount,
    buy_in
  );
}

async function updatePlayerStats(
  uuid,
  hands_folded,
  hands_played,
  hands_won,
  vpip_hands,
  final_amount,
  buy_in
) {
  console.log("Updating player stats for:", uuid);
  const docRef = doc(firestore, "player-overall-stats", uuid);
  const docSnap = await getDoc(docRef);

  let data;
  if (docSnap.exists()) {
    data = docSnap.data();
    // console.log("data", data);
    data.folded += hands_folded;
    data.earnings.push(final_amount - buy_in);
    data.played += hands_played;
    data.won += hands_won;
    data.vpip_total += vpip_hands;
  } else {
    // Create a new document if it doesn't exist
    console.log("No player stats document exists, creating new one for:", uuid);
    data = {
      folded: hands_folded,
      earnings: [final_amount - buy_in],
      played: hands_played,
      won: hands_won,
      vpip_total: vpip_hands,
    };
  }

  // Calculate ratios for both cases
  data.fold_ratio = Math.round((data.folded / data.played) * 100) / 100;
  data.vpip = Math.round((data.vpip_total / data.played) * 100) / 100;
  data.win_loss_ratio = Math.round((data.won / data.played) * 100) / 100;

  await setDoc(docRef, data);
}

export {
  getPlayerStats,
  getPlayerMatchHistory,
  createNewPlayerStats,
  createNewPlayerMatchHistory,
  addNewMatchToPlayerMatchHistory,
  updatePlayerStats,
};
