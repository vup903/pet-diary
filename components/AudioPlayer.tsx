import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'
import Slider from '@react-native-community/slider';
import { Feather } from '@expo/vector-icons';

interface AudioPlayerProps {
  player: {
    play: () => void;
    pause: () => void;
    seekTo: (seconds: number) => void;
  };
  playerStatus: {
    playing: boolean;
    currentTime: number;
    duration: number;
  };
}

export default function AudioPlayer({player, playerStatus}: AudioPlayerProps) {
  /* Helper to show mm:ss */
  const mmss = (sec: number) =>
    new Date(sec * 1000).toISOString().substring(14, 19);

  const handlePlayPause = () => {
    if (!playerStatus) return;
    playerStatus.playing ? player.pause() : player.play();
  };
  /* Seek when the user releases the thumb */
  const onSeek = (seconds: number) => {
    player.seekTo(seconds);
  };

  return (
    <View style={styles.audioPlayer}>
      <View style={styles.sliderRow}>
        <Text style={styles.timeText}>
          {mmss(playerStatus.currentTime)}
        </Text>

        <Slider
          style={{ flex: 1, marginHorizontal: 10 }}
          minimumValue={0}
          maximumValue={playerStatus.duration}
          value={playerStatus.currentTime}
          onSlidingComplete={onSeek}
          minimumTrackTintColor="#7d57c7"
          maximumTrackTintColor="#ccc"
          thumbTintColor="#7d57c7"
        />

        <Text style={styles.timeText}>
          {mmss(playerStatus.duration)}
        </Text>
      </View>

      <View style={styles.audioControls}>
        <TouchableOpacity onPress={() => onSeek(playerStatus.currentTime - 5)}>
          <Feather name="rewind" size={26} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handlePlayPause()}>
          <Feather name={playerStatus.playing ? 'pause' : 'play'} size={26} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onSeek(playerStatus.currentTime + 5)}>
          <Feather name="fast-forward" size={26} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  audioPlayer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 14,
    width: 40,
    textAlign: 'center',
    color: '#333',
  },
  audioControls: {
    flexDirection: 'row',
    gap: 30,
    justifyContent: 'center',
  },
})