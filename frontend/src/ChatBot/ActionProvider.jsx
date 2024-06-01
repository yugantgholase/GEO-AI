import React from 'react';
import axios from 'axios'
import { useContext } from 'react';
import myContext from "../App"

const ActionProvider = ({ createChatBotMessage, setState, children, data }) => {
    // const {data} = useContext(myContext);
    const handleApiCall = async (user_input) => {
        // console.log(data);
        const response = await axios.post("http://127.0.0.1:8000/getAnswer", {
            user_input: user_input
        });

        const placeType = response.data.response['Type of places'];
        const radius = response.data.response['radius'];

        const summaryResponse = await axios.get("http://127.0.0.1:8000/getSummaryOfPlaces", {
            params : {
                place_type : placeType, 
                radius : radius
            }
        })
        const responseData = summaryResponse.data.response
        console.log(responseData);
        responseData.forEach(place => {
            const name = place.name;
            const location = place.location;
            const rating = place.rating;
            const openNow = place.open_now ? 'Open' : 'Closed';
          
            // Concatenate details into a string
            const placeString = `${name}\nLocation: ${JSON.stringify(location)}\nRating: ${rating}\nStatus: ${openNow}`;

            createApiMessage(placeString);
        });
        
        


        return { radius, placeType };
    }

    const createApiMessage = (message) => {
        const botMessage = createChatBotMessage(message);
        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    }
    const handleHello = () => {
        const botMessage = createChatBotMessage('Hello. Nice to meet you.');

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };

    const handleDog = () => {
        const botMessage = createChatBotMessage(
            "Here's a nice dog picture for you!",
            {
                widget: 'dogPicture',
            }
        );

        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, botMessage],
        }));
    };

    // Put the handleHello and handleDog function in the actions object to pass to the MessageParser
    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    actions: {
                        handleHello,
                        handleDog,
                        createApiMessage,
                        handleApiCall
                    },
                });
            })}
        </div>
    );
};

export default ActionProvider;