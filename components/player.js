import React, { useState } from "react";
import TrackPlayer, {
  useTrackPlayerProgress,
  usePlaybackState,
  useTrackPlayerEvents
} from "react-native-track-player";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Slider
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
// import Slider from '@react-native-community/slider';

//Method that shows progress bar with timestamps
function ProgressBar() {
  const progress = useTrackPlayerProgress();

    //Method used to add 0 at start if number is smaller than 10 so it would show like - 05 instead of 5
    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };

    //View that contains timestamp for position of song right now
    // and progress bar and timestamp of full duration
    return (
      <View style={{flexDirection:'row'}}>
      <Text style={styles.progressText}>{padWithZero(Math.floor(progress.position / 60))}:{padWithZero(Math.floor(progress.position % 60))}</Text>
        <View style={styles.progress}>

          {/* Slider used as seekbar to seek to specific moment in song and shows current position in song */}
          <Slider
            style={{width: '100%', height: 5, justifyContent: 'center'}}
            minimumValue={0}
            maximumValue={progress.duration}
            minimumTrackTintColor="cyan"
            maximumTrackTintColor="#000000"
            value={progress.position}
            onValueChange={(value) => {
              TrackPlayer.pause();
            }}
            onSlidingComplete={(value) => {
              TrackPlayer.seekTo(value);
              TrackPlayer.play();
            }}
          />
          
        </View>
        <Text style={styles.progressText}>{padWithZero(Math.floor(progress.duration / 60))}:{padWithZero(Math.floor(progress.duration % 60))}</Text>
      </View>
    );
}

//Method used to to show some info and buttons
export default function Player(props) {
  const playbackState = usePlaybackState();
  //Initializing empty state for title and artist
  const [trackTitle, setTrackTitle] = useState("");
  const [trackArtist, setTrackArtist] = useState("");
  //If playback state changes then update and set title and artist
  useTrackPlayerEvents(["playback-track-changed"], async event => {
    if (event.type === TrackPlayer.TrackPlayerEvents.PLAYBACK_TRACK_CHANGED) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const { title, artist } = track || {};
      setTrackTitle(title);
      setTrackArtist(artist);
    }
  });


  //View that holds current song title and artist and 3 button that will trigger props methods when pressed
  const { style, onNext, onPrevious, onTogglePlayback } = props;

  //3 buttons for previous, next song and toggle between play and pause
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}><Text style={{fontWeight: 'bold'}}>{trackArtist}</Text> - {trackTitle}</Text>
      
      <ProgressBar />
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButtonContainer} onPress={onPrevious}>
          <Icon style={styles.controlButtonIcon} name="backward"/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButtonContainer} onPress={onTogglePlayback}>
          {playbackState === TrackPlayer.STATE_PLAYING ||
            playbackState === TrackPlayer.STATE_BUFFERING ? (
              <Icon style={styles.controlButtonIcon} name="pause"/>
            ) : (
              <Icon style={styles.controlButtonIcon} name="play"/>
            )
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButtonContainer} onPress={onNext}>
          <Icon style={styles.controlButtonIcon} name="forward"/>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    elevation: 1,
    borderRadius: 4,
    shadowRadius: 2,
    shadowOpacity: 0.1,
    alignItems: "center",
    shadowColor: "black",
    backgroundColor: "#005766",
    shadowOffset: { width: 0, height: 1 }
  },
  cover: {
    width: 140,
    height: 140,
    marginTop: 20,
    backgroundColor: "grey"
  },
  progress: {
    height: 7,
    width: "75%",
    marginTop: 10,
    flexDirection: "row"
  },
  progressText: {
    color: 'black',
    marginHorizontal: 10,
  },
  title: {
    marginTop: 10
  },
  controls: {
    marginVertical: 20,
    flexDirection: "row"
  },
  controlButtonContainer: {
    flex: 1
  },
  controlButtonIcon: {
    fontSize: 24,
    textAlign: "center"
  }
});