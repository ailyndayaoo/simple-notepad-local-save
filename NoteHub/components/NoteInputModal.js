import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  ImageBackground,
  Text,
  Animated,
  Easing,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const backgroundImage = {
  uri:
    'https://png.pngtree.com/thumb_back/fh260/background/20190223/ourmid/pngtree-light-yellow-matte-background-material-yellowscrubsolid-backgroundclassical-image_73398.jpg',
};

function NoteInputModal({ visible, onSave, onClose, newNote, setNewNote }) {
  const textInputRef = useRef(null);
  const [animation] = useState(new Animated.Value(1));

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => {
      backHandler.remove();
    };
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const zoomIn = Animated.timing(animation, {
        toValue: 1.2,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      });

      const zoomOut = Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      });

      const loopAnimation = Animated.loop(Animated.sequence([zoomIn, zoomOut]));

      loopAnimation.start();
      textInputRef.current.focus();
    } else {
      animation.stopAnimation();
      animation.setValue(1);
    }
  }, [visible]);

  const handleSave = () => {
    onSave(newNote);
  };

  const handleCancel = () => {
    setNewNote('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.modalContainer} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.closeIcon} onPress={handleCancel}>
            <Icon name="close" size={36} color="red" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.headerText}>Create a </Text>
            <Animated.Text
              style={[
                styles.headerText,
                {
                  transform: [{ scale: animation }],
                  fontSize: 40,
                  color: '#FFD700',
                  textShadowColor: 'rgba(0, 0, 0, 0.75)',
                  textShadowOffset: { width: 2, height: 2 },
                  textShadowRadius: 10,
                },
              ]}
            >
              New Note
            </Animated.Text>
          </View>

          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            placeholder="Enter your note"
            onChangeText={(value) => setNewNote(value)}
            value={newNote}
            multiline={true}
            numberOfLines={4}
            minHeight={50}
            maxHeight={200}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.saveButton, !newNote ? styles.saveButtonDisabled : null]}
            onPress={handleSave}
            disabled={!newNote}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  header: {
    marginBottom: 90,
    marginTop: -140,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  saveButton: {
    backgroundColor: '#0096FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
});

export default NoteInputModal;
