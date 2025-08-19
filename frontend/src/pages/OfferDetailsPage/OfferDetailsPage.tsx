import React from 'react'
import {useParams} from "react-router";

const OfferDetailsPage: React.FC = () => {
    const {offerId} = useParams()
    return (
        <>
            <h1>Offer <span className={'font-bold'}>{offerId}</span> Details</h1>
        </>
    )
}

export {OfferDetailsPage}
    
