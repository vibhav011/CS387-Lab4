import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CustomTable2 from 'components/CustomTable2';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PieChart, Pie, Cell } from 'recharts';
import RectangleIcon from '@mui/icons-material/Rectangle';
import CircularProgress from '@mui/material/CircularProgress';
import { ConstructionOutlined } from '@mui/icons-material';

const headers = [
    'Batsman', '', 'Bowler', ''
]

const dummy_rows = [
    ['Mithali', '50 (85)', 'Ismail', '3-28 (10)'],
    ['Harmanpreet', '40 (41)', 'Mlaba', '2-41 (10)'],
    ['Deepti', '27 (46)', 'Luus', '1-23 (5)']
]

const dummy_rows2 = [
    ['Lee', '83 (122)', 'Jhulan', '2-38 (10)'],
    ['Wolvaardt', '80 (110)', '', ''],
    ['Luus', '1 (9)', '', '']
]

const data01 = [
    {
        "name": "Ones",
        "value": 400
    },
    {
        "name": "Twos",
        "value": 300
    },
    {
        "name": "Threes",
        "value": 500
    },
    {
        "name": "Fours",
        "value": 200
    },
    {
        "name": "Sixes",
        "value": 278
    },
    {
        "name": "Extras",
        "value": 189
    }
];
const COLORS = ['#0088FE', '#C036C7', '#FFBB28', '#C7363D','#00C49F', '#FF8042'];

function formatter(pie) {
    let mapping = {"ones": 1, "twos": 2, "threes": 3, "fours": 4, "sixes": 6, "extra_runs": 1}
    pie = pie['data']
    let ind = parseInt(pie[0]['innings_no'])-1;

    let data1 = Object.keys(pie[ind]).map(key => {
        if (mapping[key] != undefined) {
            return {
                name: key,
                value: mapping[key] * parseInt(pie[ind][key])
            }
        }
    }).filter((e) => e != undefined);
    let data2 = Object.keys(pie[1-ind]).map(key => {
        if (mapping[key] != undefined) {
            return {
                name: key,
                value: mapping[key] * parseInt(pie[1-ind][key])
            }
        }
    }).filter((e) => e != undefined);
   
    return {data1:data1, data2:data2};
}

function Summary(props) {
    let data = props.data;
    let pie = props.pie;

    if (Object.keys(data).length === 0 || Object.keys(pie).length === 0) {
        return (<><CircularProgress /></>)
    }
    const piedata = formatter(pie);
    const data1 = piedata.data1;
    const data2 = piedata.data2;

    return ( <>

    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-inner-header"
        >
            <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", marginLeft: "15%" }}>
                1082599
            </Typography>
            <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", marginLeft: "auto", marginRight: "auto" }}>
                IPL
            </Typography>
            <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", float: "right" }}>
                2017
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Card>
                <CardHeader
                    sx={{ backgroundColor: '#555359', color: '#fff' }}
                    disableTypography={true}
                    title={<b>India</b>}
                />
                <CardContent>
                    <CustomTable2 header={headers} rows={dummy_rows} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader
                    sx={{ backgroundColor: '#555359', color: '#fff' }}
                    disableTypography={true}
                    title={<b>South Africa</b>}
                />
                <CardContent>
                    <CustomTable2 header={headers} rows={dummy_rows2} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader
                    sx={{ backgroundColor: '#555359', color: '#fff', textAlign: 'center' }}
                    disableTypography={true}
                    title={<b>South Africa won by 8 wickets</b>}
                />
            </Card>
        </AccordionDetails>
    </Accordion>

    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-inner-header"
        >
            <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                Runs Distribution
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Card sx={{ marginLeft: 'auto', marginRight: 'auto', width: '400px', height: '400px', float:"left" }}>
                <CardHeader title="India" />
                <CardContent>
                    <PieChart width={400} height={400}>
                        {/* <Legend /> */}
                        <Pie isAnimationActive={false} data={data1} dataKey="value" cx="50%" cy="40%" outerRadius={100} fill="#8884d8" label>
                            {
                                data1.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))
                            }
                        </Pie>
                    </PieChart>
                </CardContent>
            </Card>

            <Card sx={{ marginLeft: 'auto', marginRight: 'auto', width: '400px', height: '400px', float:"right" }}>
                <CardHeader title="South Africa" />
                <CardContent>
                    <PieChart width={400} height={400}>
                        {/* <Legend /> */}
                        <Pie isAnimationActive={false} data={data2} dataKey="value" cx="50%" cy="40%" outerRadius={100} fill="#8884d8" label>
                            {
                                data2.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))
                            }
                        </Pie>
                    </PieChart>
                </CardContent>
            </Card>
            <br/><br/><br/>
            <CustomTable2 rows={[
          data01.map((entry, index) => (
            <>
            <RectangleIcon sx={{color:`${COLORS[index]}`}} />&nbsp;{entry.name}
            </>
          ))
            ]} />
        </AccordionDetails>

    </Accordion>
</>

    )
}

export default Summary;