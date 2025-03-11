import React, { useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Modal, Animated, TouchableOpacity, FlatList, View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';

const MatchItem = ({name, date}) => {
  const navigation = useNavigation();  
  
  return (
      <View style={styles.matchItem}>
        <Text style={styles.matchInfo}>
          <Text style={styles.matchName}>
            {name}    
           </Text>
           {date}
        </Text>
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate('Match Details', { name, date })}
      >
          <Text style={styles.buttonText}>Details</Text>
        </TouchableOpacity>
      </View>
    );
}

const MatchHistory = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current; // Initial value for slide-up animation

  // Function to show the modal with animation
  const showModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Function to hide the modal with animation
  const hideModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  // Translate the modal based on the animated value
  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0], // Slide up from bottom
  });
  return (
    <SafeAreaView style={styles.container}>
    <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none" // Disable default modal animation
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ translateY: modalTranslateY }] },
            ]}
          >
            {/* "X" button to close the modal */}
            <TouchableOpacity style={styles.closeButton} onPress={hideModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            {/* Input fields */}
    <Text>Game Title</Text>
            <TextInput
              style={styles.input}
            />
    <Text>Date</Text>
            <TextInput
              style={styles.input}
            />
    <Text>Buy-in</Text>
            <TextInput
              style={styles.input}
            />
    <Text>Final Amount</Text>
            <TextInput
              style={styles.input}
            />
    <Text>Number of Hands Folded</Text>
            <TextInput
              style={styles.input}
            />
    <Text>Number of Hands Played</Text>
            <TextInput
              style={styles.input}
            />
    <Text>Number of VPIP Hands</Text>
            <TextInput
              style={styles.input}
            />
            {/* Submit button */}
            <Button title="Submit" onPress={() => hideModal()} />
          </Animated.View>
        </View>
      </Modal>
      <View style={styles.header}>
        <Text style={styles.title}>Match History</Text>
      </View>
      <View>
        <FlatList
          data={[
            { name: "Monday Night Poker ", date: "10/22/24", id: '1' },
            { name: "Sunday Afternoon Poker ", date: "9/22/24", id: '2' },
            { name: "Tuesday Night Poker ", date: "8/22/24", id: '3' },
            { name: "Friday Night Poker ", date: "7/22/24", id: '4' }
          ]}
          renderItem={({item}) => <MatchItem name={item.name} date={item.date} />}
          keyExtractor={item => item.id}
        />
      </View>
      <TouchableOpacity onPress={showModal} style={styles.newPostButton}>
        <Text style={styles.buttonText}>New Post</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  historyContainer: {
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  matchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  matchName: {
    fontWeight: 'bold',
    marginLeft: 20,
  },
  matchInfo: {
    color: '#666',
    fontSize: 14,
  },
  detailsButton: {
    backgroundColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  newPostButton: {
    backgroundColor: 'black',
    padding: 15,
    marginHorizontal: 15,
    alignItems: 'center',
    borderRadius: 10,
    justifySelf: 'end',
    marginTop: 'auto',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default MatchHistory;
