import { styled } from '@mui/system';

const SpinnerWrapper = styled('div')({
    position: 'absolute',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#282828e3'
});

const SpinnerInner = styled('div')({
    "@keyframes spinner": {
        to: {
            transform: 'rotate(360deg)'
        }
    },
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '2px solid transparent',
    borderTopColor: '#ED8324',
    borderBottomColor: '#ED8324',
    animation: 'spinner 1.2s ease infinite'
});

export default function Spinner() {
    return (
        <SpinnerWrapper>
            <SpinnerInner />
        </SpinnerWrapper>
    )
}

