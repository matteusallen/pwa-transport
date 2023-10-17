import Slider from '../../components/Slider/Slider';
import Slide from '../../components/Slider/Slide';
import success from '../../assets/images/magic-approval.svg';
import hundredpoints from '../../assets/images/100pts.svg';
import reward from '../../assets/images/money-hand.svg';
import { Button } from '@mui/base';

type InfoSliderProps = {
    close: Function
}

export default function InfoSlider({close}: InfoSliderProps) {
    return (
        <section className='info-slider absolute flex flex-col h-screen w-screen top-0 bg-gray-light transition-all duration-500 ease-in-out pb-6'>
            <Slider className="info-slider__slider basis-10/12 flex-auto" dots dotsClassName='flex-initial  basis-2/12'>
                <Slide className="flex justify-center items-center flex-col px-3">
                    <img className="info-slider__slide--image" src={success} />
                    <h3 className='mt-9 text-lg font-bold'>Welcome to Truckyu</h3>
                    <p className='mt-3 text-center '>Thank you for joining our community!  This first release is focused on a survey to provide feedback to your carrier twice a day so they know what you are happy and sad about and so you can tell them how much time is spent in unpaid shipping, receiving and traffic delays.</p>
                </Slide>
                <Slide className="flex justify-center items-center flex-col px-3">
                    <img className="info-slider__slide--image" src={hundredpoints} />
                    <h3 className='mt-9 text-lg font-bold'>How to earn points?</h3>
                    <p className='mt-3 text-center '>You get a point for every time you submit a survey, so please bookmark us and come back in the morning and the evening at least 8 hours apart. Right now we are in beta, but your points will still accumulate and as we add more functionality, you will have more opportunities to get points.</p>
                </Slide>
                <Slide className="flex justify-center items-center flex-col px-3">
                    <img className="info-slider__slide--image" src={reward} />
                    <h3 className='mt-9 text-lg font-bold'>How to spend your points?</h3>
                    <p className='mt-3 text-center '>Our beta version does not have the spending feature, but accumulating points will give you great benefits including free rides, coupons for entertainment and food, and other things to make your lives on the road much better.</p>
                </Slide>
            </Slider>
            <Button className='border border-black border-solid info-slider__button max-w-xs' onClick={() => close()}>Back to Survey</Button>
        </section>
    )
}