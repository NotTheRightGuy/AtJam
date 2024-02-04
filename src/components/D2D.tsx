import { Kbd } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useEffect, useState } from "react";

export default function D2D({ setState }) {
    const [D2DabsentStudent, setD2DabsentStudent] = useState([]);
    const [D2DpresentStudent, setD2DpresentStudent] = useState([]);
    const absentColor = "#c1121f";
    const presentColor = "#a7c957";
    const [currentNumber, setCurrentNumber] = useState(1);
    const [backgroundColor, setBackgroundColor] = useState("white");

    useEffect(() => {
        function updatePhase() {
            setState.setPresentD2D(D2DpresentStudent);
            setState.setAbsentD2D(D2DabsentStudent);
            setState.setCurrentPhase('result');
        }

        if (currentNumber > 9) {
            updatePhase();
        }
    }, [currentNumber, D2DpresentStudent, D2DabsentStudent, setState]);

    function markPresent() {
        setBackgroundColor(presentColor);
        setD2DpresentStudent((prev) => [...prev, currentNumber]);
        setTimeout(() => {
            setBackgroundColor("white");
            setCurrentNumber(e => e + 1);
        }, 100);
    }

    function markAbsent() {
        setBackgroundColor(absentColor);
        setD2DabsentStudent((prev) => [...prev, currentNumber]);
        setTimeout(() => {
            setBackgroundColor("white");
            setCurrentNumber(e => e + 1);
        }, 100);
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft') {
                markAbsent();
            } else if (e.key === 'ArrowRight') {
                markPresent();
            }
        };

        document.body.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.removeEventListener('keydown', handleKeyDown);
        };
    }, [markAbsent, markPresent]);

    return (
        <div className="h-screen flex justify-center items-center" style={{
            backgroundColor: backgroundColor
        }}>
            <section className="absolute top-4 font-medium text-2xl opacity-60">D2D</section>
            <main className="font-space text-9xl font-medium opacity-90">{currentNumber}</main>
            <section className="absolute bottom-4 w-screen justify-center flex gap-16 font-space font-bold">
                <main className="flex items-center gap-4"><Kbd><ArrowBackIcon /></Kbd> Absent</main>
                <main className="flex items-center gap-4">Present <Kbd><ArrowForwardIcon /></Kbd></main>
            </section>
        </div>
    );
}
