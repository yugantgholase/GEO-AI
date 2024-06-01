import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import config from './config.js';
import MessageParser from './MessageParser.jsx';
import ActionProvider from './ActionProvider.jsx';
import myContext from './Context.js';
import { useContext } from 'react';

function ChatBotComponent({handleApi}) {
    
    return (
        <div className='outerContainer'>
            <div >
                <Chatbot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={ActionProvider}
                />
            </div>
        </div>
    );
}

export default ChatBotComponent;
