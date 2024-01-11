import TopNav from './TopNav'
import BtmNav from './BtmNav'
import Content from './Content'
import useAuth from '../actions/useAuth';
import { useEffect, useState } from 'react'
import { useStateContext } from '../Provider/contextProvider'
import Admin from './Admin'
import User from './User'
import axios from 'axios'



export default function LoggedIn() {
    // const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.get('http://localhost:8080/loggedIn', { withCredentials: true })
            .then(user => {
                console.log('login fetch res', user.data)
                setContext(prev => ({
                    ...prev,
                    session: user.data._id,
                    admin: user.data.admin,
                    paytag: user.data.username,
                    locked: user.data.restricted
                }))
                // .finally(() => setLoading(false))
            })
            .catch(err => console.log('log in fetch err', err))
    }, [])
    const { context, setContext } = useStateContext()
    useAuth()
    const toggleSnackbar = () => {
        // if()
        let snackbar = Array.from(document.all).filter((item) => item.id === 'snackbar')[0]
        snackbar.className = 'show'
        setTimeout(() => {
            snackbar.className = snackbar.className.replace('show', '')
        }, 3000);
    }

    return (
        <div className="home" style={{ maxWidth: '100%' }} onLoad={() => toggleSnackbar()} >
            {
                context.admin ?
                    <Admin /> :
                    <User />
            }



        </div>
    )
}