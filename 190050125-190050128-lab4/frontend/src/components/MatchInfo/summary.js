import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RectangleIcon from '@mui/icons-material/Rectangle';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import CustomTable2 from 'components/CustomTable2';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const headers = [
    'Batsman', '', 'Bowler', ''
]

const legendNames = [
    "Ones", "Twos", "Threes", "Fours", "Sixes", "Extras"
];
const COLORS = ['#0088FE', '#C036C7', '#FFBB28', '#C7363D', '#00C49F', '#FF8042'];

function formatter(pie) {
    let mapping = { "ones": 1, "twos": 2, "threes": 3, "fours": 4, "sixes": 6, "extra_runs": 1 }
    let mapping2 = { "ones": "Ones", "twos": "Twos", "threes": "Threes", "fours": "Fours", "sixes": "Sixes", "extra_runs": "Extras" }
    let ind = parseInt(pie[0]['innings_no']) - 1;

    let total1 = 0
    let data1 = Object.keys(pie[ind]).map(key => {
        if (mapping[key] !== undefined) {
            let x = mapping[key] * parseInt(pie[ind][key])
            total1 += x
            return {
                name: mapping2[key],
                value: x
            }
        }
        return null;
    }).filter((e) => e !== null);

    let total2 = 0
    let data2 = Object.keys(pie[1 - ind]).map(key => {
        if (mapping[key] !== undefined) {
            let x = mapping[key] * parseInt(pie[1 - ind][key])
            total2 += x
            return {
                name: mapping2[key],
                value: x
            }
        }
        return null;
    }).filter((e) => e !== null);

    return { data1: data1, data2: data2, total1: total1, total2: total2 };
}

function formatter2(data, team) {
    data = data[team]
    let rows = [];
    for (let i = 0; i < 3; i++) {
        let row = [];
        if (i < data['batsmen'].length) {
            let b = data['batsmen'][i]
            row = row.concat([b['batsman_name'], `${b['runs']} (${b['balls_faced']})`])
        } else {row = row.concat(['', ''])}
        if (i < data['bowlers'].length) {
            let b = data['bowlers'][i]
            row = row.concat([b['bowler_name'], `${b['wickets']}-${b['runs_given']} (${b['overs_bowled']})`])
        } else {row = row.concat(['', ''])}

        if (row[0] + row[1] + row[2] + row[3] === '') break;

        rows.push(row);
    }
    return rows;
}

function Summary(props) {
    const data = props.data;
    const pie = props.pie;

    let acchead = <>
        <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", marginLeft: "15%", color:"#4e4e4e" }}>
            match_id
        </Typography>
        <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", marginLeft: "auto", marginRight: "auto", color:"#4e4e4e" }}>
            IPL
        </Typography>
        <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", float: "right", color:"#4e4e4e" }}>
            Year
        </Typography>
    </>
    let tables = <CircularProgress />
    let piechart = <CircularProgress />

    if (Object.keys(pie).length !== 0) {
        const piedata = formatter(pie.data);
        const data1 = piedata.data1;
        const data2 = piedata.data2;
        let team1 = pie['team_names'][0]['team1'];
        let team2 = pie['team_names'][0]['team2'];
        let winner = pie['team_names'][0]['winner'];
        if ((piedata.total1 > piedata.total2 && team1 !== winner) ||
            (piedata.total1 < piedata.total2 && team1 === winner)) {
                team1 = [team2, team2 = team1][0];
        }

        piechart = (<>
            <Card sx={{ marginLeft: 'auto', marginRight: 'auto', width: '400px', height: '400px', float: "left" }}>
                <CardHeader title={team1} />
                <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                    <PieChart margin={{top:50}}>
                        {/* <Legend /> */}
                        <Tooltip />
                        <Pie isAnimationActive={true} data={data1} dataKey="value" cx="50%" cy="40%" outerRadius={100} fill="#8884d8" label>
                            {
                                data1.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))
                            }
                        </Pie>
                    </PieChart>
                    </ResponsiveContainer>
                    <Typography>Total: {piedata.total1}</Typography>
                </CardContent>
            </Card>

            <Card sx={{ marginLeft: 'auto', marginRight: 'auto', width: '400px', height: '400px', float: "right" }}>
                <CardHeader title={team2} />
                <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart margin={{top:50}}>
                        {/* <Legend /> */}
                        <Tooltip />
                        <Pie isAnimationActive={true} data={data2} dataKey="value" cx="50%" cy="40%" outerRadius={100} fill="#8884d8" label>
                            {
                                data2.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))
                            }
                        </Pie>
                    </PieChart>
                    </ResponsiveContainer>
                    <Typography>Total: {piedata.total2}</Typography>
                </CardContent>
            </Card>
            <br /><br /><br />
            <CustomTable2 rows={[
                legendNames.map((entry, index) => (
                    <>
                        <RectangleIcon sx={{ color: `${COLORS[index]}` }} />&nbsp;{entry}
                    </>
                ))
            ]} />
        </>)
    }

    if (Object.keys(data).length !== 0) {
        const info = data['match_info'][0];
        acchead = <>
            <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", marginLeft: "15%", color:"#4e4e4e" }}>
                {info.match_id}
            </Typography>
            <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", marginLeft: "auto", marginRight: "auto", color:"#4e4e4e" }}>
                IPL
            </Typography>
            <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", float: "right", color:"#4e4e4e" }}>
                {info.season_year}
            </Typography>
        </>

        tables = (<>
            <Card>
                <CardHeader
                    sx={{ backgroundColor: '#555359', color: '#fff' }}
                    disableTypography={true}
                    title={<b>{data.team_names.team1_name[0].team_name}</b>}
                />
                <CardContent>
                    <CustomTable2 header={headers} rows={formatter2(data, "team1")} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader
                    sx={{ backgroundColor: '#555359', color: '#fff' }}
                    disableTypography={true}
                    title={<b>{data.team_names.team2_name[0].team_name}</b>}
                />
                <CardContent>
                    <CustomTable2 header={headers} rows={formatter2(data, "team2")} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader
                    sx={{ backgroundColor: '#555359', color: '#fff', textAlign: 'center' }}
                    disableTypography={true}
                    title={<b>{info.winner} won by {info.win_margin} {info.win_type}</b>}
                />
            </Card>
        </>)
    }

    return (<>

        <Accordion defaultExpanded={false}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-inner-header"
            >
                {acchead}
            </AccordionSummary>
            <AccordionDetails>
                {tables}
            </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded={true}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2bh-content"
                id="panel2bh-inner-header"
            >
                <Typography sx={{ flexShrink: 0, fontWeight: "bold", color:"#4e4e4e" }}>
                    Runs Distribution
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {piechart}
            </AccordionDetails>

        </Accordion>
    </>

    )
}

export default Summary;