import React from 'react';
import { TouchableOpacity, FlatList, View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


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
  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.newPostButton}>
        <Text style={styles.buttonText}>New Post</Text>
      </TouchableOpacity>
    </View>
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
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
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
});

export default MatchHistory;
