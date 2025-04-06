import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';

const SocialScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();


  const handleNewPostPress = () => {
    setModalVisible(true);
  };

  const handleCancelPress = () => {
    setModalVisible(false);
    setMessage('');
  };

  const handleSubmitPress = () => {
    if (message.trim() === '') return;
  
    const newPost = {
      id: Date.now().toString(),
      name: user?.email || 'Anonymous',
      date: new Date().toLocaleString(),
      message: message.trim(),
    };
  
    setPosts([newPost, ...posts]);
    setModalVisible(false);
    setMessage('');
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>♠️ PokerShark Social Feed</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <Text style={styles.postUsername}>{item.name}</Text>
            <Text style={styles.postDate}>{item.date}</Text>
            <Text style={styles.postMessage}>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.postButton} onPress={handleNewPostPress}>
          <Text style={styles.buttonText}>New Post</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancelPress}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Enter your status update</Text>
            <TextInput
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Type something..."
              placeholderTextColor="#888"
              keyboardType="default"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleSubmitPress}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleCancelPress}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  postContainer: {
    width: '100%',
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  postUsername: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  postDate: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 5,
  },
  postMessage: {
    fontSize: 14,
    color: '#fff',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  postButton: {
    backgroundColor: '#E50914',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 0,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  secondaryButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '85%',
    backgroundColor: '#1B1B1B',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 16,
  },
  textInput: {
    width: '100%',
    height: 44,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    color: '#fff',
    backgroundColor: '#2C2C2C',
  },
});

export default SocialScreen;