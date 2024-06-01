// in MessageParser.jsx
import React from 'react';
import { useContext } from 'react';
import myContext from './Context';

const MessageParser = ({ children, actions }) => {
    const {data, setData}  = useContext(myContext);
    const parse = (message) => {
        if (message.includes('hello')) {
            actions.handleHello();
        }else{
            const data1 = actions.handleApiCall(message);
            setData(()=>data1);
        }
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child, {
                    parse: parse,
                    actions,
                });
            })}
        </div>
    );
};

export default MessageParser;