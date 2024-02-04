import { useEffect, useRef } from "react";
import { DeleteIcon } from '@chakra-ui/icons';
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import {mkConfig, generateCsv, download} from "export-to-csv";

export default function Result({ setState, getState }) {
    const present = getState.present;
    const absent = getState.absent;
    const presentD2D = getState.presentD2D;
    const absentD2D = getState.absentD2D;

    const numberRef = useRef();
    const lectureRef = useRef();

    function moveToAbsent(number, isD2D) {
        setState.setPresent((prev) => prev.filter((n) => n !== number));
        setState.setAbsent((prev) => [...prev, number]);

        if (isD2D) {
            setState.setPresentD2D((prev) => prev.filter((n) => n !== number));
            setState.setAbsentD2D((prev) => [...prev, number]);
        }
    }

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${day}-${month}-${year}`;
    }
    function downloadToCsv() {
        let lectureName = lectureRef.current.value;
        if (!lectureName) {
            lectureName = "Class";
        }

        const currentDate = getCurrentDate();
        const fileName = `${lectureName}_${currentDate}`;

        const header = ["Roll Number"];
        const data = present.concat(absent).reduce((acc, rollNumber) => {
            acc[rollNumber] = 1; // 1 represents present
            return acc;
        }, {});

        const absentRollNumbers = absentD2D.concat(absent);
        absentRollNumbers.forEach((rollNumber) => {
            if (!data[rollNumber]) {
                data[rollNumber] = 0; // 0 represents absent
            }
        });
        const csvConfig = mkConfig({ useKeysAsHeaders: true, filename:fileName });

        const csv = generateCsv(csvConfig)([data]);
        download(csvConfig)(csv);
    }

    function moveToPresent(number, isD2D) {
        setState.setAbsent((prev) => prev.filter((n) => n !== number));
        setState.setPresent((prev) => [...prev, number]);

        if (isD2D) {
            setState.setAbsentD2D((prev) => prev.filter((n) => n !== number));
            setState.setPresentD2D((prev) => [...prev, number]);
        }
    }

    function addToPresent() {
        const rollNumber = numberRef.current.value.trim();

        if (rollNumber === "") {
            // Alert or handle empty input case
            return;
        }

        // Check if the roll number already exists in the present list
        if (!present.includes(rollNumber)) {
            setState.setPresent((prev) => [...prev, rollNumber]);
            numberRef.current.value = "";
        } else {
            // Alert or handle case where roll number already exists
            console.log("Roll number already exists in the present list");
        }
    }

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === "Enter") {
                addToPresent();
            }
        };

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [addToPresent]);

    // Calculate data for pie charts
    const totalPresent = present.length + presentD2D.length;
    const totalAbsent = absent.length + absentD2D.length;

    const presentData = [
        { name: "Present", value: totalPresent },
        { name: "Absent", value: totalAbsent },
    ];

    const COLORS = ["#a7c957", "#c1121f"];

    return (
        <main className="grid grid-cols-2 h-screen">
            <div className="p-10">
                <h1 className="font-space font-bold text-4xl mb-8 underline">Attendance Report</h1>
                <div className="grid grid-cols-2">
                    <div>
                        <h1 className="font-inter text-xl underline font-medium mb-4">Present</h1>
                        {present.map(number => (
                            <div
                                className="font-space font-medium text-sm flex items-center gap-4 bg-gray-100 mb-1 w-fit px-2 rounded-sm hover:translate-x-1 hover:bg-gray-200 transition-all"
                                key={number}
                            >
                                {number}{' '}
                                <span className="cursor-pointer" onClick={() => moveToAbsent(number, false)}>
                                    <DeleteIcon />
                                </span>
                            </div>
                        ))}
                        {presentD2D.map(number => (
                            <div
                                className="font-space font-medium text-sm flex items-center gap-4 bg-gray-100 mb-1 w-fit px-2 rounded-sm hover:translate-x-1 hover:bg-gray-200 transition-all"
                                key={number}
                            >
                                D2D {number}
                                <span className="cursor-pointer" onClick={() => moveToAbsent(number, true)}>
                                    <DeleteIcon />
                                </span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h1 className="font-inter text-xl underline font-medium mb-4">Absent</h1>
                        {absent.map(number => (
                            <div
                                className="font-space font-medium text-sm flex items-center gap-4 bg-gray-100 mb-1 w-fit px-2 rounded-sm hover:-translate-x-1 hover:bg-gray-200 transition-all"
                                key={number}
                            >
                                {number}
                                <span className="cursor-pointer" onClick={() => moveToPresent(number, false)}>
                                    <DeleteIcon />
                                </span>
                            </div>
                        ))}
                        {absentD2D.map(number => (
                            <div
                                className="font-space font-medium text-sm flex items-center gap-4 bg-gray-100 mb-1 w-fit px-2 rounded-sm hover:-translate-x-1 hover:bg-gray-200 transition-all"
                                key={number}
                            >
                                D2D {number}
                                <span className="cursor-pointer" onClick={() => moveToPresent(number, true)}>
                                    <DeleteIcon />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="border-l-2 border-black border-opacity-20 p-10">
                <div className="flex gap-8 mb-10">
                    <input type="text" placeholder="Roll Number" className="font-space border-b-2 focus:outline-none" ref={numberRef} />
                    <button onClick={addToPresent} className="font-inter text-sm bg-gray-200 p-2 px-4 text-gray-700 rounded-full shadow-md hover:bg-gray-300 transition-colors">Mark as Present</button>
                </div>

                {/* Display Pie Charts */}
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={presentData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            className="font-space font-bold"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {presentData.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <input ref={lectureRef}  type="text" placeholder="Lecture Name" className="font-space border-b-2 mt-48 focus:outline-none text-2xl w-full"/>
                <br/>
                <button className="font-space mt-2 text-2xl bg-gray-300 w-full p-2 px-4 text-gray-700 rounded-full shadow-md hover:bg-gray-200 transition-colors" onClick={downloadToCsv}>Download As CSV</button>
            </div>
        </main>
    );
}
