
import React, { useState, useEffect } from 'react';
import { View, Modal, TextInput, TouchableOpacity, Text, StyleSheet, ImageBackground, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const backgroundImage = { uri: 'https://png.pngtree.com/thumb_back/fh260/background/20190223/ourmid/pngtree-light-yellow-matte-background-material-yellowscrubsolid-backgroundclassical-image_73398.jpg' };

const EditNoteModal = ({ visible, onSave, onSaveEdit, onDelete, onClose, selectedNote, setSelectedNote, moveToTrash }) => {
  const [editedNote, setEditedNote] = useState(selectedNote);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const backAction = () => {
      handleClose(); // Navigate back when the hardware back button is pressed
      return true; // Prevent default behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); // Clean up the event listener on unmount

  }, []);

  const handleSave = () => {
    onSave(editedNote);
    setSelectedNote(null);
    setIsEditing(false);
    onClose();
  };

  const handleSaveEdit = () => {
    onSaveEdit(editedNote); // Pass the edited note to the onSaveEdit prop
    setSelectedNote(null);
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    onDelete(selectedNote);
    setSelectedNote(null);
    onClose();
    moveToTrash(selectedNote);
  };

  const handleClose = () => {
    setSelectedNote(null);
    onClose();
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleSaveEdit(); // Use the new function to handle saving the edited note
    } else {
      setIsEditing(true);
    }
  };

  useEffect(() => {
    setEditedNote(selectedNote);
    setIsEditing(false);
  }, [selectedNote]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon name="times" size={36} color="red" />
          </TouchableOpacity>
          <View style={styles.upperButtonRow}>
            <TouchableOpacity style={[styles.editsaveButton, { marginTop: 5 }]} onPress={handleToggleEdit}>
              <Text style={{ color: isEditing ? 'green' : 'blue' }}>{isEditing ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Icon name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, isEditing && styles.editableInput]}
            placeholder="Edit your note"
            onChangeText={(value) => setEditedNote(value)}
            value={editedNote}
            multiline={true}
            editable={isEditing}
          />
        </View>
      </ImageBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    textAlignVertical: 'top',
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    height: '50%',
    backgroundColor: 'white',
  },
  editableInput: {
    backgroundColor: 'lightyellow',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 20,
    padding: 5,
  },
  deleteButton: {
    right: 10,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    top: -50,
  },
  editsaveButton: {
    left: 30,
    top: -50,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    marginRight: '15%',
  },
  upperButtonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'stretch',
    left: 80,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});

export default EditNoteModal;
