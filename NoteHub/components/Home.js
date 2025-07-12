import React, { useState, useEffect, useCallback } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import EditNoteModal from './EditNoteModal';
import AddNoteModal from './NoteInputModal';

const HomeScreen = () => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);

  const loadNotes = useCallback(async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes !== null) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [loadNotes])
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedNotes = await AsyncStorage.getItem('notes');
        if (savedNotes !== null) {
          setNotes(JSON.parse(savedNotes));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const saveNote = async (note) => {
    if (!note) return;

    try {
      let updatedNotes;

      if (selectedNoteIndex !== null) {
        updatedNotes = [...notes];
        updatedNotes[selectedNoteIndex] = note;
      } else {
        updatedNotes = [...notes, note];
      }

      const storedNotes = await AsyncStorage.getItem('notes');
      const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
      const filteredNotes = parsedNotes.filter((storedNote) => !storedNote.deleted);
      const mergedNotes = [...filteredNotes];

      if (!note.deleted) {
        mergedNotes.push(note);
      }

      await AsyncStorage.setItem('notes', JSON.stringify(mergedNotes));
      setNotes(mergedNotes);
    } catch (error) {
      console.error('Error saving note:', error);
      return;
    }

    setAddModalVisible(false);
    setNewNote('');
    setSelectedNoteIndex(null);
    setEditModalVisible(false);
  };

  const saveEditedNote = async (editedNote) => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
      const index = parsedNotes.findIndex((n) => n === notes[selectedNoteIndex]);

      if (index !== -1) {
        parsedNotes[index] = editedNote;
        await AsyncStorage.setItem('notes', JSON.stringify(parsedNotes));
        setNotes(parsedNotes);
      }
    } catch (error) {
      console.error('Error saving edited note:', error);
    }
  };

  const moveToTrash = async (note) => {
    const updatedNotes = notes.filter((n, index) => index !== selectedNoteIndex);

    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error updating notes after moving to trash:', error);
    }

    const trashedNotes = [...(await getTrashedNotes()), note];
    try {
      await AsyncStorage.setItem('trashNotes', JSON.stringify(trashedNotes));
    } catch (error) {
      console.error('Error moving note to trash:', error);
    }
  };

  const editNote = (index) => {
    setSelectedNoteIndex(index);
    setNewNote(notes[index]);
    setEditModalVisible(true);
  };

  const getTrashedNotes = async () => {
    try {
      const savedTrashNotes = await AsyncStorage.getItem('trashNotes');
      return savedTrashNotes !== null ? JSON.parse(savedTrashNotes) : [];
    } catch (error) {
      console.error('Error loading trashed notes:', error);
      return [];
    }
  };

  return (
    <ImageBackground
      source={{
        uri:
          'https://png.pngtree.com/thumb_back/fh260/background/20190223/ourmid/pngtree-light-yellow-matte-background-material-yellowscrubsolid-backgroundclassical-image_73398.jpg',
      }}
      style={styles.backgroundImage}>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {notes.length === 0 ? (
            <Text style={styles.emptyNotesText}>Empty Notes</Text>
          ) : (
            notes.slice().reverse().map((note, index) => (
              <TouchableOpacity key={index} onPress={() => editNote(notes.length - index - 1)}>
                <View style={styles.noteContainer}>
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <View style={styles.centeredButtonContainer}>
          <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
            <Text style={styles.addButtonIcon}>+</Text>
          </TouchableOpacity>
        </View>

        <AddNoteModal
          visible={isAddModalVisible}
          onSave={saveNote}
          onClose={() => setAddModalVisible(false)}
          newNote={newNote}
          setNewNote={setNewNote}
        />
        <EditNoteModal
          visible={isEditModalVisible}
          onSave={saveNote}
          onSaveEdit={saveEditedNote}
          onClose={() => setEditModalVisible(false)}
          selectedNote={newNote}
          setSelectedNote={setNewNote}
          onDelete={moveToTrash}
          moveToTrash={moveToTrash}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  noteContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 30,
    borderRadius: 5,
  },
  noteText: {
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: {
    fontSize: 30,
    color: 'black',
  },
  centeredButtonContainer: {
    position: 'absolute',
    justifyContent: 'bottom',
    alignItems: 'center',
    bottom: -10,
    left: 0,
    right: 0,
    top: 0,
  },
  emptyNotesText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
    marginTop: 280,
  },
});

export default HomeScreen;