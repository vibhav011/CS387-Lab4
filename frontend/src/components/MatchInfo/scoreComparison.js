import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { CartesianGrid, Dot, Label, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
        }); return null;
    });
    sum = 0;
    data['innings2'].map((element, i) => {
        sum += parseInt(element['runs']);
        newData[i]['innings2'] = sum;
        newData[i]['team2_wicket'] = element['wicket'];
        return null;
    });
    return newData;
}

function ScoreComparisonElement(props) {
    // let data = props.data;
    if (props.data.team1_name.length === 0) {
        return (<><CircularProgress /></>)
    }

    return (<ResponsiveContainer width="100%" height={400}>
        <LineChart
            data={formatter(props.data)}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >   
            <Line name = {props.data['team1_name'][0]['team_name']} type="monotone" dataKey="innings1" stroke="#8884d8" dot={renderDot} isAnimationActive={true} />
            <Line name = {props.data['team2_name'][0]['team_name']} type="monotone" dataKey="innings2" stroke="#82ca9d" dot={renderDot} isAnimationActive={true} />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"><Label position="bottom" value="Overs" /></XAxis>
            <YAxis><Label position="left" angle="-90" value="Runs" /></YAxis>
            <Legend wrapperStyle={{ top: 0, left: 25 }} />
        </LineChart>
    </ResponsiveContainer>)
}
export default ScoreComparisonElement;