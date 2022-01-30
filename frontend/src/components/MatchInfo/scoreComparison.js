import React, { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot, Label } from 'recharts';
import CircularProgress from '@mui/material/CircularProgress';

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label} : ${payload[0].value}`}</p>
                <p className="desc">Anything you want can be displayed here.</p>
            </div>
        );
    }

    return null;
};

function renderDot(props) {
    const { cx, cy, dataKey, stroke, payload } = props;
    let k = (dataKey === 'innings1') ? 'team1_wicket' : 'team2_wicket';
    if (payload[k]) {
        return (
            <Dot cx={cx} cy={cy} r={5} fill={stroke} />
        )
    }
    return null;
}

function formatter(data) {
    let newData = [];

    let sum = 0;
    data['innings1'].map((element, i) => {
        sum += parseInt(element['runs']);
        newData.push({
            name: i + 1,
            innings1: sum,
            team1_wicket: element['wicket']
        });
    });
    sum = 0;
    data['innings2'].map((element, i) => {
        sum += parseInt(element['runs']);
        newData[i]['innings2'] = sum;
        newData[i]['team2_wicket'] = element['wicket'];
    });
    return newData;
}

function ScoreComparisonElement(props) {
    // let data = props.data;
    if (Object.keys(props.data).length === 0) {
        return (<><CircularProgress /></>)
    }

    return (<ResponsiveContainer width={770} height={385}>
        <LineChart
            data={formatter(props.data)}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >   
            <Line name = {props.data['team1_name'][0]['team_name']} type="monotone" dataKey="innings1" stroke="#8884d8" dot={renderDot} isAnimationActive={false} />
            <Line name = {props.data['team2_name'][0]['team_name']} type="monotone" dataKey="innings2" stroke="#82ca9d" dot={renderDot} isAnimationActive={false} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"><Label position="bottom" value="Overs" /></XAxis>
            <YAxis><Label position="left" angle="-90" value="Runs" /></YAxis>
            <Legend wrapperStyle={{ top: 0, left: 25 }} />
        </LineChart>
    </ResponsiveContainer>)
}
export default ScoreComparisonElement;