import React from 'react'
import {useParams} from "react-router";

const ChatPage: React.FC = () => {
    const {chatId} = useParams()
    return (
        <>
            <h1>Chat <span className={'font-bold'}>{chatId}</span></h1>
        </>
    )
}

export {ChatPage}

