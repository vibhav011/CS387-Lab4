import CircularProgress from '@mui/material/CircularProgress';
import CustomTable2 from 'components/CustomTable2';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
const battingHeader = [
    "Matches", "Runs", "Four", "Six", "Fifty", "HS", "Strike Rate", "Average"
]
const jsonKeys = [
    "matches", "runs", "runs_in_fours", "runs_in_sixes", "fifties", "highest_score", "strike_rate", "average"
]

function changeColor(data) {
    let runs = data["runs"]
    if (runs < 30) {
        return "#FFBB28"
    } else if (runs <= 50) {
        return "#0088FE"
    }
    return "#C7363D"
}

function Bowling(props) {
    let statsTable = <CircularProgress />
    if (Object.keys(props.stats).length !== 0) {
        statsTable = (<CustomTable2 header={battingHeader} rows={[jsonKeys.map((k) => { return props.stats[k] })]} />)
    }

    let graph = <CircularProgress />
    if (props.graph !== -1) {
        if (props.graph.length === 0) {
            graph = (<div>No Data</div>)
        } else {
            const graphData = props.graph.map((x) => {return {match_id: x["match_id"], runs: parseInt(x["match_runs"])}})
            graph = (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart width={300} height={300} margin = {{ top: 25, right: 25, bottom: 25, left: 25 }}
                        data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="match_id"><Label position="bottom" value="match_id" /></XAxis>
                        <YAxis><Label position="left" angle="-90" value="Runs" /></YAxis>
                        <Tooltip />
                        <Bar isAnimationActive={true} dataKey="runs">
                        {graphData.map((entry, index) => {
                            return <Cell key={`cell-${index}`} fill={changeColor(entry)} />
                        })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )
        }
    }

    return (<>{statsTable}<br />{graph}</>)
}
export default Bowling;