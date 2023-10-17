import { useState } from "react"
import { useIdleTimer } from "react-idle-timer"
import { useAuthState } from "../contexts/AuthContext";
/**
 * @param onIdle - function to notify user when idle timeout is close
 * @param idleTime - number of seconds to wait before user is logged out
 */
const useIdleTimeout = ({ idleTime = 900 }) => {
    const idleTimeout = 1000 * idleTime;
    const [isIdle, setIdle] = useState(false)
    const { dispatch } = useAuthState();    

    const handleIdle = () => {
        setIdle(true)
        dispatch({ type: 'LOGOUT' });
    }

    const idleTimer = useIdleTimer({
        timeout: idleTimeout,
        onIdle: handleIdle,
        debounce: 1000
    })
    return {
        isIdle,
        setIdle,
        idleTimer
    }
}
export default useIdleTimeout;