import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot, Label } from 'recharts';
import CircularProgress from '@mui/material/CircularProgress';

function renderDot(props) {
    const { cx, cy, dataKey, stroke, payload } = props;
    return (
        <Dot cx={cx} cy={cy} r={5} fill={stroke} />
    )
}

function formatter(data) {
    let newData = [2011, 2013, 2015, 2017].map(y => { return { season_year: y } });
    return newData.map((e) => {
        for (let i = 0; i < data.length; i++) {
            if (parseInt(data[i]['season_year']) === e['season_year']) {
                e["avg_innings_runs"] = parseInt(data[i]['avg_innings_runs']);
                break;
            }
        }
        return e;
    });
}

function FirstInnings(props) {
    // let data = props.data;
    if (Object.keys(props.data).length === 0) {
        return (<><CircularProgress /></>)
    }

    return (<ResponsiveContainer width="99%" height={400}>
        <LineChart
            data={formatter(props.data)}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <text x="53%" y={15} fill="black" textAnchor="middle" dominantBaseline="central">
                <tspan fontSize="18">Average first innings score</tspan>
            </text>
            <Line name="Runs" type="linear" dataKey="avg_innings_runs" stroke="#8884d8" dot={renderDot} isAnimationActive={true} connectNulls />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis padding={{ left: 30, right: 30 }} dataKey="season_year"><Label position="innerBottom" value="Year" /></XAxis>
            <YAxis domain={[0, dataMax => (20 * (1 + Math.floor(0.5 + dataMax / 20.0)))]}><Label position="left" angle="-90" value="Runs" /></YAxis>
            {/* <Legend wrapperStyle={{ top: 0, left: 25 }} /> */}
        </LineChart>
    </ResponsiveContainer>)
}
export default FirstInnings;