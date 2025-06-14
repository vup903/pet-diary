import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    SafeAreaView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import RNModal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function HomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const diary = {
    id: '1',
    emotion: 'Grumpy',
    text:
      'I was awoken by a loud noise. It was the human again. I disapprove, and I will sit in the sink to protest.',
    image: require('@/assets/images/cat.png'),
    date: new Date(),
  };

  const showMenuAt = (event: any) => {
    event.target.measure((_fx: any, _fy: any, _w: any, _h: any, px: number, py: number) => {
      setMenuPosition({ x: px, y: py });
      setMenuVisible(true);
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${diary.emotion}\n${diary.text}`,
      });
    } catch {
      Alert.alert('Error', 'Share failed');
    }
  };

  const handleConfirmDate = (date: Date) => {
    setDatePickerVisible(false);
    Alert.alert('Date Updated', date.toString());
  };

  const handleEdit = () => {
    setMenuVisible(false);
    router.push({
      pathname: '/(diary)/1',
      params: { id: diary.id },
    });
  };

  const filtered = diary.text.toLowerCase().includes(searchText.toLowerCase());

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Diary</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
            <Feather name="search" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Alert.alert('Top menu')}>
            <Feather name="more-vertical" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {searchVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search diary..."
          value={searchText}
          onChangeText={setSearchText}
        />
      )}

      {filtered && (
        <View style={styles.card}>
          <TouchableOpacity onPress={() => setImageModalVisible(true)}>
            <Image source={diary.image} style={styles.image} />
          </TouchableOpacity>

          <Text style={styles.emotion}>{diary.emotion}</Text>
          <Text style={styles.text}>{diary.text}</Text>
          <Text style={styles.date}>
            {diary.date.toLocaleString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>

          <TouchableOpacity
            style={styles.menuIcon}
            onPress={showMenuAt}
          >
            <Feather name="more-horizontal" size={20} color="#555" />
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(upload)/upload-photo')}
      >
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Image Modal */}
      <Modal visible={imageModalVisible} transparent>
        <View style={styles.imageModalOverlay}>
          <Image source={diary.image} style={styles.fullImage} />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setImageModalVisible(false)}
          >
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Card Menu */}
      <RNModal
        isVisible={menuVisible}
        backdropOpacity={0.2}
        onBackdropPress={() => setMenuVisible(false)}
        style={{
          margin: 0,
          position: 'absolute',
          top: menuPosition.y - 40,
          left: menuPosition.x - 160,
        }}
      >
        <View style={styles.popoverMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={handleEdit}>
            <Feather name="edit-3" size={18} />
            <Text style={styles.menuText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setDatePickerVisible(true);
              setMenuVisible(false);
            }}
          >
            <Feather name="calendar" size={18} />
            <Text style={styles.menuText}>Edit Date</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setBookmarked(!bookmarked);
              setMenuVisible(false);
            }}
          >
            <Feather name="bookmark" size={18} />
            <Text style={styles.menuText}>{bookmarked ? 'Unbookmark' : 'Bookmark'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleShare();
              setMenuVisible(false);
            }}
          >
            <Feather name="share-2" size={18} />
            <Text style={styles.menuText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, { borderTopWidth: 1, borderTopColor: '#eee', marginTop: 6 }]}
            onPress={() => {
              Alert.alert('Deleted');
              setMenuVisible(false);
            }}
          >
            <Feather name="trash-2" size={18} color="#c0392b" />
            <Text style={[styles.menuText, { color: '#c0392b' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </RNModal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe5eb',
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  emotion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f48496',
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
  },
  date: {
    fontSize: 13,
    color: '#999',
  },
  menuIcon: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    padding: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: '#f48496',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  popoverMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: 180,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 15,
    color: '#333',
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: '#000000dd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
});
