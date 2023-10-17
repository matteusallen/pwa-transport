type SlideProps = {
    className: string,
    children: React.ReactNode
}

export default function Slide({children, className}: SlideProps) {
    return (
        <div className={`keen-slider__slide ${className}`}>{children}</div>
    )
}