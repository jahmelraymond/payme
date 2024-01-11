import React, { useContext, useState, createContext, useEffect } from 'react'
// import axios from 'axios'
// import useAuth from '../actions/useAuth'

const stateContext = createContext()

export const useStateContext = () => useContext(stateContext)

function ContextProvider({ children }) {
    const [context, setContext] = useState({
        signedIn: false,
        contactInfo: false,
        codeMatch: false,
        cardValid: false,
        skipped: false,
        invalidCard: false,
        invalidName: false,
        invalidExp: false,
        invalidCvv: false,
        invalidZip: false,
        phoneOrEmail: false,
        codeHeader: false,
        cardHeader: false,
        userHeader: false,
        passwordHeader: false,
        usernameTaken: false,
        usernamePicked: false,
        passwordsDontMatch: false,
        authenticate: false,
        matched: false,
        userProfile: false,
        search: false,
        searchBar: false,
        recent: false,
        send: false,
        logIn: true,
        userNotFound: false,
        confirmAdd: false,
        confirmDelete: false,
        contactPage: false,
        settings: false,
        usernotFound: false,
        userFound: false,
        loading: false,
        viewProfile: false,
        taken: false,
        userUnderLine: false,
        passUnderLine: false,
        alerts: false,
        privacy: false,
        support: false,
        limits: false,
        myAccount: false,
        personal: false,
        pushAlerts: false,
        fetching: false,
        transaction: false,
        sending: false,
        requesting: false,
        addBank: false,
        noBank: false,
        bankInfo: false,
        admin: false,
        adminPanel: false,
        locked: false,
        wasOnContacts: false,
        wasOnRecent: false,
        pin: false,
        enterPin: false,
        incorrectPin: false,
        input: '',
        phone: '',
        email: '',
        code: '',
        confirmCode: '',
        payTag: '',
        fullname: '',
        address: '',
        password: '',
        verifyPassord: '',
        searchKey: '',
        contacts: [],
        contactsid: [],
        results: [],
        recentActivity: [],
        find: 'Find Your Friends',
        session: '',
        profilePic: '',
        bio: '',
        contactProfile: '',
        accountBalance: '',
        paymentId: '',
        recipient: null,
        banks: []

    })
    useEffect(() => {

        // axios.get(`http://localhost:8080/user/${context.payTag}`, { withCredentials: true })
        //     .then(res => {
        //         setContext(prev => ({
        //             ...prev,
        //             fullname: res.data.fullname,
        //             phone: res.data.phonenumber,
        //             email: res.data.email,
        //             session: res.data._id,
        //             payTag: res.data.username,
        //             contacts: res.data.contacts,
        //             recentActivity: res.data.notifications,
        //             profilePic: res.data.profilePic
        //         }))
        //         console.log('context useEffect firing')
        //     })
        //     .catch(err => console.error(err))

    }, [])
    let icon = {
        fontSize: '30px',
        color: 'white',
        backgroundColor: 'royalblue',
        borderRadius: '50%',
        // margin: 'auto',
        border: 'inset black 5px',
        // padding: '10px',
        minWidth: '30px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
    let container = {
        height: '100%',
        padding: '5px',
        display: 'flex',
        alignItems: 'center'
    }
    let alert = {
        display: 'flex',
        alignItems: '',
        padding: '5px 2px 5px 5px',
        borderBottom: 'inset 1.5px black'
    }
    let username = {
        margin: '0 0 0 7px',
        textAlign: 'left',
        fontSize: '5vw',
        color: 'royalblue',
        fontWeight: '575',
        display: 'flex',
        flexDirection: 'column'

    }
    let profilePic = {
        maxWidth: '50px',
        maxHeight: '50px',

    }

    return (


        <stateContext.Provider value={{
            context,
            setContext,
            icon,
            container,
            alert,
            username,
            profilePic
        }}>
            {children}
        </stateContext.Provider>
    )

}

export default ContextProvider