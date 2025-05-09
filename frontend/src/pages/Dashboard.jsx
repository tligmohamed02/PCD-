import React from 'react'
import { useSelector } from 'react-redux'
import UserMeetings from '../components/UserMeetings'



const Dashboard = () => {

    const { userInfo } = useSelector((state) => state.auth)


    return (
        <>
            <UserMeetings />
        
        </>
    )
}

export default Dashboard


