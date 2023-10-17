import { styled } from '@mui/system';

const SpinnerInner = styled('div')({
    "@keyframes spinner": {
        to: {
            transform: 'rotate(360deg)'
        }
    },
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid transparent',
    borderTopColor: '#000000',
    borderBottomColor: '#000000',
    animation: 'spinner 1.2s ease infinite'
});

export default function Spinner() {
    return (
        <SpinnerInner />
    )
}

