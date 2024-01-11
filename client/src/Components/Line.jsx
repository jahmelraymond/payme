import { useStateContext } from '../Provider/contextProvider'

export default function Line() {
    const { context, setContext } = useStateContext()
    return (
        <div className="underline" style={{ width: context.underline ? '100%' : '0' }}></div>
    )
}