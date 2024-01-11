import { useStateContext } from '../Provider/contextProvider'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'


export default function Login() {
    const { context, setContext } = useStateContext()

    const nav = useNavigate()
    const [line, setLine] = useState({
        emailPhoneLine: false,
        userLine: false,
        passwordLine: false
    })
    const handleContactInfo = (e) => {
        let str = e.target.value
        let emailPat = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/g
        let phonePat = /^1?[0-9]{3}-?[0-9]{3}-?[0-9]{4}/g
        if (str.match(emailPat)) {
            setContext(prev => ({ ...prev, email: str, taken: false }))
        }
        if (str.match(phonePat)) {
            setContext(prev => ({ ...prev, phone: str, taken: false }))
        }

    }

    const handleSubmitContactInfo = (e) => {
        let num1 = Math.floor((Math.random() * 1000))
        let num2 = Math.floor((Math.random() * 1000))
        if (num1 > 100) num1 += 100
        if (num2 > 100) num2 += 100
        if (!context.taken) {
            if (context.email || context.phone)
                setContext(prev => ({
                    ...prev,
                    contactInfo: true,
                    code: `${num1}-${num2}`,
                    phoneOrEmail: false,
                    codeHeader: true

                }))
        }
    }
    const handlePasswordSignIn = (e) =>
        setContext(prev => ({ ...prev, password: e.target.value }))

    const handleUsernameSignIn = (e) =>
        setContext(prev => ({ ...prev, payTag: e.target.value }))

    const verifySignIn = () => {
        return axios({
            method: "POST",
            url: `http://localhost:8080/signin/`,
            withCredentials: true,
            data: { username: context.payTag, password: context.password }
        })

            .then(res => {
                if (res.data.error) {
                    setContext(prev => ({
                        ...prev,
                        usernotFound: true
                    }))
                    return null;
                } else {
                    setContext(prev => ({
                        ...prev,
                        signedIn: true,
                        authenticate: false,
                        session: res.data.user._id
                    }))
                    return res.data.user
                }
            })
            .catch(err => console.error('verifySignin error', err))
    }
    const handleSignUp = (e) => {
        e.preventDefault()
        setContext(prev => ({
            ...prev,
            logIn: false,
            phoneOrEmail: true,
            usernotFound: false,
        }))
    }
    const handleLogin = (e) => {
        e.preventDefault()
        setContext(prev => ({
            ...prev,
            logIn: true,
            phoneOrEmail: false,
            usernotFound: false
        }))
    }
    const signIn = async (e) => {

        let validUser = await verifySignIn();

        if (validUser) {
            // do success login
            nav(`/profile/${validUser._id}`)
            // var x = document.getElementById("snackbar")
            // console.log(x)
        } else {
            //do errors on login
            console.error("invalid attempt made")
        }

    }
    const toggleLine = (e) => {
        if (e.target.name === 'password')
            setLine(prev => ({
                ...prev,
                passwordLine: true
            }))
        if (e.target.name === 'username') {
            setLine(prev => ({
                ...prev,
                userLine: true
            }))
            e.target.value = '@'
        }
        if (e.target.name === 'email/phone')
            setLine(prev => ({
                ...prev,
                emailPhoneLine: true
            }))
    }
    const untoggleLine = (e) => {
        if (e.target.name === 'password')
            setLine(prev => ({
                ...prev,
                passwordLine: false
            }))
        if (e.target.name === 'username')
            setLine(prev => ({
                ...prev,
                userLine: false
            }))
        if (e.target.name === 'email/phone')
            setLine(prev => ({
                ...prev,
                emailPhoneLine: false
            }))

    }


    return (



        <div className="loginSignUp">

            {context.logIn ?
                <>


                    <div className="signIn" style={{ width: '100%' }}>

                        <label htmlFor="username" style={{ color: line.userLine ? 'royalblue' : 'black', padding: '0 0 0 10px' }}> Username </label>
                        <div className="signInContainers">
                            <input style={{ paddingInlineStart: '10px' }} type="text" onChange={(e) => handleUsernameSignIn(e)} placeholder='@Username' name='username' onFocus={(e) => toggleLine(e)} onBlur={(e) => untoggleLine(e)} />
                            <div className="underline" style={{ width: line.userLine ? '100%' : '0' }}></div>
                        </div>

                        <label htmlFor="password" style={{ color: line.passwordLine ? 'royalblue' : 'black', padding: '0 0 0 10px' }}> Password</label>
                        <div className="signInContainers">
                            <input style={{ paddingInlineStart: '10px' }} type="password" onChange={(e) => handlePasswordSignIn(e)} placeholder='Password' name='password' onFocus={(e) => toggleLine(e)} onBlur={(e) => untoggleLine(e)} />
                            <div className="underline" style={{ width: line.passwordLine ? '100%' : '0' }}></div>

                        </div>
                        <button className='next' onClick={(e) => signIn(e)} style={{ width: '90%', margin: '10px 0 10px 0' }}>Sign In</button>


                        <button style={{ margin: '10px 0 0 0', color: 'royalblue', backgroundColor: 'transparent', border: 'none', fontSize: '18px', textDecoration: 'underline', fontWeight: '100', width: '300px' }} onClick={(e) => handleSignUp(e)}>New to payme? Sign Up</button>
                    </div>
                </>
                :
                <>
                    <div className="signInContainers">
                        <input
                            type="text"
                            className='phone'
                            placeholder='Phone or Email'
                            name='email/phone'
                            onChange={(e) => handleContactInfo(e)} onFocus={(e) => toggleLine(e)} onBlur={(e) => untoggleLine(e)} style={{ paddingInlineStart: '10px' }} />
                        <div className="underline" style={{ width: line.emailPhoneLine ? '100%' : '0' }}></div>
                        <p style={{ color: 'red', display: context.taken ? 'block' : 'none' }}></p>
                        <button className="next" onClick={(e) => handleSubmitContactInfo(e)} style={{ margin: '10px 0 0 0', }}>Next</button>
                        <button style={{ margin: '10px 0 0 0', color: 'royalblue', backgroundColor: 'transparent', border: 'none', fontSize: '18px', textDecoration: 'underline', width: 'inherit' }} onClick={(e) => handleLogin(e)}>Already have an account? Log In</button>

                    </div>
                </>
            }
        </div>

    )
}