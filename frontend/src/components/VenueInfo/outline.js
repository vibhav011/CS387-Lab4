import RectangleIcon from '@mui/icons-material/Rectangle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import CustomTable2 from 'components/CustomTable2';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const legendNames = [
    "Team batting 1st won", "Team batting 2nd won", "Draw"
];
const COLORS = ['#0088FE', '#C036C7', '#FFBB28', '#C7363D', '#00C49F', '#FF8042'];

function Outline(props) {
    const pie = props.data;

    let piechart = <CircularProgress />

    if (Object.keys(pie).length !== 0) {
        const piedata = [
            {"name": legendNames[0], "value": parseInt(pie['num_batting_first_won'])},
            {"name": legendNames[1], "value": parseInt(pie['num_batting_second_won'])},
            {"name": legendNames[2], "value": parseInt(pie['num_drawn'])}
        ];

        piechart = (<>
            <Card sx={{ marginLeft: 'auto', marginRight: 'auto', width: '400px', height: '350px'}}>
                {/* <CardHeader title={team1} /> */}
                <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart margin={{ top: 50 }}>
                            {/* <Legend /> */}
                            <Tooltip />
                            <Pie isAnimationActive={true} data={piedata} dataKey="value" cx="50%" cy="40%" outerRadius={100} innerRadius={50} fill="#8884d8" label>
                                {
                                    piedata.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))
                                }
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <Typography>Total: {piedata[0]["value"]+piedata[1]["value"]+piedata[2]["value"]}</Typography>
                </CardContent>
            </Card>

            <br />
            <CustomTable2 rows={[
                legendNames.map((entry, index) => (
                    <>
                        <RectangleIcon sx={{ color: `${COLORS[index]}` }} />&nbsp;{entry}
                    </>
                ))
            ]} />
        </>)
    }

    return (<>
        {piechart}
    </>

    )
}

export default Outline;