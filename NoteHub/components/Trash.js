import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

function TrashScreen() {
  const [trashNotes, setTrashNotes] = useState([]);

  const loadTrashNotes = async () => {
    try {
      const savedTrashNotes = await AsyncStorage.getItem('trashNotes');
      const reversedTrashNotes = savedTrashNotes ? JSON.parse(savedTrashNotes).reverse() : [];
      setTrashNotes(reversedTrashNotes);
    } catch (error) {
      console.error('Error loading trashed notes:', error);
    }
  };

  const deleteNotePermanently = async (index) => {
    const updatedTrashNotes = [...trashNotes];
    updatedTrashNotes.splice(index, 1);

    try {
      await AsyncStorage.setItem('trashNotes', JSON.stringify(updatedTrashNotes));
      setTrashNotes(updatedTrashNotes);
    } catch (error) {
      console.error('Error permanently deleting trashed notes:', error);
    }
  };

 const recoverNote = async (index) => {
  const recoveredNote = trashNotes[index];
  const updatedTrashNotes = [...trashNotes];
  updatedTrashNotes.splice(index, 1);

  try {
    await AsyncStorage.setItem('trashNotes', JSON.stringify(updatedTrashNotes));

    const homeNotes = await getHomeNotes();
    const updatedHomeNotes = [...homeNotes, recoveredNote];

    await AsyncStorage.setItem('notes', JSON.stringify(updatedHomeNotes));
    setTrashNotes(updatedTrashNotes);
  } catch (error) {
    console.error('Error recovering note:', error);
  }
};


  const deleteAllNotes = async () => {
    try {
      await AsyncStorage.removeItem('trashNotes');
      setTrashNotes([]);
    } catch (error) {
      console.error('Error deleting all trashed notes:', error);
    }
  };

  const getHomeNotes = async () => {
    try {
      const savedHomeNotes = await AsyncStorage.getItem('notes');
      return savedHomeNotes ? JSON.parse(savedHomeNotes) : [];
    } catch (error) {
      console.error('Error loading home notes:', error);
      return [];
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTrashNotes();
    }, [])
  );

  return (
    <ImageBackground
      source={{ uri: 'https://png.pngtree.com/thumb_back/fh260/background/20190223/ourmid/pngtree-light-yellow-matte-background-material-yellowscrubsolid-backgroundclassical-image_73398.jpg' }}
      style={styles.backgroundImage}
    >
      <ScrollView style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 10, right: 10 }}
          onPress={deleteAllNotes}
        >
          <Text style={styles.deleteAllButton}>Delete All</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 50 }}>
          {trashNotes.length === 0 ? (
            <Text style={styles.emptyTrashText}>Empty Trash</Text>
          ) : (
            trashNotes.map((note, index) => (
              <View key={index}>
                <View style={styles.noteContainer}>
                  <Text>{note}</Text>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => recoverNote(index)} style={styles.buttonStyle}>
                    <Text style={styles.recoverButtonText}>Recover</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => deleteNotePermanently(index)} style={styles.trashButton}>
                    <Icon name="trash" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 25,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '30%',
  },
  buttonStyle: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  deleteAllButton: {
    color: 'red',
    marginTop: 10,
    fontWeight: 'bold',
  },
  recoverButtonText: {
    color: 'green',
    fontWeight: 'bold',
  },
  trashButton: {
    marginStart: 30,
    borderRadius: 20,
    padding: 8,
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  emptyTrashText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginTop: 200,
  },
});

export default TrashScreen;
