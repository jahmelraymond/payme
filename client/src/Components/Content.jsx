import axios from 'axios'
import Settings from './Settings'
import { useStateContext } from '../Provider/contextProvider'
import { useEffect } from 'react'
import Recent from './Recent'
import useAuth from '../actions/useAuth';
import UserProfile from './UserProfile'
import Wallet from './Wallet'
import SideNav from './UserSideNav'
import Search from './Search'
import Home from './Home'


export default function Content() {
    useAuth()
    const { context, setContext } = useStateContext()

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:8080/refresh/',
            withCredentials: true
        }).then(res => {
            setContext(prev => ({
                ...prev,
                signedIn: true,
                fullname: res.data.user.fullname,
                phone: res.data.user.phonenumber,
                email: res.data.user.email,
                session: res.data.user._id,
                payTag: res.data.user.username,
                contacts: res.data.user.contacts,
                recentActivity: [{ added: res.data.user.added, notifications: res.data.user.notifications }],
                profilePic: res.data.user.profilePic,
                pushAlerts: res.data.user.pushNotifications
            }))
            console.log('refresh useEffect fired')


        })
            .catch(err => console.error('refresh usseffect fetch error', err))

    }, [])
    // useEffect(() => {
    //     // Function to fetch user data
    //     const fetchUserData = () => {
    //         return new Promise((resolve, reject) => {
    //             axios.get('http://localhost:8080/refresh/', {
    //                 withCredentials: true
    //             })
    //             .then(response => {
    //                 if (response.data.user) {
    //                     const userData = response.data.user;

    //                     // Store user data in local storage
    //                     localStorage.setItem('userData', JSON.stringify(userData));

    //                     // Update the state with user data
    //                     setContext(prev => ({
    //                         ...prev,
    //                         signedIn: true,
    //                         fullname: userData.fullname,
    //                         phone: userData.phonenumber,
    //                         email: userData.email,
    //                         session: userData._id,
    //                         payTag: userData.username,
    //                         contacts: userData.contacts,
    //                         recentActivity: [{ added: userData.added, notifications: userData.notifications }]
    //                     }));

    //                     resolve();
    //                 } else {
    //                     reject(new Error('User data not found'));
    //                 }
    //             })
    //             .catch(error => {
    //                 reject(error);
    //             });
    //         });
    //     };

    //     // Check if user data exists in local storage
    //     const storedUserData = localStorage.getItem('userData');

    //     if (!context.signedIn && storedUserData) {
    //         // If not signed in and user data exists in local storage, set it in the state
    //         const userData = JSON.parse(storedUserData);

    //         setContext(prev => ({
    //             ...prev,
    //             signedIn: true,
    //             fullname: userData.fullname,
    //             phone: userData.phonenumber,
    //             email: userData.email,
    //             session: userData._id,
    //             payTag: userData.username,
    //             contacts: userData.contacts,
    //             recentActivity: [{ added: userData.added, notifications: userData.notifications }]
    //         }));
    //     } else {
    //         // Fetch user data from the server using promises
    //         fetchUserData()
    //             .catch(error => {
    //                 console.error('refresh useEffect fetch error', error);
    //             });
    //     }
    // }, [context.signedIn]);



    const handleNav = () => {
        setContext(prev => ({ ...prev, userProfile: false, }))
    }




    return (

        <>
            {console.log('my context ', context)}
            <SideNav />
            <div className="content" onClick={() => handleNav()} style={{ padding: context.viewProfile ? '0' : '0 0 8px 0', overflowX: 'hidden' }}>
                {context.search ?

                    <Search />
                    : context.settings ? <Settings /> : context.recent ? <Recent /> : context.viewProfile ? <UserProfile /> : context.wallet ? <Wallet /> : <>
                        <Home />
                        <div id="snackbar">
                            {`Welcome ${context.payTag.split('').filter((item) => item !== '@').join('')} !`}
                        </div>
                    </>
                }
            </div >
        </>
    )
}