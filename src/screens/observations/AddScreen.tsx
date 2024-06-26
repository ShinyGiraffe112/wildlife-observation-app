import { ObservationStackParamList } from '@/navigation/ObservationStackNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native';
import useCamera, { UseCamera } from '@/hooks/useCamera';
import styles from './style';
import ImageOrPlaceholder from '@/components/ImageOrPlaceholder';
import {ButtonSpinner, Spinner, set} from "@gluestack-ui/themed"
import { useObservations } from '@/contexts/ObservationContext';
import { LinearGradient } from 'expo-linear-gradient';

//TODO - still don't get how these types work!!!!
export type AddScreenRouteProp = RouteProp<ObservationStackParamList, 'AddObservation'>;
export type AddScreenNavigationProp = BottomTabNavigationProp<ObservationStackParamList,'AddObservation'>;

/*change text box
name box
round images etc
whitespace
desc box
submit button styling
*/

type Props = {
    route: AddScreenRouteProp;
    navigation: any;
};

const NameBox = (props: any
) => {
const [focused,setFocused] = useState(false);
return (
<TextInput 
{...props}
style={[props.style,
{backgroundColor: focused ? '#F5F5F5' : 'transparent'},
{borderBottomWidth: focused ? 2 : 1}, 
{borderColor: focused ? 'royalblue' : 'gray'}]}
autoComplete='one-time-code'//disables autocomplete, have to include due to a bug with ios 17(keyboard top bar 'flickers')
onFocus={() => {setFocused(true)}}
onBlur={() => {setFocused(false)}}
autoCapitalize="none"

/>
)

}

const AddObservationScreen = ({ route, navigation }: Props) => {

    const observations = useObservations();

    const [animalName, setAnimalName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');


    //technically this is scuffed since you're making another useCamera, does it matter? Idk, sort out later
    const image1 = useCamera(route.params?.image);
    const image2 = useCamera();
    const image3 = useCamera();

    const handleHelpPress = () => {};
  
    const handleSubmitPress = async () => {
        if (!animalName) {
          setError("Please enter the animal's name. If you are unsure, an AI classifier is available via the 'Help' button")
          return;
        } //error handling
        if(!description) {
          setError("Please enter a description e.g. where or what time of day you spotted the animal")
          return;
        }
        if (!image1.current && !image2.current && !image3.current) {
          setError("Please attach at least 1 image")
          return;
        } //error handling

        const newObservation = await observations.add({animalName, description, images: [image1, image2, image3]}); 
        //navigate to map screen, it should focus to the new observation
        navigation.navigate('Main', {screen: 'Map', params: {newObservation}});
    };
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.nameContainer}>
          <Text style={styles.label}>Name:</Text>
          <NameBox
            style={styles.animalNameInput}
            value={animalName}
            onChangeText={setAnimalName}
            placeholder="Enter the name of the animal"
          />
          <TouchableOpacity onPress={handleHelpPress} style={styles.helpButton}>
            <LinearGradient style={styles.gradient} colors={["#005FEF", "#3d8afe"]}>
                <Text style={styles.helpButtonText}>Help</Text>
            </LinearGradient>
        </TouchableOpacity>
        </View>
        <View style={styles.imagePickerContainer}>
            <ImageOrPlaceholder image={image1} style={styles.image} />
            <ImageOrPlaceholder image={image2} style={styles.image} />
            <ImageOrPlaceholder image={image3} style={styles.image} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter a description"
            multiline
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <LinearGradient style={[styles.submitButton]} colors={["#005FEF", "#3d8afe"]}>
        <TouchableOpacity onPress={handleSubmitPress} style={{width:'100%',alignItems:'center'}}>
          {observations.isUploading ? <Spinner color="white"/> : <Text style={styles.submitButtonText}>Submit</Text> }
        </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    );
  };


export default AddObservationScreen;