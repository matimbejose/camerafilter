import { useEffect, useState } from 'react';
import {ImageSourcePropType, View } from 'react-native';
import { styles  } from './style';
import { Camera, CameraType, FaceDetectionResult } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import Animated , { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

import neutralImg from '../assets/neutral.png';
import smilingImg from '../assets/smiling.png';
import winkingImg from '../assets/neutral.png';


export  function Home() {
  const [faceDected, setFaceDeteced] = useState(false);
  const [permission, requestPermision] = Camera.useCameraPermissions();
  const [emoji, setEmoji] = useState<ImageSourcePropType>(neutralImg);

  const faceValues = useSharedValue({
    width: 0,
    height:0,
    x: 0,
    y: 0

  });

  function handleFacesDetected({faces}: FaceDetectionResult) {
    const face = faces[0] as any;

    if(face) {
      const {  size, origin } = face.bounds;

      faceValues.value = {
        width: size.width + 20,
        height: size.height,
        x: origin.x,
        y: origin.y
      }

      setFaceDeteced(true) 

      if(face.smilingProbability > 0.5) {
        setEmoji(smilingImg);
      } 
      else if(face.leftEyeOpenProbability > 0.5 && face.rightEyeOpenProbability < 0.5) {
        setEmoji(winkingImg)
      } else {
        setEmoji(neutralImg);
      }
    } else {
      setFaceDeteced(false);
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    zIndex: 1,
    width: faceValues.value.width,
    height: faceValues.value.height,
    transform: [
      { translateX:  faceValues.value.x },
      { translateY:  faceValues.value.y}
    ],

  }))


  useEffect(() => {
    requestPermision();

  }, []);

  

  if(!permission?.granted) {
    return
  }


 
  return (
    <View style={styles.container}>
      { 
        faceDected && 
        <Animated.Image  
        style={animatedStyle} 
        source={emoji}
        
        /> 

      }
        <Camera 
        style={ styles.camera }
        type={ CameraType.front }
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
          runClassifications: FaceDetector.FaceDetectorClassifications.all,
          minDetectionInterval: 100,
          tracking: true,
        }}
        
        />
    </View>
  );
}

