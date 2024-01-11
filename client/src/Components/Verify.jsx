import { useStateContext } from '../Provider/contextProvider'
import { useState } from 'react'
export default function Verify() {
    const { context, setContext } = useStateContext()
    const [line, setLine] = useState(false)
    const handleRetryCode = () => {
        let num1 = Math.floor((Math.random() * 1000))
        let num2 = Math.floor((Math.random() * 1000))
        if (num1 > 100) num1 += 100
        if (num2 > 100) num2 += 100
        if (num1 > 1000) num1 -= 100
        if (num2 > 1000) num2 -= 100
        setContext(prev => ({
            ...prev,
            code: `${num1}-${num2}`
        }))
    }
    const handleCode = (e) => {
        let text = e.target.value
        let pat = /[0-9]{3}-[0-9]{3}/
        if (text.match(pat))
            setContext(prev => ({
                ...prev,
                confirmCode: text
            }))
    }
    const handleConfirm = (e) => {
        let pat = /[0-9]{3}-[0-9]{3}/
        if (context.code === context.confirmCode && context.confirmCode.match(pat)) {
            setContext(prev => ({
                ...prev,
                codeMatch: true,
                contactInfo: false,
                codeHeader: false,
                addBank: true,
            }))
        }
        else {
            console.error('not a match')
        }
    }
    const toggleLine = () => {
        setLine(true)
    }
    const untoggleLine = () => {
        setLine(false)
    }
    return (

        <div className="verify">
            {console.log('verify code', context.code)}
            <div className="signInContainers">
                <input
                    type="text"
                    className='confirm'
                    onChange={(e) => handleCode(e)} placeholder="Confirmation code"
                    defaultValue=''
                    onFocus={() => toggleLine()}
                    onBlur={() => untoggleLine()}
                    style={{ paddingInlineStart: '10px' }}
                />
                <div className="underline" style={{ width: line ? '100%' : '0' }}></div>

            </div>
            <button className='next' onClick={(e) => handleConfirm(e)} style={{ width: '90%' }}>Next</button>
            <button style={{ border: 'none', textDecoration: 'underline', color: 'royalblue', fontSize: '18px' }} onClick={() => handleRetryCode()}>Didnt get code ? try again</button>
        </div>
    )
}