import {Kbd} from '@chakra-ui/react';
import {useState, useEffect} from 'react';
import {motion, useAnimation} from 'framer-motion';
import {ArrowForwardIcon, ArrowBackIcon} from '@chakra-ui/icons'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export default function Home({setState}) {
    const [isSpaceBarPressed, setIsSpaceBarPressed] = useState(false);
    const finalColor: string = '#f4a261';
    const animationControls = useAnimation();
    useEffect(() => {
        let timer: number;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === ' ' && !isSpaceBarPressed) {
                setIsSpaceBarPressed(true);

                timer = setTimeout(() => {
                    setState.setCurrentPhase('at-1');
                }, 400);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === ' ') {
                setIsSpaceBarPressed(false);
                clearTimeout(timer);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isSpaceBarPressed, animationControls, finalColor]);

    return (
        <motion.div
            className="h-screen font-space flex flex-col items-center pt-32"
            animate={animationControls}
        >
            <div className="text-8xl font-medium my-8">AtJam</div>
            <div className="grid gap-2">
                <div className="font-medium text-center p-2">
                    Hold <Kbd>space</Kbd> to start attendance
                </div>
                <div className="font-medium text-center bg-red-200 p-2 rounded-md shadow-md">
                    Press <Kbd><ArrowForwardIcon/></Kbd> to mark absent
                </div>
                <div className="font-medium text-center bg-green-200 p-2 rounded-md shadow-md">
                    Press <Kbd><ArrowBackIcon/></Kbd> to mark present
                </div>
                <button
                    className="mt-32 p-4 bg-gray-200 shadow-md text-sm font-medium hover:bg-gray-300 transition-colors ease-in-out"
                    onClick={() => {
                        setState.setCurrentPhase('result');
                    }}>Less Students? Add them manually
                </button>
            </div>
            <div className="absolute bottom-1 text-xs opacity-80">
                Made with ❤️{' '}
                <span
                    className="cursor-pointer"
                    onClick={() => window.open('https://github.com/nottherightguy', '_blank')}
                >
          @NotTheRightGuy
        </span>
            </div>
        </motion.div>
    );
}
