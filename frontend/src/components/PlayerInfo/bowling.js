import CircularProgress from '@mui/material/CircularProgress';
import CustomTable2 from 'components/CustomTable2';
import React from 'react';
import { Bar, CartesianGrid, ComposedChart, Label, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
const bowlingHeader = [
    "Matches", "Runs", "Balls", "Overs", "Wickets", "Economy", "Five Wickets"
]
const jsonKeys = [
    "matches", "runs", "balls", "overs", "wickets", "economy", "five_wickets"
]

function CustomizedLabel(props) {
      const { x, y, value } = props;
  
      return (
    //     <div style={{left:x, top:y-10, fontSize:20, position: "absolute", backgroundColor:"#fff", zIndex:10000}}>
    //     {value}
    //   </div>
        <text x={x} y={y} dy={-10} fill="#fff" stroke="#413ea0" fontWeight="bold" fontSize={20} textAnchor="middle">
          {value}
        </text>
      );
  }

function Bowling(props) {
    let statsTable = <CircularProgress />
    if (Object.keys(props.stats).length !== 0) {
        statsTable = (<CustomTable2 header={bowlingHeader} rows={[jsonKeys.map((k) => { return props.stats[k] })]} />)
    }

    let graph = <CircularProgress />
    if (props.graph !== -1) {
        if (props.graph.length === 0) {
            graph = (<div>No Data</div>)
        } else {
            let graphData = props.graph.map((x) => {return {match_id: x["match_id"], runs: parseInt(x["runs_conceded"]), wickets: parseInt(x["wickets"])}})
            graphData.sort((a, b) => {return parseInt(a.match_id) - parseInt(b.match_id)})
            graph = (
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart width={300} height={300} margin = {{ top: 25, right: 25, bottom: 25, left: 25 }}
                        data={graphData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="match_id"><Label position="bottom" value="match_id" /></XAxis>
                        <YAxis><Label position="left" angle="-90" value="Runs" /></YAxis>
                        <Tooltip />
                        <Bar isAnimationActive={true} dataKey="runs" fill="#413ea0" />
                        <Line type="monotone" dataKey="wickets" stroke="#ff7300" label={<CustomizedLabel />}/>
                        
                    </ComposedChart>
                </ResponsiveContainer>
            )
        }
    }

    return (<>{statsTable}<br />{graph}</>)
}
export default Bowling;