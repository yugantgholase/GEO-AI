// in config.js
import { createChatBotMessage } from 'react-chatbot-kit';
import DogPicture from './DogPicture.jsx';
const botName = 'Google Maps bot';


const config = {
    initialMessages: [createChatBotMessage(`Hi! I'm ${botName}`)],
    widgets: [
        {
            widgetName: 'dogPicture',
            widgetFunc: (props) => <DogPicture {...props} />,
        },
    ],
    botName: botName,
    customStyles: {
        botMessageBox: {
            backgroundColor: '#376B7E',
        },
        chatButton: {
            backgroundColor: '#5ccc9d',
        },
    },
};

export default config;