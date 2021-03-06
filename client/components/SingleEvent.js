import React, { useCallback } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions, Linking } from 'react-native';
import Modal from 'react-native-modal';
import { saveEvent } from '../services/events';
import { LocalEventView } from '../templates/localEvents';
import { auth, db } from '../../firebase';

const SingleEvent = (props) => {
    // const userId = "mNBpiFdzucPgNIWnrAtuVJUUsUM2";
    const userId = auth.currentUser.uid;
    const event = props.event;
    const supportedUrl = props.event.eventUrl;
    const savedEventsIDArr = props.savedEventsIDArr;

    const handleLink = useCallback(async () => {
        const supported = await Linking.canOpenURL(supportedUrl);
        if (supported) {
            await Linking.openURL(supportedUrl);
        }
    }, [supportedUrl]);

    const handleSaveEvent = async () => {
        const savedEvent = {
            userId: userId,
            id: event.id,
            name: event.name,
            type: event.type,
            startDate: event.date,
            visibleUntil: event.visible,
            venueName: event.venue.name,
            venueAddress: event.venue.address + ', ' + event.venue.extended_address,
            location: {
                lat: event.venue.location.lat,
                lon: event.venue.location.lon
            },
            checkIn: false,
            imageUrl: event.imageUrl,
            eventUrl: event.eventUrl,
            hostId: event.hostId || null
        }

        //check if the user has already saved the event
        // if not, then save the event 
        await saveEvent(userId, savedEvent);

        //close modal after saving the event
        props.handlePress(null);

        //add event id to savedEventsIDArr
        props.updateSaveEventID([...savedEventsIDArr, event.id]);
    }

    return (
        <Modal
            isVisible={true}
        >
            {
                event.hostId
                ?
                ( <View style={styles.container}>

                    <Pressable
                      onPress={() => props.handlePress(null)}
                      style={{ alignSelf: "flex-end", margin: 5 }}
                    >
                      <Text style={{ fontSize: 10 }}>{"[close x]"}</Text>
                    </Pressable>
              
                    <Text style={{ fontSize: 25, fontWeight: "bold", textAlign: "center" }}>{event.name}</Text>
                    <Text style={{ fontSize: 20 }}>{event.date}</Text>
                    <Text style={{ fontSize: 16 }}>({event.type})</Text>
              
                    <Image source={{ uri: event.imageUrl }} style={styles.image} />
              
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      {event.venue.name}
                    </Text>
              
                    <Text
                      style={{ marginBottom: 10 }}
                    >{`${event.venue.address}, ${event.venue.extended_address}`}
                    </Text>
              
                    <Pressable
                      style={{ ...styles.button, backgroundColor: "#FF6B6B" }}
                      onPress={handleSaveEvent}
                    >
                      <Text style={{color: "white", fontWeight: "bold" }}>Save Event</Text>
                    </Pressable>
              
                    <Pressable style={{ ...styles.button, backgroundColor: "#4D96FF" }}>
                      <Text style={{color: "white", fontWeight: "bold" }}>More Details</Text>
                    </Pressable>
              
                  </View>

                )
                :
                (<View style={styles.container}>
                    <Pressable
                        onPress={() => props.handlePress(null)}
                        style={{ alignSelf: 'flex-end', margin: 10 }}
                    >
                        <Text>{'[close x]'}</Text>
                    </Pressable>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }}>{event.name}</Text>
                        <Text style={{ fontSize: 20, }}>{dateFormatter(event.date)}</Text>
                        <Text style={{ fontSize: 16 }}>({event.type.split('_')[0]})</Text>

                        <Image source={{ uri: event.imageUrl }} style={styles.image} />

                        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{event.venue.name}</Text>
                        <Text style={{ marginBottom: 10 }}>{`${event.venue.address}, ${event.venue.extended_address}`}</Text>

                    <Pressable style={{ ...styles.button,  backgroundColor: "#FF6B6B" }} onPress={handleSaveEvent}>
                        <Text style={{color: "white", fontWeight: "bold" }}>Save Event</Text>
                    </Pressable>

                    <Pressable style={{ ...styles.button,  backgroundColor: "#4D96FF" }} onPress={handleLink}>
                        <Text style={{color: "white", fontWeight: "bold" }}>Get Tickets</Text>
                    </Pressable>

                </View>)
            }
            
        </Modal>
    )
}

const dateFormatter = (dateStr) => {
    return `${new Date(dateStr+'Z')}`.slice(0, 21);
}

const dateFormatterLocal = (timestamp) => {
    return `${new Date(timestamp * 1000)}`.slice(0, 21);
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        padding: 10,
        width: 350,
        height: 500
    },
    image: {
        width: 320,
        height: 180,
        margin: 10,
        borderRadius: 3
    },
    button: {
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 12,
        margin: 10
    }
});

export default SingleEvent;



