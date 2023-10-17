import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react' // import from 'keen-slider/react.es' for to get an ES module
import { useState } from 'react';
import './Slider.scss'

type SliderProps = {
    className: string,
    children: React.ReactNode
    dots: boolean,
    dotsClassName: string
}


export default function Slider({className, children, dots, dotsClassName}: SliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
        initial: 0,
        slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
        },
        created() {
        setLoaded(true)
        },
    })

    return (
        <>
            <div ref={sliderRef} className={`keen-slider ${className}`}>
                {children}
            </div>
            {loaded && instanceRef.current && dots && (
                <div className={`dots ${dotsClassName}`}>
                {[
                    ...Array(instanceRef.current.track.details.slides.length).keys(),
                ].map((idx) => {
                    return (
                    <button
                        key={idx}
                        onClick={() => {
                        instanceRef.current?.moveToIdx(idx)
                        }}
                        className={"dot" + (currentSlide === idx ? " active" : "")}
                    ></button>
                    )
                })}
                </div>
            )}
        </>
    )
}

