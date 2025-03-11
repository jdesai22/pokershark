import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, FlatList } from 'react-native';

const SocialScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [posts, setPosts] = useState([]);

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
            name: 'TEST USER',
            date: new Date().toLocaleString(),
            message: message.trim(),
        };

        setPosts([newPost, ...posts]);
        setModalVisible(false);
        setMessage('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Social Feed</Text>

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
                <TouchableOpacity style={styles.button} onPress={handleNewPostPress}>
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
                        <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>Enter your status update!</Text>
                        <TextInput
                            style={styles.textInput}
                            value={message}
                            onChangeText={setMessage}
                            keyboardType="default"
                        />
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.button} onPress={handleSubmitPress}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={handleCancelPress}>
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
        padding: 20,
        backgroundColor: '#F9F9F9',
        paddingTop: 80,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
    },
    flatListContainer: {
        paddingBottom: 20,
    },
    postContainer: {
        width: '100%',
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    postUsername: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postDate: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 5,
    },
    postMessage: {
        fontSize: 14,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 0,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textInput: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        color: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
});

export default SocialScreen;
